import { connectMongoDB } from '@/lib/db';
import CarbonEmission from '@/models/CarbonEmission';
import { NextResponse } from 'next/server';

// Updated emission factors based on recent data (2023-2024)
const EMISSION_FACTORS = {
  excavation: {
    excavator: 36.36, // kg CO2e per hour for a medium-sized excavator
    fuel_consumption: 25, // liters per hour
    diesel_emission: 2.68, // kg CO2e per liter of diesel
    methane: 0.1, // kg CH4 per hour of excavation (example value, adjust based on actual data)
  },
  transportation: {
    truck: 0.97, // kg CO2e per km for a heavy-duty truck
    fuel_consumption: 0.35, // liters per km
    diesel_emission: 2.68, // kg CO2e per liter of diesel
    methane: 0.005, // kg CH4 per km (example value, adjust based on actual data)
  },
  processing: {
    electricity: 0.5, // kg CO2e per kWh (average grid emission factor)
    crusher: 50, // kWh per tonne of material processed
    conveyor: 5, // kWh per tonne of material moved
    methane: 0.02, // kg CH4 per tonne processed (example value, adjust based on actual data)
  },
  overburden: {
    bulldozer: 2.5, // kg CO2e per cubic meter moved
    fuel_consumption: 30, // liters per hour
    diesel_emission: 2.68, // kg CO2e per liter of diesel
    methane: 0.05, // kg CH4 per cubic meter moved (example value, adjust based on actual data)
  },
  employee: {
    commute: 4.6, // kg CO2e per employee per day (assuming average commute)
    office: 5.4, // kg CO2e per employee per day (office energy use, etc.)
  }
};

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const { date, activity, activityValue, fromTime, toTime, employeeCount } = await req.json();

    if (!date || !activity || activityValue == null || !fromTime || !toTime || employeeCount == null) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const fromDate = new Date(fromTime);
    const toDate = new Date(toTime);
    const activityHours = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60);

    if (activityHours <= 0) {
      return NextResponse.json({ message: 'Invalid time range' }, { status: 400 });
    }

    const { activityEmission, methaneReleased } = calculateActivityEmission(activity, activityValue, activityHours);
    const employeeEmission = calculateEmployeeEmission(employeeCount, activityHours);
    const totalEmissions = activityEmission + employeeEmission;
    const perCapitaEmissions = totalEmissions / employeeCount;

    const carbonEmission = new CarbonEmission({
      date: new Date(date),
      activity,
      activityValue,
      activityHours,
      activityEmission,
      employeeEmission,
      totalEmissions,
      methaneReleased,
      fromTime: new Date(fromTime),
      toTime: new Date(toTime),
      employeeCount,
      perCapitaEmissions,
      timestamp: new Date(),
    });

    await carbonEmission.save();

    return NextResponse.json({ message: 'Carbon emission record created', carbonEmission });
  } catch (error) {
    console.error('Error creating carbon emission record:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

function calculateActivityEmission(activity: string, activityValue: number, activityHours: number): { activityEmission: number, methaneReleased: number } {
  let activityEmission = 0;
  let methaneReleased = 0;

  switch (activity) {
    case 'excavation':
      activityEmission = EMISSION_FACTORS.excavation.excavator * activityValue * activityHours;
      activityEmission += EMISSION_FACTORS.excavation.fuel_consumption * EMISSION_FACTORS.excavation.diesel_emission * activityHours;
      methaneReleased = EMISSION_FACTORS.excavation.methane * activityValue * activityHours;
      break;
    case 'transportation':
      activityEmission = EMISSION_FACTORS.transportation.truck * activityValue;
      activityEmission += EMISSION_FACTORS.transportation.fuel_consumption * EMISSION_FACTORS.transportation.diesel_emission * activityValue;
      methaneReleased = EMISSION_FACTORS.transportation.methane * activityValue;
      break;
    case 'processing':
      activityEmission = EMISSION_FACTORS.processing.electricity * EMISSION_FACTORS.processing.crusher * activityValue;
      activityEmission += EMISSION_FACTORS.processing.electricity * EMISSION_FACTORS.processing.conveyor * activityValue;
      methaneReleased = EMISSION_FACTORS.processing.methane * activityValue;
      break;
    case 'overburden':
      activityEmission = EMISSION_FACTORS.overburden.bulldozer * activityValue;
      activityEmission += (activityHours * EMISSION_FACTORS.overburden.fuel_consumption * EMISSION_FACTORS.overburden.diesel_emission) * (activityValue / 100);
      methaneReleased = EMISSION_FACTORS.overburden.methane * activityValue;
      break;
    default:
      throw new Error('Unsupported activity type');
  }

  return { activityEmission, methaneReleased };
}

function calculateEmployeeEmission(employeeCount: number, activityHours: number): number {
  const workDays = activityHours / 8; // Assuming 8-hour workdays
  return (EMISSION_FACTORS.employee.commute + EMISSION_FACTORS.employee.office) * employeeCount * workDays;
}

export async function GET(req: Request) {
  try {
    await connectMongoDB();

    const carbonEmissions = await CarbonEmission.find({});

    return NextResponse.json({ carbonEmissions });
  } catch (error) {
    console.error('Error fetching carbon emission records:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}