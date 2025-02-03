import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState("");
    const [data, setData] = useState(() => {
        const storedData = JSON.parse(localStorage.getItem("lapData"));
        return storedData ? storedData : [];
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (location.state) {
            setData((prevData) => {
                const isDuplicate = prevData.some(entry => entry.name === location.state.name);
                if (!isDuplicate) {
                    const updatedData = [...prevData, location.state];
                    localStorage.setItem("lapData", JSON.stringify(updatedData));
                    return updatedData;
                }
                return prevData;
            });
        }
    }, [location.state]);

    const handleAddNewDetails = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    const handleContinue = () => {
        if (name.trim() !== "") {
            navigate("/stopwatch", { state: { name } });
        }
    };

    const handleDelete = (index) => {
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
        
        if (updatedData.length === 0) {
            localStorage.removeItem("lapData");
        } else {
            localStorage.setItem("lapData", JSON.stringify(updatedData));
        }
    };

    return (
        <div className="home-page">
            <button onClick={handleAddNewDetails}>Add New Details</button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Enter Name</h3>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                        />
                        <div className="modal-buttons">
                            <button onClick={handleContinue}>Continue</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>S.No</th> {/* New S.No column */}
                        <th>Name</th>
                        {[...Array(10)].map((_, index) => (
                            <th key={index}>Lap {index + 1}</th>
                        ))}
                        <th>Average Time</th>
                        <th>Allowance</th> {/* New column for allowance */}
                        <th>Expected Production/Hour</th> {/* New column for expected production */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{entry.name}</td>
                            {[...Array(10)].map((_, lapIndex) => (
                                <td key={lapIndex}>{entry.lapDifferences[lapIndex] || "-"}</td>
                            ))}
                            <td>{entry.averageTime || "-"}</td>
                            <td>{entry.allowance || "-"}</td> {/* Allowance value */}
                            <td>{entry.expectedProductionPerHour || "-"}</td> {/* Expected production value */}
                            <td>
                                <button onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default HomePage;
