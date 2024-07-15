"use client";

import { useEffect, useState } from 'react';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  // Function to display JSON in the pre element
  const displayJSON = (json) => JSON.stringify(json, null, 2);

  // Function to fetch data for a single match and update its scores
  const fetchAndUpdateSingleMatch = async (match) => {
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(match.match_url)}`;
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const htmlContent = data.contents;

      // Create a temporary div to hold the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;

      // Extract scores using querySelector
      let team1Score = 0;
      let team2Score = 0;
      const mainResultDiv = tempDiv.querySelector('div.main-result');
      if (mainResultDiv) {
        const scores = mainResultDiv.querySelectorAll('b');
        if (scores.length >= 2) {
          team1Score = parseInt(scores[0].textContent.trim());
          team2Score = parseInt(scores[1].textContent.trim());
        }
      }

      // Update the scores in the match object
      match.score1 = team1Score;
      match.score2 = team2Score;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Function to fetch data and update JSON for all matches
  const fetchAndUpdateScores = async () => {
    try {
      await Promise.all(matches.map(fetchAndUpdateSingleMatch));
      // Save updated JSON to server
      saveToJsonFile();
    } catch (error) {
      console.error('Error updating scores:', error);
    }
  };

  // Function to save updated JSON to server
  const saveToJsonFile = () => {
    fetch('/api/save-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matches),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to save data. Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        console.log('Data saved successfully to server!');
      })
      .catch((error) => {
        console.error('Failed to save data:', error);
      });
  };

  // Load initial JSON data from matches.json
  const loadInitialData = () => {
    fetch('https://res.cloudinary.com/ds8s4fn5p/raw/upload/matches.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMatches(data);
        fetchAndUpdateScores(); // Automatically update scores after loading initial data

        // Update scores every 10 seconds (adjust as needed)
        setInterval(fetchAndUpdateScores, 10000); // 10000 milliseconds = 10 seconds
      })
      .catch((error) => setError(error.message));
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <div>
      <h1>Match Scores JSON</h1>
      {error && <p>Error: {error}</p>}
      <pre>{displayJSON(matches)}</pre>
    </div>
  );
    }
