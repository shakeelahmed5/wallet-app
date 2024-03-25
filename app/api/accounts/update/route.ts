import clientPromise from "@/lib/mongodb";
import { Account, Transaction, User } from "@/interfaces";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      let username: any = "";

      const token = headers().get('authorization')?.split(' ')[1];
      if (!token) return NextResponse.json({ message: 'invalid or missing token' }, { status: 409 });

      jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
        if (err) return NextResponse.json({ message: 'unable to verify user by the token given' }, { status: 500 });
        username = decoded!["username"];
      })

      if (username === "") return NextResponse.json({ message: 'unable to authorize user' }, { status: 500 });
      const account: Account = (await req.json()).account;
      const index = (await req.json()).index;

      if (!account) return NextResponse.json({ message: 'missing or invalid account object' }, { status: 400 });

      const client = await clientPromise;
      const db = client.db("database").collection("users");

      const user: User | null = await db.findOne({ username });
      const accounts = user?.accounts;

      if (!accounts) return NextResponse.json({ message: 'cannot find accounts in user object' }, { status: 500 });
      const newAccounts = [
        ...accounts?.slice(0, index),
        account,
        ...accounts?.slice(index + 1)
      ]

      // @ts-ignore
      await db.updateOne({ username }, { $set: { accounts: newAccounts } });

      return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
      return NextResponse.json({ message: 'unexpected internal server error', fullError: error }, { status: 500 })
    }
  }
}


