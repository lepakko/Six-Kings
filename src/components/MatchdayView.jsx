import React, { useState } from 'react';
import './MatchdayView.css';

const MatchdayView = ({ matchdays }) => {
  const [selectedMatchday, setSelectedMatchday] = useState(null);

  if (!matchdays || matchdays.length === 0) {
    return <div className="loading-state">Lade Spieltage...</div>;
  }

  // Wähle den ersten Spieltag standardmäßig aus, wenn noch keiner ausgewählt ist
  if (!selectedMatchday) {
    setSelectedMatchday(matchdays[0]);
  }

  const handleSelectChange = (event) => {
    const selectedId = parseInt(event.target.value);
    const foundMatchday = matchdays.find(m => m.id === selectedId);
    setSelectedMatchday(foundMatchday);
  };

  return (
    <div className="matchday-container">
      <div className="matchday-selector-container">
        <label htmlFor="matchday-select" className="matchday-label">Wähle einen Spieltag:</label>
        <select
          id="matchday-select"
          className="matchday-select"
          onChange={handleSelectChange}
          value={selectedMatchday ? selectedMatchday.id : ''}
        >
          {matchdays.map((matchday) => (
            <option key={matchday.id} value={matchday.id}>
              {matchday.name}
            </option>
          ))}
        </select>
      </div>

      {selectedMatchday && (
        <div className="matchday-details">
          <h2 className="matchday-title">{selectedMatchday.name}</h2>
          <p className="matchday-info">Datum: {selectedMatchday.date}</p>
          <p className="matchday-info">Gegnerteam: {selectedMatchday.opponentTeam}</p>
          
          <table className="matchday-table">
            <thead>
              <tr>
                <th>Spiel</th>
                <th>Typ</th>
                <th>Spieler 1 & 2</th>
                <th>Gegner</th>
                <th>Ergebnis</th>
              </tr>
            </thead>
            <tbody>
              {selectedMatchday.games.map((game, index) => (
                <tr key={index}>
                  <td>{game.id}</td>
                  <td>{game.type}</td>
                  <td>{game.players.join(' & ')}</td>
                  <td>{game.opponents.join(' & ')}</td>
                  <td>{game.result}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="matchday-awards">
            <h3>Auszeichnungen des Spieltags</h3>
            <p><strong>Highscore:</strong> {selectedMatchday.awards.highscore.map(a => `${a.name} (${a.score})`).join(', ') || 'Keine Angabe'}</p>
            <p><strong>Lowscore:</strong> {selectedMatchday.awards.lowscore.map(a => `${a.name} (${a.score})`).join(', ') || 'Keine Angabe'}</p>
            <p><strong>Highfinish:</strong> {selectedMatchday.awards.highfinish.map(a => `${a.name} (${a.score})`).join(', ') || 'Keine Angabe'}</p>
            <p><strong>Shortgame:</strong> {selectedMatchday.awards.shortgame.map(a => `${a.name} (${a.score})`).join(', ') || 'Keine Angabe'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchdayView;