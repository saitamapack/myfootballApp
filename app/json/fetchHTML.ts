import axios from 'axios';
import cheerio from 'cheerio';

export async function fetchHTML(url: string): Promise<string> {
  const response = await axios.get(url);
  return response.data;
}

export async function getMatchPageSource(): Promise<string | null> {
  const url = 'https://www.ysscores.com/ar/match/4407875/Argentina-vs-Colombia';
  
  try {
    const html = await fetchHTML(url);
    return html;
  } catch (error) {
    console.error('Error fetching page:', error);
    return null;
  }
}
