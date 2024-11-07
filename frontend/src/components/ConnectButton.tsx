import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const ConnectButton = () => {
  const { isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState(null);

  const handleButtonClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      setIsModalOpen(true);
    }
  };

  const handleConnect = () => {
    if (selectedConnector) {
      connect({ connector: selectedConnector });
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={handleButtonClick}
        className="flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnected ? 'Disconnect' : 'Connect Wallet'}
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed w-screen h-screen inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-white">Select a Wallet</h2>
            {connectors && connectors.length > 0 ? (
              <div className="space-y-4">
                {connectors.map((connector) => (
                  <div key={connector.id} className="flex items-center">
                    <input
                      type="radio"
                      id={connector.id}
                      name="wallet"
                      value={connector.id}
                      checked={selectedConnector?.id === connector.id}
                      onChange={() => setSelectedConnector(connector)}
                      className="mr-2"
                    />
                    <label htmlFor={connector.id} className="text-gray-300">
                      {connector.name}
                    </label>
                  </div>
                ))}
                <button
                  onClick={handleConnect}
                  disabled={!selectedConnector}
                  className={`mt-4 w-full px-4 py-2 rounded-lg text-white ${
                    selectedConnector
                      ? 'bg-indigo-600 hover:bg-indigo-700'
                      : 'bg-gray-600 cursor-not-allowed'
                  }`}
                >
                  Connect
                </button>
              </div>
            ) : (
              <p className="text-gray-400">
                No wallet connectors found. Please install a Web3 wallet like{' '}
                <a
                  href="https://metamask.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-500 underline"
                >
                  MetaMask
                </a>
                .
              </p>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectButton;
