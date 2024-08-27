import { connectMongoDB } from '@/lib/db'; // Adjust path if needed
import User from '@/models/User'; // Adjust path if needed
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await connectMongoDB();

    const { name, email, password } = await req.json();

    const userExists = await User.findOne({ email });

    if (userExists) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Create user with plaintext password
    const user = await User.create({ name, email, password });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '30d' });

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
