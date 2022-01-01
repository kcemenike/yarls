// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient, ObjectId } from 'mongodb';
import { VercelRequest, VercelResponse } from '@vercel/node';

let cachedDB: any;

async function connectToDB() {
  if (cachedDB) {
    await cachedDB.connect();
    return cachedDB;
  }
  const uri = process.env.MONGODB_URI;

  const client = new MongoClient(uri);
  cachedDB = client;
  await cachedDB.connect();
  return cachedDB;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'method not allowed', status: 'fail' });
    return;
  }
  const db = await connectToDB();
  const entry = await db
    .db('links_db')
    .collection('links_coll')
    .findOne({ _id: new ObjectId(req.query.id as string) });
  db.close();
  if (!entry) {
    return res.redirect(301, '/');
  }
  res.status(200).redirect(301, entry.link);
  // res.status(200).json(entry);
}
