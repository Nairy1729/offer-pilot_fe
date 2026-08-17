import { create } from "zustand";
import type { AuthSession, User } from "../types/auth.types";

const AUTH_STORAGE_KEY = "offerpilot_auth";

type PersistedAuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  tokenType: "Bearer" | null;
  expiresIn: number | null;
};

type AuthState = PersistedAuthState & {
  isAuthenticated: boolean;
  setSession: (session: AuthSession) => void;
  updateTokens: (tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: "Bearer";
  }) => void;
  updateUser: (user: User) => void;
  clearSession: () => void;
};

function getDefaultAuthState(): PersistedAuthState {
  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    tokenType: null,
    expiresIn: null,
  };
}

function loadAuthState(): PersistedAuthState {
  try {
    const storedValue = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedValue) {
      return getDefaultAuthState();
    }

    const parsedValue = JSON.parse(storedValue) as PersistedAuthState;

    return {
      user: parsedValue.user ?? null,
      accessToken: parsedValue.accessToken ?? null,
      refreshToken: parsedValue.refreshToken ?? null,
      tokenType: parsedValue.tokenType ?? null,
      expiresIn: parsedValue.expiresIn ?? null,
    };
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return getDefaultAuthState();
  }
}

function saveAuthState(state: PersistedAuthState) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
}

function clearAuthState() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

const initialAuthState = loadAuthState();

export const useAuthStore = create<AuthState>((set) => ({
  ...initialAuthState,
  isAuthenticated: Boolean(
    initialAuthState.accessToken && initialAuthState.refreshToken
  ),

  setSession: (session) => {
    const nextState: PersistedAuthState = {
      user: session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      tokenType: session.tokenType,
      expiresIn: session.expiresIn,
    };

    saveAuthState(nextState);

    set({
      ...nextState,
      isAuthenticated: true,
    });
  },

  updateTokens: (tokens) => {
    set((state) => {
      const nextState: PersistedAuthState = {
        user: state.user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenType: tokens.tokenType,
        expiresIn: tokens.expiresIn,
      };

      saveAuthState(nextState);

      return {
        ...nextState,
        isAuthenticated: Boolean(nextState.user && nextState.accessToken),
      };
    });
  },

  updateUser: (user) => {
    set((state) => {
      const nextState: PersistedAuthState = {
        user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenType: state.tokenType,
        expiresIn: state.expiresIn,
      };

      saveAuthState(nextState);

      return {
        user,
      };
    });
  },

  clearSession: () => {
    clearAuthState();

    set({
      ...getDefaultAuthState(),
      isAuthenticated: false,
    });
  },
}));