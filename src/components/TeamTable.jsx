import React from 'react';
import './TeamTable.css';

const TeamTable = ({ teamData }) => {
  // Debug: Log the data to see what we're receiving
  console.log('TeamTable received data:', teamData);

  if (!teamData || teamData.length === 0) {
    return <div className="loading-state">Lade Team-Daten...</div>;
  }

  return (
    <div className="table-container">
      <h2 className="table-title">Team Six Kings</h2>
      <div className="team-grid">
        {teamData.map((member, index) => {
          // Debug: Log each member to see their properties
          console.log('Team member:', index, member);

          return (
            <div key={index} className="team-member-card">
            <div className="member-image">
              {member.Bild ? (
                <img
                  src={member.Bild}
                  alt={`${member.Spieler || 'Teammitglied'}`}
                  onError={(e) => {
                    e.target.src = '/placeholder-avatar.png'; // Fallback image
                  }}
                />
              ) : (
                <div className="placeholder-avatar">
                  <span>{member.Spieler ? member.Spieler.charAt(0).toUpperCase() : '?'}</span>
                </div>
              )}
            </div>
            <div className="member-info">
              <h3 className="member-name">{member.Spieler || 'Unbekannt'}</h3>
              <p className="member-role">{member.Spielerart || 'Spieler'}</p>
              <p className="member-date">
                Beitritt: {member.Eintrittsdatum || member.Beitrittsdatum ?
                  new Date(member.Eintrittsdatum || member.Beitrittsdatum).toLocaleDateString('de-DE') :
                  'Unbekannt'}
              </p>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamTable;
