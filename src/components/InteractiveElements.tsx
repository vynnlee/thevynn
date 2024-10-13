// src/components/InteractiveElements.tsx
import React from 'react';
import { useCursor } from '../contexts/CursorContext';

const InteractiveElements: React.FC = () => {
    const { setCursorOption } = useCursor();

    return (
        <div className="flex space-x-4">
            <button
                onMouseEnter={() => setCursorOption('grab')}
                onMouseLeave={() => setCursorOption('arrow')}
                className="px-4 py-2 bg-green-500 text-white rounded"
            >
                Grab
            </button>
            <button
                onMouseEnter={() => setCursorOption('pointer')}
                onMouseLeave={() => setCursorOption('arrow')}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
            >
                Pointer
            </button>
            <button
                onMouseEnter={() => setCursorOption('zoomIn')}
                onMouseLeave={() => setCursorOption('arrow')}
                className="px-4 py-2 bg-red-500 text-white rounded"
            >
                Zoom In
            </button>
            <button
                onMouseEnter={() => setCursorOption('zoomOut')}
                onMouseLeave={() => setCursorOption('arrow')}
                className="px-4 py-2 bg-purple-500 text-white rounded"
            >
                Zoom Out
            </button>
        </div>
    );
};

export default InteractiveElements;
