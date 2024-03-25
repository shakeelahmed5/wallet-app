import clientPromise from "@/lib/mongodb";
import { User } from "@/interfaces";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(req: NextRequest) {
  if (req.method === 'GET') {
    try {
      let username: any = "";

      const token = headers().get('authorization')?.split(' ')[1];
      if (!token) return NextResponse.json({ message: 'invalid or missing token' }, { status: 409 });

      jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
        if (err) return NextResponse.json({ message: 'unable to verify user by the token given' }, { status: 500 });
        username = decoded!["username"];
      })

      if (username === "") return NextResponse.json({ message: 'unable to authorize user' }, { status: 500 });

      const client = await clientPromise;
      const user: User | null = await client.db("database").collection("users").findOne({ username });

      if (!user) return NextResponse.json({ message: 'user not found' }, { status: 404 });
      return NextResponse.json({ success: true, name: user.name, username: user.username }, { status: 200 });

    } catch (error) {
      return NextResponse.json({ message: 'unexpected internal server error', fullError: error }, { status: 500 })
    }
  }
}
