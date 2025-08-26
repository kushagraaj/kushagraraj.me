import React, { useState } from 'react';

const WarningBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
                <span>Still fixing bugs. You may encounter issues.</span>
                <button 
                    onClick={() => setIsVisible(false)} 
                    className="text-red-200 hover:text-white"
                    aria-label="Dismiss"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default WarningBanner;