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

      if (!account) return NextResponse.json({ message: 'missing or invalid account object' }, { status: 400 });

      const client = await clientPromise;
      await client.db("database").collection("users").updateOne({ username }, {
        // @ts-ignore
        $push: {
          accounts: account
        }
      })

      return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
      return NextResponse.json({ message: 'unexpected internal server error', fullError: error }, { status: 500 })
    }
  }
}

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

      if (!user) return NextResponse.json({ message: 'unable to locate user in the database' }, { status: 500 });

      return NextResponse.json({ success: true, accounts: user.accounts }, { status: 200 });

    } catch (error) {
      return NextResponse.json({ message: 'unexpected internal server error', fullError: error }, { status: 500 })
    }
  }
}

export async function DELETE(req: NextRequest) {
  if (req.method === 'DELETE') {
    try {
      let username: any = "";

      const token = headers().get('authorization')?.split(' ')[1];
      if (!token) return NextResponse.json({ message: 'invalid or missing token' }, { status: 409 });

      jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
        if (err) return NextResponse.json({ message: 'unable to verify user by the token given' }, { status: 500 });
        username = decoded!["username"];
      })

      if (username === "") return NextResponse.json({ message: 'unable to authorize user' }, { status: 500 });

      const accountIndex = (await req.json()).accountIndex;

      const client = await clientPromise;
      const db = client.db("database").collection("users");
      const user: User | null = await db.findOne({ username });

      if (!user) return NextResponse.json({ message: 'unable to locate user in the database' }, { status: 500 });

      let accounts = user.accounts;

      if (!accounts) return NextResponse.json({ message: 'cannot find account object in the user object' }, { status: 500 });

      accounts.splice(accountIndex, 1);

      await db.updateOne({ _id: user._id }, { $set: { accounts } });

      return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
      return NextResponse.json({ message: 'unexpected internal server error', fullError: error }, { status: 500 })
    }
  }
}


