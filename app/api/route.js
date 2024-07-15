export default async function handler(req, res) {
  try {
    // Fetch JSON data from Cloudinary
    const cloudinaryUrl = 'https://res.cloudinary.com/ds8s4fn5p/raw/upload/matches.json';
    const response = await fetch(cloudinaryUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Return JSON data as response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
