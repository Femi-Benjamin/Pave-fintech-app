import React, { useEffect } from "react";
import { useLocalStore } from "../hooks/useLocalStore";
import { getToken, isTokenValid } from "../lib/authStorage";
import { PaveLoadingState } from "./PaveLoadingState";
import { Screen } from "../pave-data";

interface ProtectedRouteProps {
  children: React.ReactNode;
  onNav: (screen: Screen) => void;
  currentScreen?: Screen;
}

export function ProtectedRoute({
  children,
  onNav,
  currentScreen,
}: ProtectedRouteProps) {
  const { authUser, isAuthLoading } = useLocalStore();
  const token = getToken();
  const hasValidSession = Boolean(token && isTokenValid(token) && authUser);

  useEffect(() => {
    if (!isAuthLoading && !hasValidSession) {
      onNav("login");
    }
  }, [isAuthLoading, hasValidSession, onNav, currentScreen]);

  if (isAuthLoading) {
    return (
      <PaveLoadingState
        title="Checking session..."
        subtitle="Securing your PAVEPADI account"
      />
    );
  }

  if (!hasValidSession) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
