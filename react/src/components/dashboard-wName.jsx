import React from 'react';

export default function wedNames({ weddingName }) {
    return (
        <div>
            {weddingName && <h2 className='wedNames'>{weddingName}</h2>}
            {/* Other dashboard content */}
        </div>
    );
}