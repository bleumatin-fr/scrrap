import { createContext, ReactNode, useContext } from 'react';
import { useMutation } from 'react-query';
import { useLocalStorage } from 'usehooks-ts';
import { authenticatedFetch } from '../authenticatedFetch';

const API_URL = process.env.REACT_APP_API_URL;

interface Auth {
  success: boolean;
  token?: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  company?: string;
}

interface AuthenticationContextType {
  auth: Auth | null;
  error: unknown;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  recover: (email: string) => Promise<void>;
  sendMessage: (object: string, message: string, url: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthenticationContext = createContext<AuthenticationContextType>({
  auth: null,
  error: null,
  loading: false,
  login: (email: string, password: string) => Promise.resolve(),
  recover: (email: string) => Promise.resolve(),
  sendMessage: (object: string, message: string, url: string) =>
    Promise.resolve(),
  resetPassword: (token: string, password: string) => Promise.resolve(),
  register: (params: RegisterParams) => Promise.resolve(),
  logout: () => Promise.resolve(),
});

AuthenticationContext.displayName = 'AuthenticationContext';

const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/authentication/login`, {
    method: "POST",
    credentials: "include",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ email, password }),
  });
  if (response.status < 200 || response.status >= 300) {
    const body = await response.json();
    throw new Error(body.message);
  }
  return await response.json();
};

const register = async (params: RegisterParams) => {
  const response = await fetch(`${API_URL}/authentication/register`, {
    method: "POST",
    credentials: "include",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(params),
  });
  const responseBody = await response.json();
  if (response.status < 200 || response.status >= 300) {
    if (responseBody.error && responseBody.error.code === 11000) {
      throw new Error("Cette adresse email est déjà utilisée.");
    }
    throw new Error(response.statusText);
  }
  return responseBody;
};

const recover = async (email: String) => {
  const response = await fetch(`${API_URL}/authentication/recover`, {
    method: "POST",
    credentials: "include",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ email }),
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }
  return await response.json();
};

const resetPassword = async (token: String, password: string) => {
  const response = await fetch(`${API_URL}/authentication/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({ token, password }),
  });
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }
  return await response.json();
};


const sendMessage = async (
  subject: string,
  message: string,
  url: string,
  email?: string,
) => {
  const response = await authenticatedFetch(
    `${API_URL}/authentication/send-message`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({ subject, message, url, email }),
    },
  );
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }
  return await response.json();
};

export const AuthenticationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [auth, setAuth] = useLocalStorage<Auth | null>('auth', null);

  const loginMutation = useMutation(
    ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    {
      onSuccess: (auth) => {
        setAuth(auth);
      },
    },
  );

  const recoverMutation = useMutation(({ email }: { email: string }) =>
    recover(email),
  );

  const resetPasswordMutation = useMutation(
    ({ token, password }: { token: string; password: string }) =>
      resetPassword(token, password),
  );

  const registerMutation = useMutation(
    (params: RegisterParams) => register(params),
    {
      onSuccess: (auth) => {
        setAuth(auth);
      },
    },
  );

  const sendMessageMutation = useMutation(
    ({
      object,
      message,
      url,
    }: {
      object: string;
      message: string;
      url: string;
    }) => sendMessage(object, message, url),
  );

  const logout = async () => {
    localStorage.removeItem('auth');
    setAuth(null);
    return Promise.resolve();
  };

  const authenticationValues = {
    auth,
    error:
      loginMutation.error ||
      registerMutation.error ||
      recoverMutation.error ||
      resetPasswordMutation.error ||
      sendMessageMutation.error,
    loading:
      loginMutation.isLoading ||
      registerMutation.isLoading ||
      recoverMutation.isLoading ||
      resetPasswordMutation.isLoading ||
      sendMessageMutation.isLoading,
    login: (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),
    recover: (email: string) => recoverMutation.mutateAsync({ email }),
    sendMessage: (object: string, message: string, url: string) =>
      sendMessageMutation.mutateAsync({ object, message, url }),
    resetPassword: async (token: string, password: string) => {
      const { user } = await resetPasswordMutation.mutateAsync({
        token,
        password,
      });
      if (!user) {
        throw new Error('User not found');
      }
      return await loginMutation.mutateAsync({ email: user.email, password });
    },
    register: (params: RegisterParams) => registerMutation.mutateAsync(params),
    logout,
  };

  return (
    <AuthenticationContext.Provider value={authenticationValues}>
      {children}
    </AuthenticationContext.Provider>
  );
};

export const useAuthentication = () => {
  return useContext(AuthenticationContext);
};
