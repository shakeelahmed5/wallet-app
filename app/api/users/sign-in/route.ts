import type { NextApiRequest } from "next";
import clientPromise from "@/lib/mongodb";
import { User } from "@/interfaces";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const { username, password } = await req.json();
      const client = await clientPromise;
      const users = client.db("database").collection("users");
      const user: User | null = await users.findOne({ username });

      if (user && user.password === password) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET!);
        return NextResponse.json({ success: true, token }, { status: 200 });
      }

      if (!user) return NextResponse.json({ message: 'user not found' }, { status: 404 });

      return NextResponse.json({ message: 'invalid credentials' }, { status: 401 });

    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: 'unexpected internal server error', fullError: error }, { status: 500 })
    }
  }
}
