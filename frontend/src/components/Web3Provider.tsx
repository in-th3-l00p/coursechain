import { createConfig, WagmiProvider, http, useAccount } from 'wagmi';
import { hardhat } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import LoadingPage from './LoadingPage';

function LoadingState({ children }: {
    children: React.ReactNode
}) {
    const { status } = useAccount();

    if (status === "connecting" || status === "reconnecting")
        return <LoadingPage />
    return (
        <>{children}</>
    )
}

export default function Web3Provider({ children }: {
    children: React.ReactNode;
}) {
    return (
        <WagmiProvider config={createConfig({
            chains: [hardhat],
            transports: {
                [hardhat.id]: http()
            }
        })}>
            <QueryClientProvider client={new QueryClient()}>
                <LoadingState>
                    {children}
                </LoadingState>
            </QueryClientProvider>
        </WagmiProvider>
    );
}