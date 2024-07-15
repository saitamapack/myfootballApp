"use client";

import { useEffect } from 'react';
import { getMatchPageSource } from './fetchHTML';

export default function Home() {
  useEffect(() => {
    const fetchPageSource = async () => {
      const html = await getMatchPageSource();
      console.log('HTML Source:', html);
      // Process or parse HTML here as needed
    };

    fetchPageSource();
  }, []);

  return <div>Fetching HTML...</div>;
}
