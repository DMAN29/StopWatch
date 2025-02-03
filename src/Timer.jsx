import React from "react";

export default function Timer(props) {
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000); // Extract minutes
        const seconds = Math.floor((time % 60000) / 1000); // Extract seconds
        const milliseconds = Math.floor((time % 1000) / 10); // Extract milliseconds (2 digits)
    
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
    };
    
    

    return (
        <div className="timer">
            <span className="digits">{formatTime(props.time)}</span>
        </div>
    );
}
