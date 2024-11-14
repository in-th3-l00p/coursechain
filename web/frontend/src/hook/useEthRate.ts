// hooks/useEthRate.ts
import { useState, useEffect } from 'react';

const ETH_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur';

/**
 * Custom hook to fetch ETH to EUR exchange rate and provide utility functions.
 */
export const useEthRate = () => {
  const [ethToEurRate, setEthToEurRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEthToEurRate = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(ETH_API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch ETH price');
        }
        const data = await response.json();
        if (data.ethereum && typeof data.ethereum.eur === 'number') {
          setEthToEurRate(data.ethereum.eur);
        } else {
          throw new Error('Invalid data format from ETH price API');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message || 'An unexpected error occurred');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEthToEurRate();
  }, []);

  /**
   * Converts ETH to EUR based on the fetched exchange rate.
   * @param eth Amount in ETH
   * @returns EUR equivalent as a string with two decimal places
   */
  const calculateEthToEur = (eth: number): string => {
    if (ethToEurRate !== null && !isNaN(eth)) {
      return (eth * ethToEurRate).toFixed(2);
    }
    return '0.00';
  };

  /**
   * Converts EUR to ETH based on the fetched exchange rate.
   * @param eur Amount in EUR
   * @returns ETH equivalent as a string with six decimal places
   */
  const calculateEurToEth = (eur: number): string => {
    if (ethToEurRate !== null && ethToEurRate !== 0 && !isNaN(eur)) {
      return (eur / ethToEurRate).toFixed(6);
    }
    return '0.000000';
  };

  return {
    ethToEurRate,
    isLoading,
    error,
    calculateEthToEur,
    calculateEurToEth,
  };
};
