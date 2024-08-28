import { connectMongoDB } from '@/lib/db';
import CarbonEmission from '@/models/CarbonEmission';
import { NextResponse } from 'next/server';

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

    const activityEmission = calculateActivityEmission(activityValue, activityHours);
    const methaneReleased = calculateMethaneReleased(activityHours);
    const totalEmissions = activityEmission + methaneReleased;
    const perCapitaEmissions = totalEmissions / employeeCount;

    const carbonEmission = new CarbonEmission({
      date: new Date(date),
      activity,
      activityValue,
      activityHours,
      activityEmission,
      totalEmissions,
      fromTime: new Date(fromTime),
      toTime: new Date(toTime),
      methaneReleased,
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

function calculateActivityEmission(activityValue: number, activityHours: number): number {
  return activityValue * activityHours * 0.025;
}

function calculateMethaneReleased(activityHours: number): number {
  return activityHours * 0.2;
}
