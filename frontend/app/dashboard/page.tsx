'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Define the type for our CarbonEmission data based on the schema
type CarbonEmission = {
  date: string;
  fromTime: string;
  toTime: string;
  activity: string;
  activityValue: number;
  activityHours: number;
  activityEmission: number;
  totalEmissions: number;
  methaneReleased: number;
  employeeCount: number;
  perCapitaEmissions: number;
  timestamp: string;
};

// Conversion function from kg to metric tons
const kgToTons = (kg: number): number => kg / 1000;

// Function to aggregate emissions by date
const aggregateByDate = (data: CarbonEmission[]): { date: string; totalEmissions: number }[] => {
  const aggregated: { [key: string]: number } = {};

  data.forEach(entry => {
    if (aggregated[entry.date]) {
      aggregated[entry.date] += kgToTons(entry.totalEmissions);
    } else {
      aggregated[entry.date] = kgToTons(entry.totalEmissions);
    }
  });

  return Object.keys(aggregated).map(date => ({
    date,
    totalEmissions: aggregated[date]
  }));
};

const Page = () => {
  const [emissionsData, setEmissionsData] = useState<{ date: string; totalEmissions: number }[]>([]);
  const [currentEmissions, setCurrentEmissions] = useState<CarbonEmission | null>(null);
  const [averageEmissions, setAverageEmissions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/carbonemission');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const emissions = data.carbonEmissions;
        
        // Aggregate data by date
        const aggregatedData = aggregateByDate(emissions);

        setEmissionsData(aggregatedData);
        setCurrentEmissions(emissions[emissions.length - 1]);
        
        const totalEmissions = emissions.reduce((sum: number, day: CarbonEmission) => sum + day.totalEmissions, 0);
        setAverageEmissions(kgToTons(totalEmissions / emissions.length));
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!currentEmissions) {
    return <div>No data available</div>;
  }

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
            <p className="text-2xl font-bold">{kgToTons(currentEmissions.totalEmissions).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity Emissions</CardTitle>
            <CardDescription>Metric tons of CO2</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{kgToTons(currentEmissions.activityEmission).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Methane Released</CardTitle>
            <CardDescription>Metric tons</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{kgToTons(currentEmissions.methaneReleased).toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Per Capita Emissions</CardTitle>
            <CardDescription>Metric tons of CO2 per employee</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{kgToTons(currentEmissions.perCapitaEmissions).toFixed(2)}</p>
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
              <LineChart data={emissionsData}>
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
          <CardTitle>Latest Activity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Activity:</strong> {currentEmissions.activity}</p>
            <p><strong>Activity Value:</strong> {currentEmissions.activityValue}</p>
            <p><strong>Activity Hours:</strong> {currentEmissions.activityHours}</p>
            <p><strong>From Time:</strong> {new Date(currentEmissions.fromTime).toLocaleString()}</p>
            <p><strong>To Time:</strong> {new Date(currentEmissions.toTime).toLocaleString()}</p>
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
            <p><strong>Methane Capture:</strong> Implement systems to capture and utilize the {kgToTons(currentEmissions.methaneReleased).toFixed(2)} metric tons of methane released.</p>
            <p><strong>Activity Optimization:</strong> Review and optimize the {currentEmissions.activity} process to reduce its {kgToTons(currentEmissions.activityEmission).toFixed(2)} metric tons of CO2 emissions.</p>
            <p><strong>Employee Engagement:</strong> Develop programs to help reduce the {kgToTons(currentEmissions.perCapitaEmissions).toFixed(2)} metric tons of CO2 per employee.</p>
            <p><strong>Carbon Credits:</strong> Consider purchasing carbon credits to offset the {kgToTons(currentEmissions.totalEmissions).toFixed(2)} metric tons of total emissions.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
