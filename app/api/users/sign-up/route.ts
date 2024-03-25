import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { User } from "@/interfaces";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const { username, name, password } = await req.json();
      const client = await clientPromise;
      const db = client.db("database");
      const users = db.collection("users");
      const usernames = await db.collection("usernames").find({}).toArray();

      let duplicatedUsernames = false;
      usernames.forEach(uname => {
        if (uname.name === username) duplicatedUsernames = true;
      })
      if (duplicatedUsernames) return NextResponse.json({ message: 'duplicated username' }, { status: 409 });

      await db.collection("usernames").insertOne({ name: username });

      const newUser: User = { name, username, password, transactions: [], accounts: [] };

      await users.insertOne(newUser);

      const token = jwt.sign({ username }, process.env.JWT_SECRET!);

      return NextResponse.json({ success: true, token }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ message: 'unexpected internal server error', fullError: error }, { status: 500 })
    }
  }
}
