import { createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface AuthUser {
  id: string;
  username: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const USERS_STORAGE_KEY = 'tarot_users';
const CURRENT_USER_KEY = 'tarot_current_user';

interface StoredUser {
  id: string;
  username: string;
  password: string;
}

function getUsers(): StoredUser[] {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export const signIn = async (username: string, password: string) => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    throw new Error('Invalid username or password');
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
    id: user.id,
    username: user.username
  }));

  return { user: { id: user.id, username: user.username } };
};

export const signUp = async (username: string, password: string) => {
  const users = getUsers();
  
  if (users.some(u => u.username === username)) {
    throw new Error('Username already exists');
  }

  const newUser: StoredUser = {
    id: uuidv4(),
    username,
    password
  };

  users.push(newUser);
  saveUsers(users);

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
    id: newUser.id,
    username: newUser.username
  }));

  return { user: { id: newUser.id, username: newUser.username } };
};

export const signOut = async () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};