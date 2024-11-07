import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import LoadingPage from "./LoadingPage";

export default function ProtectedRoute({ children }: {
    children: React.ReactNode;
}) {
    const { status, isConnected } = useAccount();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isConnected) {
            window.location.href = "/";
            return;
        }
        setLoading(false);
    }, [status, isConnected]);

    if (loading || status === "connecting" || status === "reconnecting")
        return <LoadingPage />
    return (
        <>{children}</>
    );
}