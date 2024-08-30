"use client";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Define types
type EmissionData = {
  year: number;
  baseline: number;
  reduced: number;
};

type ReductionStrategy = {
  name: string;
  maxReduction: number;
  currentReduction: number;
};

const CarbonReductionSimulation = () => {
  const [data, setData] = useState<EmissionData[]>([]);
  const [strategies, setStrategies] = useState<ReductionStrategy[]>([
    { name: "Tree Planting", maxReduction: 0.2, currentReduction: 0 },
    { name: "Carbon Capture", maxReduction: 0.3, currentReduction: 0 },
    { name: "Electric Machinery", maxReduction: 0.25, currentReduction: 0 },
  ]);
  const [useReduction, setUseReduction] = useState(true);

  const baselineEmissions = 1000; // Starting emissions in metric tons
  const years = 10; // Simulation duration in years

  useEffect(() => {
    generateData();
  }, [strategies, useReduction]);

  const generateData = () => {
    const newData: EmissionData[] = [];
    let currentEmissions = baselineEmissions;

    for (let year = 0; year <= years; year++) {
      const totalReduction = strategies.reduce(
        (sum, strategy) => sum + strategy.currentReduction,
        0
      );
      const reducedEmissions = useReduction
        ? currentEmissions * (1 - totalReduction)
        : currentEmissions;

      newData.push({
        year,
        baseline: currentEmissions,
        reduced: reducedEmissions,
      });

      currentEmissions *= 1.02; // Assume 2% annual increase in baseline emissions
    }

    setData(newData);
  };

  const handleStrategyChange = (index: number, value: number) => {
    const updatedStrategies = [...strategies];
    updatedStrategies[index].currentReduction = value / 100;
    setStrategies(updatedStrategies);
  };

  const calculateTotalReduction = () => {
    if (data.length === 0) return 0;
    const lastDataPoint = data[data.length - 1];
    return ((1 - lastDataPoint.reduced / lastDataPoint.baseline) * 100).toFixed(
      2
    );
  };

  const calculateEmissionsAvoided = () => {
    if (data.length === 0) return 0;
    const lastDataPoint = data[data.length - 1];
    return (lastDataPoint.baseline - lastDataPoint.reduced).toFixed(2);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Carbon Emission Reduction Simulation
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Emission Reduction Strategies</CardTitle>
          <CardDescription>
            Adjust the sliders to see the impact of different strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {strategies.map((strategy, index) => (
            <div key={strategy.name} className="space-y-2">
              <Label>{strategy.name}</Label>
              <Slider
                min={0}
                max={strategy.maxReduction * 100}
                step={1}
                value={[strategy.currentReduction * 100]}
                onValueChange={(value) => handleStrategyChange(index, value[0])}
              />
              <p>
                Current reduction:{" "}
                {(strategy.currentReduction * 100).toFixed(1)}%
              </p>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Switch
              id="use-reduction"
              checked={useReduction}
              onCheckedChange={setUseReduction}
            />
            <Label htmlFor="use-reduction">Apply Reduction Strategies</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emission Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="baseline"
                  name="Baseline Emissions"
                  stroke="#8884d8"
                />
                <Line
                  type="monotone"
                  dataKey="reduced"
                  name="Reduced Emissions"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Total reduction after {years} years: {calculateTotalReduction()}%
          </p>
          <p>
            CO2 emissions avoided: {calculateEmissionsAvoided()} metric tons
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CarbonReductionSimulation;
