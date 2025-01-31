import React from "react";
import { FaPlay, FaRedo, FaFlag, FaPause } from "react-icons/fa"; // Add FaPause here

export default function ControlButtons({
    active,
    isPaused,
    handleStart,
    handlePause,
    handleReset,
    handleFlag,
    showFlagButton,
}) {
    const StartButton = (
        <div className="btn btn-one btn-start" onClick={handleStart}>
            <FaPlay />
        </div>
    );

    const ActiveButtons = (
        <div className="btn-grp">
            {showFlagButton && (
                <div className="btn btn-one" onClick={handleFlag}>
                    <FaFlag />
                </div>
            )}
            <div className="btn btn-one" onClick={handlePause}>
                <FaPause />
            </div>
            <div className="btn btn-two" onClick={handleReset}>
                <FaRedo />
            </div>
        </div>
    );

    return (
        <div className="Control-Buttons">
            <div>{active ? ActiveButtons : StartButton}</div>
        </div>
    );
}
