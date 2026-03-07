import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as api from './api';

const PlaidContext = createContext(null);

export function PlaidProvider({ children }) {
  const [linkToken, setLinkToken] = useState(null);
  const [linkError, setLinkError] = useState(null);
  const [isLinked, setIsLinked] = useState(false);
  const [backendOk, setBackendOk] = useState(true);

  const loadLinkToken = useCallback(async () => {
    try {
      setLinkError(null);
      const info = await api.getInfo();
      setBackendOk(true);
      if (info.access_token) {
        setIsLinked(true);
        setLinkToken(null);
        return;
      }
      const token = await api.createLinkToken();
      setLinkToken(token);
      localStorage.setItem('link_token', token);
    } catch (err) {
      setBackendOk(false);
      setLinkError(err.message);
      setLinkToken(null);
    }
  }, []);

  useEffect(() => {
    if (window.location.href.includes('?oauth_state_id=')) {
      setLinkToken(localStorage.getItem('link_token'));
      return;
    }
    loadLinkToken();
  }, [loadLinkToken]);

  const onLinkSuccess = useCallback(async (publicToken) => {
    try {
      await api.setAccessToken(publicToken);
      setIsLinked(true);
      setLinkToken(null);
      setLinkError(null);
      window.history.pushState('', '', '/');
    } catch (err) {
      setLinkError(err.message);
    }
  }, []);

  return (
    <PlaidContext.Provider
      value={{
        linkToken,
        linkError,
        isLinked,
        backendOk,
        onLinkSuccess,
        loadLinkToken,
      }}
    >
      {children}
    </PlaidContext.Provider>
  );
}

export function usePlaid() {
  const ctx = useContext(PlaidContext);
  if (!ctx) throw new Error('usePlaid must be used within PlaidProvider');
  return ctx;
}
