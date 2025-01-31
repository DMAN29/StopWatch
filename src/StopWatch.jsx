import React, { useState } from "react";
import { FaPlay, FaPause, FaRedo, FaFlag } from "react-icons/fa";
import Timer from "./Timer";
import ControlButtons from "./ControlButtons";

function StopWatch() {
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [flags, setFlags] = useState([]);
    const [averageTime, setAverageTime] = useState(null);

    React.useEffect(() => {
        let interval = null;
        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1000); // Increment by 1000 milliseconds (1 second)
            }, 1000); // Update every second
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, isPaused]);

    const handleStart = () => {
        setIsActive(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        setIsPaused(true);
        // Calculate average time using recorded differences when paused
        calculateAverageTime();
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(0);
        setFlags([]);
        setIsPaused(true);
        setAverageTime(null);
    };

    const handleFlag = () => {
        if (flags.length < 10) {
            setFlags([...flags, time]);
            if (flags.length === 9) {
                // If 10 laps are completed, calculate average time
                calculateAverageTime();
            }
        }
    };

    const calculateAverageTime = () => {
        const differences = calculateLapDifferences();
        if (differences.length === 0) return; // No differences to average
        const totalDifference = differences.reduce((acc, curr) => acc + curr, 0);
        const average = totalDifference / differences.length; // Calculate average of differences
        setAverageTime(average);
    };

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600000); // Convert milliseconds to hours
        const minutes = Math.floor((time % 3600000) / 60000); // Convert milliseconds to minutes
        const seconds = Math.floor((time % 60000) / 1000); // Convert milliseconds to seconds
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; // Format as hh:mm:ss
    };

    const calculateLapDifferences = () => {
        return flags.map((flag, index) => {
            if (index === 0) {
                return flag; // First lap shows total time from 00:00:00
            } else {
                return flag - flags[index - 1]; // Subsequent laps show difference from previous lap
            }
        });
    };

    const lapDifferences = calculateLapDifferences();

    return (
        <div className="stop-watch">
            <Timer time={time} />
            <ControlButtons
                active={isActive}
                isPaused={isPaused}
                handleStart={handleStart}
                handlePause={handlePause}
                handleReset={handleReset}
                handleFlag={handleFlag}
                showFlagButton={!isPaused && isActive} // Show flag button only if active and not paused
            />
            <div className="flags">
                <h3>Flags</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Lap</th>
                            <th>Time</th>
                            <th>Difference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flags.map((flag, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{formatTime(flag)}</td>
                                <td>{formatTime(lapDifferences[index])}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {averageTime !== null && (
                    <div>
                        <h4>Average Time of Differences: {formatTime(averageTime)}</h4>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StopWatch;
