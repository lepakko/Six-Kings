// src/data/dataProcessor.js

/**
 * Verarbeitet die Daten für die Liga-Tabelle und sortiert sie.
 */
export const processLigaTable = (ligaData) => {
    if (!ligaData || !Array.isArray(ligaData)) {
        return [];
    }
    return ligaData.map(team => ({
        ...team,
        Punkte: parseInt(team.Punkte) || 0,
        Spiele: parseInt(team.Spiele) || 0,
        Siege: parseInt(team.Siege) || 0,
        Niederlagen: parseInt(team.Niederlagen) || 0,
        'Sets +': parseInt(team['Sets +']) || 0,
        'Sets -': parseInt(team['Sets -']) || 0,
        'Legs +': parseInt(team['Legs +']) || 0,
        'Legs -': parseInt(team['Legs -']) || 0,
    }))
    .sort((a, b) => {
        if (b.Punkte !== a.Punkte) return b.Punkte - a.Punkte;
        const setsDiffA = a['Sets +'] - a['Sets -'];
        const setsDiffB = b['Sets +'] - b['Sets -'];
        if (setsDiffB !== setsDiffA) return setsDiffB - setsDiffA;
        const legsDiffA = a['Legs +'] - a['Legs -'];
        const legsDiffB = b['Legs +'] - b['Legs -'];
        return legsDiffB - legsDiffA;
    });
};

/**
 * Berechnet Spielerstatistiken aus den Rohdaten der Spieltage.
 */
export const calculatePlayerStats = (matchdaysData, allPlayersData, starterData) => {
    const playerStats = {};

    // Initialisiere die Statistik für alle Spieler aus der Hauptliste
    if (allPlayersData && Array.isArray(allPlayersData)) {
        allPlayersData.forEach(player => {
            const name = player['Spieler'];
            if (name) {
                playerStats[name] = {
                    name: name,
                    gamesPlayed: 0,
                    wins: 0,
                    losses: 0,
                    setsPlus: 0,
                    setsMinus: 0,
                    highscore: [],
                    lowscore: [],
                    highfinish: [],
                    shortgame: [],
                    starterCount: 0,
                };
            }
        });
    }

    if (matchdaysData && Array.isArray(matchdaysData)) {
        matchdaysData.forEach(row => {
            const players = [row['Spieler 1'], row['Spieler 2']].filter(name => name);
            
            if (players.length > 0) {
                players.forEach(player => {
                    if (!playerStats[player]) {
                        // Fallback, falls ein neuer Spieler in den Spieltag-Daten auftaucht
                        playerStats[player] = {
                            name: player,
                            gamesPlayed: 0,
                            wins: 0,
                            losses: 0,
                            setsPlus: 0,
                            setsMinus: 0,
                            highscore: [],
                            lowscore: [],
                            highfinish: [],
                            shortgame: [],
                            starterCount: 0,
                        };
                    }

                    // Statistiken aktualisieren
                    playerStats[player].gamesPlayed += 1;
                    playerStats[player].wins += parseInt(row['Win'] || 0);
                    playerStats[player].losses += parseInt(row['Lose'] || 0);
                    playerStats[player].setsPlus += parseInt(row['Sets +'] || 0);
                    playerStats[player].setsMinus += parseInt(row['Sets -'] || 0);
                });
            }
            
            // Auszeichnungen verarbeiten (sie sind nur für Spieler 1 erfasst)
            const player1 = row['Spieler 1'];
            if (player1 && playerStats[player1]) {
                if (row['Highscore']) playerStats[player1].highscore.push(parseInt(row['Highscore']));
                if (row['Lowscore']) playerStats[player1].lowscore.push(parseInt(row['Lowscore']));
                if (row['Highfinish']) playerStats[player1].highfinish.push(parseInt(row['Highfinish']));
                if (row['Shortgame']) playerStats[player1].shortgame.push(parseInt(row['Shortgame']));
            }
        });
    }

    // Verarbeitet Starter-Daten
    if (starterData && Array.isArray(starterData)) {
        starterData.forEach(row => {
            const starter1 = row['Starter 1'];
            const starter2 = row['Starter 2'];
            
            if (starter1 && playerStats[starter1]) {
                playerStats[starter1].starterCount += 1;
            }
            if (starter2 && playerStats[starter2]) {
                playerStats[starter2].starterCount += 1;
            }
        });
    }

    const finalStats = Object.values(playerStats).map(player => {
        const gamesPlayed = player.wins + player.losses;
        const winPercentage = gamesPlayed > 0 ? (player.wins / gamesPlayed) * 100 : 0;

        return {
            name: player.name,
            gamesPlayed: gamesPlayed,
            wins: player.wins,
            losses: player.losses,
            winPercentage: Math.round(winPercentage) + '%',
            setsPlus: player.setsPlus,
            setsMinus: player.setsMinus,
            setsDifference: player.setsPlus - player.setsMinus,
            highscore: player.highscore.length > 0 ? player.highscore.length : '-',
            lowscore: player.lowscore.length > 0 ? player.lowscore.length : '-',
            highfinish: player.highfinish.length > 0 ? Math.max(...player.highfinish) : '-',
            shortgame: player.shortgame.length > 0 ? Math.max(...player.shortgame) : '-',
            starter: player.starterCount > 0 ? player.starterCount : '-',
        };
    });

    // Sortiert die Spieler nach Win % (absteigend)
    finalStats.sort((a, b) => {
        const winA = parseFloat(a.winPercentage);
        const winB = parseFloat(b.winPercentage);
        if (winB !== winA) {
            return winB - winA;
        }
        return b.wins - a.wins;
    });

    return finalStats;
};

