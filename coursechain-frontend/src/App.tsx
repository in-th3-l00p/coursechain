import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Documentation from './pages/Documentation';
import Dashboard from './pages/Dashboard';
import { Web3Provider } from './context/Web3Context';
import CreateCourse from "./pages/CreateCourse.tsx";

function App() {
  return (
    <Web3Provider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses/create" element={<CreateCourse />} />
          </Routes>
        </div>
      </BrowserRouter>
    </Web3Provider>
  );
}

export default App;