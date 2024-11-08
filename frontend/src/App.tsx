import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Documentation from './pages/Documentation';
import Dashboard from './pages/Dashboard';
import CreateCourse from "./pages/CreateCourse.tsx";
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Web3Provider from './components/Web3Provider.tsx';

function App() {
  return (
    <Web3Provider>
      <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/courses/create" element={
                <ProtectedRoute>
                  <CreateCourse />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </BrowserRouter>
    </Web3Provider>
  );
}

export default App;