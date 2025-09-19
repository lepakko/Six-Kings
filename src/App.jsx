import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import ViewSelector from './components/ViewSelector';
import LigaTabelle from './components/LigaTabelle';
import StatisticsTable from './components/StatisticsTable';
import MatchdayView from './components/MatchdayView';
import TeamTable from './components/TeamTable';
import {
  processLigaTable,
  calculatePlayerStats,
  processMatchdays,
} from './data/dataProcessor';
import './App.css';

// Die Google Sheet ID deines Dokuments
const GOOGLE_SHEET_ID = '1hzAceouOYAj7_cHMRuJQTIXCnJ9RsaBydW8g_lPK8I8';

// Liste mit GIDs für jeden Spieltag
const MATCHDAY_GIDS = {
  "1": "2006878690",
  "2": "1100254037",
  "3": "807924221",
  "4": "28187050",
  "5": "1387863898",
  "6": "955094077",
  "7": "96908954",
  "8": "2004360002",
  "9": "777935510",
  "10": "782646271",
  "11": "1260966685",
  "12": "1182183385",
};

// Korrekte GIDs für deine Hauptmappen
const GOOGLE_SHEET_GIDS = {
  players: "0",
  liga: "1502641577",
  starter: "1065076276",
  team: "294324544",
};

const fetchData = async (gid) => {
  const url = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
  const response = await fetch(url);
  const csvText = await response.text();
  return Papa.parse(csvText, { header: true, dynamicTyping: true }).data;
};

function App() {
  const [activeView, setActiveView] = useState('statistics');
  const [data, setData] = useState({
    liga: [],
    players: [],
    matchdays: [],
    team: [],
    loading: true,
  });

  const loadAllData = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true }));

      const matchdayPromises = Object.values(MATCHDAY_GIDS).map(gid => fetchData(gid));
      const allMatchdayData = await Promise.all(matchdayPromises);
      const flattenedMatchdays = allMatchdayData.flat();

      const [playersData, ligaData, starterData, teamData] = await Promise.all([
        fetchData(GOOGLE_SHEET_GIDS.players),
        fetchData(GOOGLE_SHEET_GIDS.liga),
        fetchData(GOOGLE_SHEET_GIDS.starter),
        fetchData(GOOGLE_SHEET_GIDS.team),
      ]);

      const matchdays = processMatchdays(flattenedMatchdays, starterData);
      const playerStats = calculatePlayerStats(flattenedMatchdays, playersData, starterData);
      const ligaTable = processLigaTable(ligaData);

      setData({
        liga: ligaTable,
        players: playerStats,
        matchdays: matchdays,
        team: teamData || [],
        loading: false,
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      setData((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const renderContent = () => {
    if (data.loading) {
      return <div className="loading-state">Daten werden geladen...</div>;
    }
    if (activeView === 'liga') {
      return <LigaTabelle ligaData={data.liga} />;
    }
    if (activeView === 'statistics') {
      return <StatisticsTable statsData={data.players} />;
    }
    if (activeView === 'matchdays') {
      return <MatchdayView matchdays={data.matchdays} />;
    }
    if (activeView === 'team') {
      return <TeamTable teamData={data.team} />;
    }
    return null;
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">SIX KINGS</h1>
        <ViewSelector activeView={activeView} onViewChange={handleViewChange} />
      </header>
      <div className="content">{renderContent()}</div>
    </div>
  );
}

export default App;