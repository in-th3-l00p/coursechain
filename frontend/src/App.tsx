import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Documentation from './pages/Documentation';
import Dashboard from './pages/Dashboard';
import CreateCourse from "./pages/CreateCourse.tsx";
import { createConfig, WagmiProvider, http } from 'wagmi';
import { hardhat } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  return (
    <WagmiProvider config={createConfig({
      chains: [hardhat],
      transports: {
        [hardhat.id]: http()
      }
    })}>
      <QueryClientProvider client={new QueryClient()}>
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
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;