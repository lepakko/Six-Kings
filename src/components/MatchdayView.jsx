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

  // Function to determine if players won
  const didPlayersWin = (result) => {
    const [homeScore, awayScore] = result.split(':').map(score => parseInt(score) || 0);
    return homeScore > awayScore;
  };

  // Function to group games into blocks
  const groupGamesIntoBlocks = (games) => {
    const blocks = [];
    
    // First block: Games 1-2 (Doppel games)
    if (games.length >= 2) {
      blocks.push({
        title: 'Doppel',
        games: games.slice(0, 2)
      });
    }
    
    // Remaining blocks: Every 4 games
    for (let i = 2; i < games.length; i += 4) {
      const endIndex = Math.min(i + 4, games.length);
      const blockNumber = Math.floor(i / 4) + 1;
      
      blocks.push({
        title: `Block ${blockNumber}`,
        games: games.slice(i, endIndex)
      });
    }
    
    return blocks;
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
          
          <div className="games-container">
            {groupGamesIntoBlocks(selectedMatchday.games).map((block, blockIndex) => (
              <div key={blockIndex} className="games-block">
                <h3 className="block-title">{block.title}</h3>
                <div className="games-grid">
                  {block.games.map((game, gameIndex) => {
                    const playersWon = didPlayersWin(game.result);
                    const globalGameIndex = blockIndex === 0 ? gameIndex : (blockIndex - 1) * 4 + gameIndex + 2;
                    
                    return (
                      <div key={gameIndex} className="game-card">
                        <div className="game-header">
                          <span className="game-number">Spiel {globalGameIndex + 1}</span>
                          <span className="game-type">{game.type}</span>
                        </div>
                        <div className="game-content">
                          <div className={`game-team ${playersWon ? 'winner' : ''}`}>
                            <div className="team-players">{game.players.join(' & ')}</div>
                          </div>
                          <div className="game-score">{game.result}</div>
                          <div className={`game-team ${!playersWon ? 'winner' : ''}`}>
                            <div className="team-players">{game.opponents.join(' & ')}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="matchday-awards">
            <h3>Spiel-Info</h3>
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