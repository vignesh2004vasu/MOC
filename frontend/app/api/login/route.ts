import { connectMongoDB } from '@/lib/db'; 
import User from '@/models/User'; 
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    await connectMongoDB();
    
    const { email, password } = await req.json();
    
    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

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
