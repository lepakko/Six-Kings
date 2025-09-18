import React from 'react';
import './TeamMembers.css';

const TeamMembers = () => {
  return (
    <div className="team-members">
      <div className="team-header">
        <h2>👥 Teammitglieder</h2>
        <p>Unsere sechs Könige</p>
      </div>

      <p className="loading-message">Lade Team-Daten...</p>
      {/* Hier würdest du die Teammitglieder anzeigen, wenn die Daten geladen wären. */}
      {/* Zum Beispiel: teamMembers.map(member => ...) */}
      <p className="no-data">Daten konnten nicht geladen werden. Bitte überprüfen Sie Ihre Google Sheets-URL.</p>
    </div>
  );
};

export default TeamMembers;