"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const CarbonEmissionForm = () => {
  const [formData, setFormData] = useState({
    date: "",
    activity: "",
    activityValue: "",
    fromTime: "",
    toTime: "",
    employeeCount: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("/api/carbonemission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/dashboard");
        const data = await response.json();
        console.log("Carbon emission record created", data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Submission failed");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Navbar />

      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-lg p-8 space-y-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Add Carbon Emission Data
          </h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div>
              <label
                htmlFor="activity"
                className="block text-sm font-medium text-gray-700"
              >
                Activity
              </label>
              <select
                name="activity"
                id="activity"
                value={formData.activity}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              >
                <option value="" disabled>
                  Select an activity
                </option>
                <option value="excavation">Excavation</option>
                <option value="transportation">Transportation</option>
                <option value="processing">Processing</option>
                <option value="overburden">Overburden Management</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="activityValue"
                className="block text-sm font-medium text-gray-700"
              >
                Activity Value
              </label>
              <input
                type="number"
                name="activityValue"
                id="activityValue"
                value={formData.activityValue}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div>
              <label
                htmlFor="fromTime"
                className="block text-sm font-medium text-gray-700"
              >
                From Time
              </label>
              <input
                type="datetime-local"
                name="fromTime"
                id="fromTime"
                value={formData.fromTime}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div>
              <label
                htmlFor="toTime"
                className="block text-sm font-medium text-gray-700"
              >
                To Time
              </label>
              <input
                type="datetime-local"
                name="toTime"
                id="toTime"
                value={formData.toTime}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div>
              <label
                htmlFor="employeeCount"
                className="block text-sm font-medium text-gray-700"
              >
                Employee Count
              </label>
              <input
                type="number"
                name="employeeCount"
                id="employeeCount"
                value={formData.employeeCount}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarbonEmissionForm;
