import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState("");
    const [operationName, setOperationName] = useState("");
    const [operationId, setOperationId] = useState("");
    const [section, setSection] = useState("");
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
        if (name.trim() !== "" && operationName.trim() !== "" && operationId.trim() !== "" && section.trim() !== "") {
            navigate("/stopwatch", { state: { name, operationName, operationId, section } });
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
                        <h3>Enter Details</h3>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                        <input type="text" value={operationName} onChange={(e) => setOperationName(e.target.value)} placeholder="Operation Name" />
                        <input type="text" value={operationId} onChange={(e) => setOperationId(e.target.value)} placeholder="Operation ID" />
                        <input type="text" value={section} onChange={(e) => setSection(e.target.value)} placeholder="Section" />
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
                        <th>Operation Name</th>
                        <th>Operation ID</th>
                        <th>Section</th>
                        {[...Array(10)].map((_, index) => (
                            <th key={index}>Lap {index + 1}</th>
                        ))}
                        <th>Average Time</th>
                        <th>Allowance</th>
                        <th>Expected PPH</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>{entry.name}</td>
                            <td>{entry.operationName}</td>
                            <td>{entry.operationId}</td>
                            <td>{entry.section}</td>
                            {[...Array(10)].map((_, lapIndex) => (
                                <td key={lapIndex}>{entry.lapDifferences[lapIndex]}</td>
                            ))}
                            <td>{entry.averageTime}</td>
                            <td>{entry.allowance}</td>
                            <td>{entry.expectedProductionPerHour}</td>
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
