import React from 'react';
import './ViewSelector.css';

const ViewSelector = ({ activeView, onViewChange }) => {
    return (
        <div className="view-selector-container">
            <button
                className={`view-button ${activeView === 'liga' ? 'active' : ''}`}
                onClick={() => onViewChange('liga')}
            >
                Liga
            </button>
            <button
                className={`view-button ${activeView === 'statistics' ? 'active' : ''}`}
                onClick={() => onViewChange('statistics')}
            >
                Statistiken
            </button>
            <button
                className={`view-button ${activeView === 'matchdays' ? 'active' : ''}`}
                onClick={() => onViewChange('matchdays')}
            >
                Spieltage
            </button>
        </div>
    );
};

export default ViewSelector;