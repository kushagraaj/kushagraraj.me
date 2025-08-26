export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip = request.headers['x-forwarded-for'] || '8.8.8.8';

  try {
    const locationResponse = await fetch(`http://ip-api.com/json/${ip}`);
    if (!locationResponse.ok) {
      throw new Error('Failed to fetch from ip-api.com');
    }
    const locationData = await locationResponse.json();

    const city = locationData.city || 'an unknown city';
    const countryCode = locationData.countryCode || 'somewhere';
    const locationString = `${city}, ${countryCode}`;
    const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (redisUrl && redisToken) {
        await fetch(
            `${redisUrl}/set/visitor/${encodeURI(locationString)}`,
            {
                headers: {
                    Authorization: `Bearer ${redisToken}`,
                },
            }
        );
    } else {
        console.warn("Upstash Redis environment variables are not set. Skipping save.");
    }

    return response.status(200).json({ location: locationString });

  } catch (error) {
    console.error("Error in /api/locate:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
}