'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Prepopulated data
export const miningEmissionsData = [
  {
    date: '2024-08-01',
    timestamp: 1722470400,
    excavationAmount: 1000,  // tons
    excavationEmissions: 25,  // tons CO2
    transportationDistance: 500,  // km
    transportationEmissions: 50,  // tons CO2
    equipmentUsageHours: 24,  // hours
    equipmentEmissions: 12,  // tons CO2
    methaneReleased: 5,  // tons
    electricityUsage: 1000,  // kWh
    electricityEmissions: 0.5,  // tons CO2
    totalEmissions: 92.5,  // tons CO2
    employeeCount: 100,
    perCapitaEmissions: 0.925  // tons CO2 per employee
  },
  {
    date: '2024-08-02',
    timestamp: 1722556800,
    excavationAmount: 1200,
    excavationEmissions: 30,
    transportationDistance: 450,
    transportationEmissions: 45,
    equipmentUsageHours: 22,
    equipmentEmissions: 11,
    methaneReleased: 4.5,
    electricityUsage: 950,
    electricityEmissions: 0.475,
    totalEmissions: 90.975,
    employeeCount: 98,
    perCapitaEmissions: 0.928
  },
  {
    date: '2024-08-03',
    timestamp: 1722643200,
    excavationAmount: 950,
    excavationEmissions: 23.75,
    transportationDistance: 520,
    transportationEmissions: 52,
    equipmentUsageHours: 26,
    equipmentEmissions: 13,
    methaneReleased: 5.2,
    electricityUsage: 1050,
    electricityEmissions: 0.525,
    totalEmissions: 94.475,
    employeeCount: 102,
    perCapitaEmissions: 0.926
  },
  {
    date: '2024-08-04',
    timestamp: 1722729600,
    excavationAmount: 1100,
    excavationEmissions: 27.5,
    transportationDistance: 480,
    transportationEmissions: 48,
    equipmentUsageHours: 23,
    equipmentEmissions: 11.5,
    methaneReleased: 4.8,
    electricityUsage: 980,
    electricityEmissions: 0.49,
    totalEmissions: 92.29,
    employeeCount: 99,
    perCapitaEmissions: 0.932
  },
  {
    date: '2024-08-05',
    timestamp: 1722816000,
    excavationAmount: 1050,
    excavationEmissions: 26.25,
    transportationDistance: 510,
    transportationEmissions: 51,
    equipmentUsageHours: 25,
    equipmentEmissions: 12.5,
    methaneReleased: 5.1,
    electricityUsage: 1020,
    electricityEmissions: 0.51,
    totalEmissions: 95.36,
    employeeCount: 101,
    perCapitaEmissions: 0.944
  },
  {
    date: '2024-08-06',
    timestamp: 1722902400,
    excavationAmount: 1150,
    excavationEmissions: 28.75,
    transportationDistance: 490,
    transportationEmissions: 49,
    equipmentUsageHours: 24,
    equipmentEmissions: 12,
    methaneReleased: 4.9,
    electricityUsage: 1010,
    electricityEmissions: 0.505,
    totalEmissions: 95.155,
    employeeCount: 100,
    perCapitaEmissions: 0.952
  },
  {
    date: '2024-08-07',
    timestamp: 1722988800,
    excavationAmount: 1080,
    excavationEmissions: 27,
    transportationDistance: 530,
    transportationEmissions: 53,
    equipmentUsageHours: 27,
    equipmentEmissions: 13.5,
    methaneReleased: 5.3,
    electricityUsage: 1070,
    electricityEmissions: 0.535,
    totalEmissions: 99.335,
    employeeCount: 103,
    perCapitaEmissions: 0.964
  },
  {
    date: '2024-08-08',
    timestamp: 1723075200,
    excavationAmount: 1020,
    excavationEmissions: 25.5,
    transportationDistance: 470,
    transportationEmissions: 47,
    equipmentUsageHours: 21,
    equipmentEmissions: 10.5,
    methaneReleased: 4.7,
    electricityUsage: 940,
    electricityEmissions: 0.47,
    totalEmissions: 88.17,
    employeeCount: 97,
    perCapitaEmissions: 0.909
  },
  {
    date: '2024-08-09',
    timestamp: 1723161600,
    excavationAmount: 1180,
    excavationEmissions: 29.5,
    transportationDistance: 540,
    transportationEmissions: 54,
    equipmentUsageHours: 28,
    equipmentEmissions: 14,
    methaneReleased: 5.4,
    electricityUsage: 1100,
    electricityEmissions: 0.55,
    totalEmissions: 103.45,
    employeeCount: 104,
    perCapitaEmissions: 0.995
  },
  {
    date: '2024-08-10',
    timestamp: 1723248000,
    excavationAmount: 1130,
    excavationEmissions: 28.25,
    transportationDistance: 500,
    transportationEmissions: 50,
    equipmentUsageHours: 25,
    equipmentEmissions: 12.5,
    methaneReleased: 5,
    electricityUsage: 1030,
    electricityEmissions: 0.515,
    totalEmissions: 96.265,
    employeeCount: 102,
    perCapitaEmissions: 0.944
  }
];


const page = () => {
  const [currentEmissions, setCurrentEmissions] = useState(miningEmissionsData[miningEmissionsData.length - 1]);
  const [averageEmissions, setAverageEmissions] = useState(0);

  useEffect(() => {
    const totalEmissions = miningEmissionsData.reduce((sum, day) => sum + day.totalEmissions, 0);
    setAverageEmissions(totalEmissions / miningEmissionsData.length);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Carbon Emissions Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Emissions (Latest)</CardTitle>
            <CardDescription>Metric tons of CO2</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentEmissions.totalEmissions.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Excavation Emissions</CardTitle>
            <CardDescription>Metric tons of CO2</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentEmissions.excavationEmissions.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transportation Emissions</CardTitle>
            <CardDescription>Metric tons of CO2</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentEmissions.transportationEmissions.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Equipment Emissions</CardTitle>
            <CardDescription>Metric tons of CO2</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{currentEmissions.equipmentEmissions.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Emissions Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miningEmissionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalEmissions" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emissions by Activity (Latest Day)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Excavation', emissions: currentEmissions.excavationEmissions },
                { name: 'Transportation', emissions: currentEmissions.transportationEmissions },
                { name: 'Equipment', emissions: currentEmissions.equipmentEmissions },
                { name: 'Electricity', emissions: currentEmissions.electricityEmissions },
                { name: 'Methane', emissions: currentEmissions.methaneReleased * 28 }, // GWP of methane is roughly 28 times that of CO2
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="emissions" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Carbon Neutrality Pathways</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Recommendation</AlertTitle>
            <AlertDescription>
              Based on your average emissions of {averageEmissions.toFixed(2)} metric tons of CO2 per day, we recommend the following actions:
            </AlertDescription>
          </Alert>
          <div className="mt-4 space-y-2">
            <p><strong>Clean Technologies:</strong> Implement methane capture systems and transition to renewable energy sources to reduce emissions by up to 30%.</p>
            <p><strong>Afforestation:</strong> Plant approximately {Math.ceil(averageEmissions * 50)} trees per day to offset remaining emissions.</p>
            <p><strong>Renewable Energy:</strong> Install solar panels to reduce direct electricity consumption by 30%.</p>
            <p><strong>Carbon Credits:</strong> Potential to earn {Math.ceil(averageEmissions / 2)} carbon credits per day at current market rates.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;