"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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

// Define the carbon absorption per tree per year in kg CO2
const carbonAbsorbedPerTreePerYear = 21.77; // Average value for a tree's CO2 absorption

const Page = () => {
  const [emissionsData, setEmissionsData] = useState<CarbonEmission[]>([]);
  const [currentEmissions, setCurrentEmissions] =
    useState<CarbonEmission | null>(null);
  const [averageEmissions, setAverageEmissions] = useState(0);
  const [dailyEmissions, setDailyEmissions] = useState<
    { date: string; totalEmissions: number }[]
  >([]);
  const [activityEmissions, setActivityEmissions] = useState<
    { activity: string; totalEmissions: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/carbonemission");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setEmissionsData(data.carbonEmissions);
        setCurrentEmissions(
          data.carbonEmissions[data.carbonEmissions.length - 1]
        );

        const totalEmissions = data.carbonEmissions.reduce(
          (sum: number, day: CarbonEmission) => sum + day.totalEmissions,
          0
        );
        setAverageEmissions(
          kgToTons(totalEmissions / data.carbonEmissions.length)
        );

        // Calculate daily emissions
        const dailyData = data.carbonEmissions.reduce(
          (acc: { [key: string]: number }, emission: CarbonEmission) => {
            const date = emission.date.split("T")[0]; // Extract date part
            acc[date] = (acc[date] || 0) + emission.totalEmissions;
            return acc;
          },
          {}
        );

        const sortedDailyEmissions = Object.entries(dailyData)
          .map(([date, totalEmissions]) => ({
            date,
            totalEmissions: kgToTons(totalEmissions as number),
          }))
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          ); // Sort by date

        setDailyEmissions(sortedDailyEmissions);

        // Calculate emissions by activity type
        const activityData = data.carbonEmissions.reduce(
          (acc: { [key: string]: number }, emission: CarbonEmission) => {
            acc[emission.activity] =
              (acc[emission.activity] || 0) + emission.activityEmission;
            return acc;
          },
          {}
        );

        setActivityEmissions(
          Object.entries(activityData).map(([activity, totalEmissions]) => ({
            activity,
            totalEmissions: kgToTons(totalEmissions as number),
          }))
        );

        setIsLoading(false);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to calculate the number of trees required
  const calculateTreesRequired = (emissions: number): number => {
    return emissions / carbonAbsorbedPerTreePerYear;
  };

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
            <p className="text-2xl font-bold">
              {kgToTons(currentEmissions.totalEmissions).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity Emissions</CardTitle>
            <CardDescription>Metric tons of CO2</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {kgToTons(currentEmissions.activityEmission).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Methane Released</CardTitle>
            <CardDescription>Metric tons</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {kgToTons(currentEmissions.methaneReleased).toFixed(4)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Per Capita Emissions</CardTitle>
            <CardDescription>Metric tons of CO2 per employee</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {kgToTons(currentEmissions.perCapitaEmissions).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Emissions Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyEmissions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalEmissions"
                  name="Total Emissions (Metric tons)"
                  stroke="#8884d8"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emissions by Activity Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityEmissions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activity" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="totalEmissions"
                  name="Total Emissions (Metric tons)"
                  fill="#82ca9d"
                />
              </BarChart>
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
            <p>
              <strong>Activity:</strong> {currentEmissions.activity}
            </p>
            <p>
              <strong>Activity Value:</strong> {currentEmissions.activityValue}
            </p>
            <p>
              <strong>Activity Hours:</strong> {currentEmissions.activityHours}
            </p>
            <p>
              <strong>From Time:</strong>{" "}
              {new Date(currentEmissions.fromTime).toLocaleString()}
            </p>
            <p>
              <strong>To Time:</strong>{" "}
              {new Date(currentEmissions.toTime).toLocaleString()}
            </p>
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
              Based on your average emissions of {averageEmissions.toFixed(2)}{" "}
              metric tons of CO2 per day, we recommend the following actions:
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">Number of Trees Required</h2>
            <div className="flex flex-row gap-5">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>To Offset Total Emissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {calculateTreesRequired(
                      currentEmissions.totalEmissions
                    ).toFixed(0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>For Methane Released</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {calculateTreesRequired(
                      currentEmissions.methaneReleased
                    ).toFixed(0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>For Activity Emissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {calculateTreesRequired(
                      currentEmissions.activityEmission
                    ).toFixed(0)}
                  </p>
                </CardContent>
              </Card>
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Per Employee</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {calculateTreesRequired(
                      currentEmissions.perCapitaEmissions
                    ).toFixed(0)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
