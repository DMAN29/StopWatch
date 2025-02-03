import { Routes, Route } from "react-router-dom";
import StopWatch from "./StopWatch";
import HomePage from "./HomePage ";

function App() {
    return (
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stopwatch" element={<StopWatch />} />
            </Routes>
    );
}

export default App;
