// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from 'mongodb';
import { VercelRequest, VercelResponse } from '@vercel/node';

let cachedDB: any;

async function connectToDB() {
  if (cachedDB) {
    console.log('db is cached');
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
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'method not allowed', status: 'fail' });
    return;
  }
  if (req.body.length < 1) {
    res.status(422).json({ message: 'no link found', status: 'fail' });
    return;
  }
  const db = await connectToDB();
  // const entry = { insertedId: '' };
  const entry = await db
    .db('links_db')
    .collection('links_coll')
    .insertOne({ link: req.body.link });
  db.close();
  res.status(200).json({
    short_link: `http://${req.headers.host}/r/${entry.insertedId}`,
    status: 'success',
  });
}
