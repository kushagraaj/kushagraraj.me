export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!redisUrl || !redisToken) {
    console.error("Upstash Redis environment variables are not set.");
    return response.status(500).json({ error: "Server configuration error." });
  }

  const authHeaders = { Authorization: `Bearer ${redisToken}` };

  try {
    const getResponse = await fetch(`${redisUrl}/get/visitor`, { headers: authHeaders });
    const previousVisitorData = await getResponse.json();
    const lastVisitorLocation = previousVisitorData.result || 'somewhere mysterious';

    const ip = request.headers['x-forwarded-for'] || '8.8.8.8'; 
    const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
    const locationData = await locationResponse.json();
    
    const city = locationData.city || 'an unknown city';
    const country = locationData.countryCode === "US" ? locationData.region : locationData.countryCode;
    const currentLocationString = `${city}, ${country}`;

    fetch(`${redisUrl}/set/visitor/${encodeURI(currentLocationString)}`, { headers: authHeaders });

    return response.status(200).json({ location: lastVisitorLocation });

  } catch (error) {
    console.error("Error in /api/visitor:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}