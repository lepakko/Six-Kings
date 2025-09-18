import { useState, useEffect } from 'react';
import { GOOGLE_SHEETS_CONFIG } from '../config/googleSheetsConfig';

/**
 * Custom hook for Google Sheets integration
 * This hook provides methods to load data from Google Sheets
 * and will be used to populate the frontend tables
 */
export const useGoogleSheets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Test connection to Google Sheets
  const testConnection = async () => {
    if (!GOOGLE_SHEETS_CONFIG.API_KEY || !GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID) {
      setError('Google Sheets configuration is missing');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Simple test request to check if API is accessible
      const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;

      const response = await fetch(testUrl);
      if (response.ok) {
        setIsConnected(true);
        return true;
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (err) {
      setError(`Failed to connect to Google Sheets: ${err.message}`);
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load players data from Google Sheets
  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEETS.PLAYERS}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      return data.values || [];
    } catch (err) {
      setError(`Failed to load players: ${err.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Load matchdays data from Google Sheets
  const loadMatchdays = async () => {
    try {
      setIsLoading(true);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_CONFIG.SPREADSHEET_ID}/values/${GOOGLE_SHEETS_CONFIG.SHEETS.MATCHDAYS}?key=${GOOGLE_SHEETS_CONFIG.API_KEY}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      return data.values || [];
    } catch (err) {
      setError(`Failed to load matchdays: ${err.message}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Parse matchday data from Google Sheets format
  const parseMatchdayData = (sheetData) => {
    if (!sheetData || sheetData.length === 0) return [];

    // Assuming first row is headers, adjust parsing logic based on your sheet structure
    const headers = sheetData[0];
    const matchdays = [];

    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      if (row.length === 0) continue;

      // Parse matchday data - this will need to be adjusted based on your actual sheet structure
      const matchday = {
        id: parseInt(row[0]) || i,
        date: row[1] || '',
        doubleGames: [], // Will be populated from additional sheets or parsing
        singleGames: [], // Will be populated from additional sheets or parsing
        // Add other fields as needed
      };

      matchdays.push(matchday);
    }

    return matchdays;
  };

  // Parse player data from Google Sheets format
  const parsePlayerData = (sheetData) => {
    if (!sheetData || sheetData.length === 0) return [];

    const headers = sheetData[0];
    const players = [];

    for (let i = 1; i < sheetData.length; i++) {
      const row = sheetData[i];
      if (row.length === 0) continue;

      const player = {
        id: parseInt(row[0]) || i,
        name: row[1] || '',
        // Add other player fields based on your sheet structure
        games: 0,
        wins: 0,
        losses: 0,
        // Add other stats
      };

      players.push(player);
    }

    return players;
  };

  return {
    isLoading,
    error,
    isConnected,
    testConnection,
    loadPlayers,
    loadMatchdays,
    parseMatchdayData,
    parsePlayerData
  };
};

export default useGoogleSheets;
