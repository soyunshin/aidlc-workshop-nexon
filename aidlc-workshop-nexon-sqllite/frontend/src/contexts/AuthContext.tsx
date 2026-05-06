import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import apiClient from '../api/client';
import type { TableCredentials, AuthToken, TokenPayload } from '../api/types';
import { getToken, setToken, clearAuth, decodeToken, isTokenExpired } from '../utils/token';
import { saveCredentials, getCredentials, clearCredentials } from '../utils/storage';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  tableInfo: {
    store_id: number;
    table_id: number;
    table_number: number;
    session_id: number | null;
  } | null;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string; info: TokenPayload } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' };

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  token: null,
  tableInfo: null,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return {
        isAuthenticated: true,
        isLoading: false,
        token: action.payload.token,
        tableInfo: {
          store_id: action.payload.info.store_id,
          table_id: action.payload.info.table_id,
          table_number: action.payload.info.table_number,
          session_id: action.payload.info.session_id,
        },
        error: null,
      };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
}

interface AuthContextValue {
  state: AuthState;
  login: (credentials: TableCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      const info = decodeToken(token);
      if (info) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token, info } });
        return;
      }
    }

    // Try auto-reauthentication
    const credentials = getCredentials();
    if (credentials) {
      login(credentials).catch(() => {
        dispatch({ type: 'LOGOUT' });
      });
    } else {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  async function login(credentials: TableCredentials): Promise<void> {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await apiClient.post<AuthToken>('/table/login', credentials);
      const { access_token } = response.data;
      setToken(access_token);
      saveCredentials(credentials);
      const info = decodeToken(access_token);
      if (info) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token: access_token, info } });
      } else {
        throw new Error('토큰 디코딩 실패');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다';
      dispatch({ type: 'LOGIN_FAILURE', payload: message });
      throw err;
    }
  }

  function logout(): void {
    clearAuth();
    clearCredentials();
    dispatch({ type: 'LOGOUT' });
  }

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
