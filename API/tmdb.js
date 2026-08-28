export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { endpoint, params } = req.query;
    if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    if (!TMDB_API_KEY) return res.status(500).json({ error: 'TMDB_API_KEY not set' });

    const url = new URL(`https://api.themoviedb.org/3/${endpoint}`);
    url.searchParams.append('api_key', TMDB_API_KEY);

    if (params) {
      const parsedParams = JSON.parse(params);
      Object.entries(parsedParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const tmdbResponse = await fetch(url.toString());
    const tmdbData = await tmdbResponse.json();
    return res.status(tmdbResponse.status).json(tmdbData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
