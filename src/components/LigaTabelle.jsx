import React from 'react';
import './LigaTabelle.css';

const LigaTabelle = ({ ligaData }) => {
  if (!ligaData || ligaData.length === 0) {
    return <div className="loading-state">Lade Liga-Tabelle...</div>;
  }
  return (
    <div className="table-container">
      <h2 className="table-title">Liga-Tabelle</h2>
      <table className="liga-table">
        <thead>
          <tr>
            <th>Platz</th>
            <th>Mannschaft</th>
            <th>Spiele</th>
            <th>Siege</th>
            <th>Niederlagen</th>
            <th>Punkte</th>
            <th>Sets +</th>
            <th>Sets -</th>
            <th>Beine +</th>
            <th>Beine -</th>
          </tr>
        </thead>
        <tbody>
          {ligaData.map((team, index) => (
            <tr key={team.Mannschaft}>
              <td>{index + 1}</td>
              <td>{team.Mannschaft}</td>
              <td>{team.Spiele}</td>
              <td>{team.Siege}</td>
              <td>{team.Niederlagen}</td>
              <td>{team.Punkte}</td>
              <td>{team['Sets +']}</td>
              <td>{team['Sets -']}</td>
              <td>{team['Legs +']}</td>
              <td>{team['Legs -']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LigaTabelle;