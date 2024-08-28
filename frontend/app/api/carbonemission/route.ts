import { connectMongoDB } from '@/lib/db';
import CarbonEmission from '@/models/CarbonEmission';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const { country, date, sector, value } = await req.json();

    // Validate input data
    if (!country || !date || !sector || value == null) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Create a new CarbonEmission document
    const carbonEmission = new CarbonEmission({
      country,
      date: new Date(date),
      sector,
      value,
    });

    // Save the document to the database
    await carbonEmission.save();

    // Return success response
    return NextResponse.json({ message: 'Carbon emission record created', carbonEmission });
  } catch (error) {
    console.error("Error creating carbon emission record:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