/**
 * Verarbeitet die Daten für die Spieltage.
 * Behält die Werte von Spieltag, Datum und Gegnerteam bei, wenn diese leer sind.
 */
export const processMatchdays = (matchdaysData, starterData) => {
  const groupedMatchdays = {};
  let currentSpieltag = '';
  let currentDate = '';
  let currentOpponentTeam = '';

  if (matchdaysData && Array.isArray(matchdaysData)) {
    matchdaysData.forEach(row => {
      // Wenn eine Zeile Werte für diese Spalten hat, speichern wir sie
      if (row['Spieltag']) {
        currentSpieltag = row['Spieltag'];
        currentDate = row['Datum'] || '';
        currentOpponentTeam = row['Gegnerteam'] || '';
      }
      
      const spieltagId = parseInt(currentSpieltag);
      const spieltagKey = `Spieltag ${spieltagId}`;

      if (currentSpieltag) {
        if (!groupedMatchdays[spieltagKey]) {
          groupedMatchdays[spieltagKey] = {
            id: spieltagId,
            name: `Spieltag ${spieltagId}`,
            date: currentDate || 'Unbekanntes Datum',
            opponentTeam: currentOpponentTeam || 'Kein Gegnerteam',
            games: [],
            awards: {
              highscore: [],
              lowscore: [],
              highfinish: [],
              shortgame: [],
              starters: [],
            }
          };
        }
        
        // Verarbeitet die Spieldaten
        if (row['Spiel'] && row['Typ']) {
          groupedMatchdays[spieltagKey].games.push({
            id: row['Spiel'],
            type: row['Typ'],
            players: [row['Spieler 1'], row['Spieler 2']].filter(p => p),
            opponents: (row['Gegner'] || '').split('&').map(p => p.trim()),
            result: `${row['Ergebnis +'] || 0}:${row['Ergebnis -'] || 0}`,
          });
        }
        
        // Verarbeitet Auszeichnungen
        if (row['Highscore']) {
          groupedMatchdays[spieltagKey].awards.highscore.push({ name: row['Spieler 1'], score: parseInt(row['Highscore']) || 0 });
        }
        if (row['Lowscore']) {
          groupedMatchdays[spieltagKey].awards.lowscore.push({ name: row['Spieler 1'], score: parseInt(row['Lowscore']) || 0 });
        }
        if (row['Highfinish']) {
          groupedMatchdays[spieltagKey].awards.highfinish.push({ name: row['Spieler 1'], score: parseInt(row['Highfinish']) || 0 });
        }
        if (row['Shortgame']) {
          groupedMatchdays[spieltagKey].awards.shortgame.push({ name: row['Spieler 1'], score: parseInt(row['Shortgame']) || 0 });
        }
      }
    });
  }

  // Verarbeitet Starter-Daten für jeden Spieltag
  if (starterData && Array.isArray(starterData)) {
    starterData.forEach(row => {
      const spieltag = row['Spieltag'];
      const starter1 = row['Starter 1'];
      const starter2 = row['Starter 2'];
      
      if (spieltag) {
        const spieltagId = parseInt(spieltag);
        const spieltagKey = `Spieltag ${spieltagId}`;
        
        if (groupedMatchdays[spieltagKey]) {
          if (starter1) {
            groupedMatchdays[spieltagKey].awards.starters.push(starter1);
          }
          if (starter2) {
            groupedMatchdays[spieltagKey].awards.starters.push(starter2);
          }
        }
      }
    });
  }

  return Object.values(groupedMatchdays).sort((a, b) => a.id - b.id);
};