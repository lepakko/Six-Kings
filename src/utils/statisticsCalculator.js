// Utility functions for calculating player statistics
export const calculatePlayerStats = (players, gameType = 'complete') => {
  return players.map(player => {
    const winPercentage = player.games > 0 ? ((player.wins / player.games) * 100).toFixed(1) : 0;
    
    return {
      ...player,
      winPercentage: parseFloat(winPercentage),
      setsDifference: player.setsWon - player.setsLost
    };
  });
};

export const rankPlayers = (players) => {
  return players
    .sort((a, b) => {
      // Primary sort: Win percentage (descending)
      if (b.winPercentage !== a.winPercentage) {
        return b.winPercentage - a.winPercentage;
      }
      // Secondary sort: Games played (descending) - more games = more experience
      if (b.games !== a.games) {
        return b.games - a.games;
      }
      // Tertiary sort: Sets difference (descending)
      return b.setsDifference - a.setsDifference;
    })
    .map((player, index) => ({
      ...player,
      rank: index + 1
    }));
};

export const filterPlayersByGameType = (players, gameType) => {
  // For now, return all players as we don't have separate single/double stats
  // This can be extended when we have more detailed match data
  return players;
};

export const calculateMatchdayStats = (matchday) => {
  const stats = {
    totalGames: matchday.doubleGames.length + matchday.singleGames.length,
    doubleGames: matchday.doubleGames.length,
    singleGames: matchday.singleGames.length,
    playersInvolved: new Set()
  };

  // Count unique players from double games
  matchday.doubleGames.forEach(game => {
    game.team1.forEach(player => stats.playersInvolved.add(player));
    game.team2.forEach(player => stats.playersInvolved.add(player));
  });

  // Count unique players from single games
  matchday.singleGames.forEach(game => {
    stats.playersInvolved.add(game.player1);
    stats.playersInvolved.add(game.player2);
  });

  stats.playersInvolved = stats.playersInvolved.size;

  return stats;
};

// Calculate player statistics from matchday data
export const calculateStatsFromMatchdays = (matchdays, samplePlayers) => {
  // Initialize player stats from sample data
  const playerStats = {};
  samplePlayers.forEach(player => {
    playerStats[player.name] = {
      ...player,
      games: 0,
      wins: 0,
      losses: 0,
      setsWon: 0,
      setsLost: 0,
      highscore: player.highscore || 0,
      lowscore: player.lowscore || 0,
      highfinish: player.highfinish || 0,
      shortgame: player.shortgame || 0,
      starter: player.starter || 0
    };
  });

  // Process each matchday
  matchdays.forEach(matchday => {
    // Process double games
    matchday.doubleGames?.forEach(game => {
      const result = game.result?.split(':');
      if (result && result.length === 2) {
        const team1Score = parseInt(result[0]);
        const team2Score = parseInt(result[1]);
        
        // Update stats for team 1 players
        game.team1?.forEach(playerName => {
          if (playerStats[playerName]) {
            playerStats[playerName].games += 1;
            playerStats[playerName].setsWon += team1Score;
            playerStats[playerName].setsLost += team2Score;
            if (team1Score > team2Score) {
              playerStats[playerName].wins += 1;
            } else {
              playerStats[playerName].losses += 1;
            }
          }
        });

        // Update stats for team 2 players
        game.team2?.forEach(playerName => {
          if (playerStats[playerName]) {
            playerStats[playerName].games += 1;
            playerStats[playerName].setsWon += team2Score;
            playerStats[playerName].setsLost += team1Score;
            if (team2Score > team1Score) {
              playerStats[playerName].wins += 1;
            } else {
              playerStats[playerName].losses += 1;
            }
          }
        });
      }
    });

    // Process single games
    matchday.singleGames?.forEach(game => {
      const result = game.result?.split(':');
      if (result && result.length === 2) {
        const player1Score = parseInt(result[0]);
        const player2Score = parseInt(result[1]);
        
        // Update stats for player 1
        if (playerStats[game.player1]) {
          playerStats[game.player1].games += 1;
          playerStats[game.player1].setsWon += player1Score;
          playerStats[game.player1].setsLost += player2Score;
          if (player1Score > player2Score) {
            playerStats[game.player1].wins += 1;
          } else {
            playerStats[game.player1].losses += 1;
          }
        }

        // Update stats for player 2
        if (playerStats[game.player2]) {
          playerStats[game.player2].games += 1;
          playerStats[game.player2].setsWon += player2Score;
          playerStats[game.player2].setsLost += player1Score;
          if (player2Score > player1Score) {
            playerStats[game.player2].wins += 1;
          } else {
            playerStats[game.player2].losses += 1;
          }
        }
      }
    });

    // Update special achievements - COUNT achievements for Highscore/Lowscore
    matchday.highscoreWinners?.forEach(winner => {
      const playerName = typeof winner === 'object' ? winner.player : winner;
      if (playerName && playerStats[playerName]) {
        playerStats[playerName].highscore += 1; // Count achievements
      }
    });

    matchday.lowscoreWinners?.forEach(winner => {
      const playerName = typeof winner === 'object' ? winner.player : winner;
      if (playerName && playerStats[playerName]) {
        playerStats[playerName].lowscore += 1; // Count achievements
      }
    });

    // Handle lowscoreWinner (single winner format)
    if (matchday.lowscoreWinner && playerStats[matchday.lowscoreWinner]) {
      playerStats[matchday.lowscoreWinner].lowscore += 1; // Count achievements
    }

    // Track MAXIMUM finish value for Highfinish
    matchday.highfinishWinners?.forEach(winner => {
      if (winner.player && playerStats[winner.player]) {
        if (winner.finish > playerStats[winner.player].highfinish) {
          playerStats[winner.player].highfinish = winner.finish;
        }
      }
    });

    // Track MINIMUM dart count for Shortgame
    matchday.shortGameWinners?.forEach(winner => {
      if (winner.player && playerStats[winner.player]) {
        if (winner.darts < playerStats[winner.player].shortgame || playerStats[winner.player].shortgame === 0) {
          playerStats[winner.player].shortgame = winner.darts;
        }
      }
    });

    matchday.starterDrawn?.forEach(playerName => {
      if (playerStats[playerName]) {
        playerStats[playerName].starter += 1;
      }
    });
  });

  return Object.values(playerStats);
};
