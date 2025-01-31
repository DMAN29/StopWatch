import React from "react";

export default function Timer(props) {
    const formatTime = (time) => {
        const hours = Math.floor(time / 3600000); // Convert milliseconds to hours
        const minutes = Math.floor((time % 3600000) / 60000); // Convert milliseconds to minutes
        const seconds = Math.floor((time % 60000) / 1000); // Convert milliseconds to seconds
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Format as hh:mm:ss
    };

    return (
        <div className="timer">
            <span className="digits">{formatTime(props.time)}</span>
        </div>
    );
}
