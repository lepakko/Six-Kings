import React from 'react';
import './TeamTable.css';

// Helper function to convert Google Drive sharing links to direct download links
const convertGoogleDriveLink = (url) => {
  if (!url) return null;

  // Check if it's a Google Drive sharing link
  const driveMatch = url.match(/https:\/\/drive\.google\.com\/file\/d\/([^\/]+)\/view/);
  if (driveMatch) {
    const fileId = driveMatch[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Return original URL if it's not a Google Drive link
  return url;
};

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

          // Convert Google Drive links to direct download links
          const imageUrl = convertGoogleDriveLink(member.Bild);

          return (
            <div key={index} className="team-member-card">
              <div className="member-image">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`${member.Spieler || 'Teammitglied'}`}
                    onError={(e) => {
                      console.log('Image failed to load:', imageUrl);
                      // Hide the broken image and show fallback
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      // Show image and hide fallback when image loads successfully
                      e.target.style.display = 'block';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'none';
                      }
                    }}
                  />
                ) : null}
                <div className="placeholder-avatar" style={{ display: imageUrl ? 'none' : 'flex' }}>
                  <span>{member.Spieler ? member.Spieler.charAt(0).toUpperCase() : '?'}</span>
                </div>
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
