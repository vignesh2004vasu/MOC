'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Mock data for charts
const emissionsData = [
  { name: 'Excavation', emissions: 4000 },
  { name: 'Transportation', emissions: 3000 },
  { name: 'Equipment', emissions: 2000 },
  { name: 'Other', emissions: 1000 },
];

const page = () => {
  const [miningActivity, setMiningActivity] = useState({
    excavation: '',
    transportation: '',
    equipmentUsage: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMiningActivity(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mining activity data:', miningActivity);
    // Here you would typically send this data to your backend or process it
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Carbon Emissions Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Emissions</CardTitle>
            <CardDescription>Metric tons of CO2</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">10,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Carbon Sinks</CardTitle>
            <CardDescription>Metric tons of CO2 absorbed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">2,500</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Emissions</CardTitle>
            <CardDescription>Metric tons of CO2</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">7,500</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Per Capita Emissions</CardTitle>
            <CardDescription>Metric tons of CO2 per employee</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">5.2</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Input Mining Activity Data</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="excavation">Excavation (tons)</Label>
              <Input
                id="excavation"
                name="excavation"
                value={miningActivity.excavation}
                onChange={handleInputChange}
                placeholder="Enter excavation amount"
              />
            </div>
            <div>
              <Label htmlFor="transportation">Transportation (km)</Label>
              <Input
                id="transportation"
                name="transportation"
                value={miningActivity.transportation}
                onChange={handleInputChange}
                placeholder="Enter transportation distance"
              />
            </div>
            <div>
              <Label htmlFor="equipmentUsage">Equipment Usage (hours)</Label>
              <Input
                id="equipmentUsage"
                name="equipmentUsage"
                value={miningActivity.equipmentUsage}
                onChange={handleInputChange}
                placeholder="Enter equipment usage hours"
              />
            </div>
            <Button type="submit">Calculate Emissions</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emissions by Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={emissionsData}>
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
              Based on your current emissions, we recommend focusing on afforestation and adopting electric vehicles to achieve carbon neutrality.
            </AlertDescription>
          </Alert>
          <div className="mt-4 space-y-2">
            <p><strong>Clean Technologies:</strong> Implement methane capture systems and transition to renewable energy sources.</p>
            <p><strong>Afforestation:</strong> Plant approximately 50,000 trees to offset remaining emissions.</p>
            <p><strong>Renewable Energy:</strong> Install solar panels to reduce direct electricity consumption by 30%.</p>
            <p><strong>Carbon Credits:</strong> Potential to earn 5,000 carbon credits at current market rates.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;