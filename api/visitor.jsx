import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  }
});

export default async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        await client.connect();
        const db = client.db("portfolio"); 
        const collection = db.collection("visitor"); 
        const visitorDoc = await collection.findOne({});
        const lastVisitorLocation = visitorDoc ? visitorDoc.location : 'somewhere mysterious';
        const ip = request.headers['x-forwarded-for'] || '8.8.8.8'; 
        const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
        const locationData = await locationResponse.json();
        const city = locationData.city || 'an unknown city';
        const country = locationData.countryCode === "US" ? locationData.region : locationData.countryCode;
        const currentLocationString = `${city}, ${country}`;
        await collection.updateOne(
            {}, 
            { $set: { location: currentLocationString } },
            { upsert: true }
        );
        return response.status(200).json({ location: lastVisitorLocation });

    } catch (error) {
        console.error("Error in /api/visitor:", error);
        return response.status(500).json({ error: "Internal Server Error" });
    } finally {
        await client.close();
    }
}