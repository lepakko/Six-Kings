import React from 'react';
import './TeamTable.css';

// Helper function to get local image path from filename
const getLocalImagePath = (filename) => {
  if (!filename) return null;
  
  // If filename already has an extension, use it as is
  if (/\.(jpg|jpeg|png|gif|webp)$/i.test(filename)) {
    return `/images/${filename}`;
  }
  
  // Otherwise, try common extensions
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  for (const ext of extensions) {
    const testPath = `/images/${filename}.${ext}`;
    // We'll check if the image exists by trying to load it
    // For now, default to jpg
    break;
  }
  
  return `/images/${filename}.jpg`;
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
      <div className="team-image-container">
        <img src="/images/team.jpg" alt="Team Six Kings" className="team-image" />
      </div>
      <div className="team-grid">
        {teamData.map((member, index) => {
          // Debug: Log each member to see their properties
          console.log('Team member:', index, member);

          // Get local image path from the 'Bild' column (uppercase B as in Google Sheets)
          const imageUrl = getLocalImagePath(member.Bild);
          
          // Debug: Log the image path being generated
          console.log(`Player: ${member.Spieler}, Bild value: "${member.Bild}", Image URL: "${imageUrl}"`);

          return (
            <div key={index} className="team-member-card">
              <div className="member-image">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`${member.Spieler || 'Teammitglied'}`}
                    onError={(e) => {
                      console.log('Local image failed to load:', imageUrl);
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
                  Beitritt: {member.Eintrittsdatum || member.Beitrittsdatum || 'Unbekannt'}
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
