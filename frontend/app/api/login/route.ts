import { connectMongoDB } from '@/lib/db'; // Adjust path if needed
import User from '@/models/User'; // Adjust path if needed
import jwt from 'jsonwebtoken';

import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    await connectMongoDB();
    const { email, password } = await req.json();
    const user = await User.findOne({ email });

    if (user) {
      console.log("Stored password:", user.password); // Log stored password
      console.log("Entered password:", password); // Log entered password
      
      // Compare plaintext passwords
      const isMatch = password === user.password;
      console.log("Password match:", isMatch); // Ensure this is true

      if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '30d' });
        return NextResponse.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token,
        });
      } else {
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
