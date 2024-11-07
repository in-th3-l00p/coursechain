import { Link } from 'react-router-dom';
import { Rocket, LayoutDashboard } from 'lucide-react';
import { useAccount } from 'wagmi';
import ConnectButton from './ConnectButton';

const Navbar = () => {
  const { isConnected } = useAccount();

  return (
    <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-indigo-500" />
              <span className="text-xl font-bold">CourseForge</span>
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                Home
              </Link>
              <Link to="/docs" className="text-gray-300 hover:text-white px-3 py-2 rounded-md flex items-center">
                Docs
              </Link>
            </div>
          </div>
          <div className={"flex items-center justify-between h-16 gap-4"}>
            {isConnected && (
              <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md flex items-center">
                <LayoutDashboard className="w-4 h-4 mr-1" />
                Dashboard
              </Link>
            )}
            <ConnectButton /> 
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;