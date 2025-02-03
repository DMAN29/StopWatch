import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Timer from "./Timer";
import ControlButtons from "./ControlButtons";

function StopWatch() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(0);
    const [flags, setFlags] = useState([]);
    const [averageTime, setAverageTime] = useState(null);
    
    const storedName = localStorage.getItem("userName");
    const [name, setName] = useState(location.state?.name || storedName || "Guest");

    useEffect(() => {
        if (name !== "Guest") {
            localStorage.setItem("userName", name);
        }
    }, [name]);

    useEffect(() => {
        let interval = null;
        if (isActive && !isPaused) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
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
        calculateAverageTime(flags);
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
            const newFlags = [...flags, time];
            setFlags(newFlags);
            if (newFlags.length === 10) {
                setIsPaused(true);
                setIsActive(false);
                calculateAverageTime(newFlags);
            }
        }
    };

    const calculateAverageTime = (flagTimes) => {
        if (flagTimes.length < 1) return;

        const differences = calculateLapDifferences(flagTimes);
        const totalDifference = differences.reduce((acc, curr) => acc + curr, 0);
        const average = totalDifference / differences.length;

        setAverageTime(average);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000); // Extract minutes
        const seconds = Math.floor((time % 60000) / 1000); // Extract seconds
        const milliseconds = Math.floor((time % 1000) / 10); // Extract milliseconds (2 digits)
    
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
    };
    

    const calculateLapDifferences = (flagTimes) => {
        return flagTimes.map((flag, index) => {
            if (index === 0) return flag;
            return flag - flagTimes[index - 1];
        });
    };

    const handleSubmit = () => {
        const lapDifferences = calculateLapDifferences(flags);
        const formattedLapDifferences = lapDifferences.map(formatTime);

        // Ensure we always send an array of 10 elements
        const fullLapDifferences = [...formattedLapDifferences, ...Array(10 - formattedLapDifferences.length).fill("")];

        navigate("/", {
            state: {
                name: name,
                lapDifferences: fullLapDifferences,
                averageTime: formatTime(averageTime || 0),
            },
        });
    };

    const lapDifferences = calculateLapDifferences(flags);

    return (
        <>
            <h2>Welcome, {name}</h2>
            <div className="stop-watch">
                <Timer time={time} />
                <ControlButtons
                    active={isActive}
                    isPaused={isPaused}
                    handleStart={handleStart}
                    handlePause={handlePause}
                    handleReset={handleReset}
                    handleFlag={handleFlag}
                    showFlagButton={!isPaused && isActive && flags.length < 10}
                />
            </div>
            <div className="flags">
                <h3>Lap Times</h3>
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
                    <h4>Average Lap Difference: {formatTime(averageTime)}</h4>
                )}
            </div>
            {flags.length > 0 && <button onClick={handleSubmit}>Submit</button>}
        </>
    );
}

export default StopWatch;
