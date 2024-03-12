import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Route, Routes } from 'react-router-dom';

import CookieConsent, { getCookieConsentValue } from 'react-cookie-consent';

import NewProject from './project/NewProject';
import { ProjectForm, ScrollToTopOnce } from './project/Project';

import Feedback from './authentication/Feedback';

import { ThemeProvider } from '@mui/material';
import './App.css';
import AuthenticationGuard from './authentication/AuthenticationGuard';
import { AuthenticationProvider } from './authentication/context/useAuthentication';
import Home from './authentication/Home';
import Login from './authentication/Login';
import Recover from './authentication/Recover';
import Register from './authentication/Register';
import ResetPassword from './authentication/ResetPassword';
import AppLayout from './layout/AppLayout';
import { HeaderProject } from './layout/Headers';
import { Provider as BackToProvider } from './project/context/useBackTo';
import Projects from './projects/Projects';
import Results from './results/Results';
import theme from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if ((error as any).message === 'Unauthorized') {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    if (getCookieConsentValue()) {
      initSentry();
    }
  }, []);

  const initSentry = () => {
    if (process.env.REACT_APP_SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [new BrowserTracing()],
        tracesSampleRate: 1.0,
      });
    }
  };
  const handleAccept = () => {
    initSentry();
  };

  return (
    <ThemeProvider theme={theme}>
      <CookieConsent
        onAccept={handleAccept}
        flipButtons
        enableDeclineButton
        location="bottom"
        buttonText="Autoriser et fermer"
        declineButtonText="Refuser"
        expires={150}
      >
        SCRRAP ne fait <b>aucun suivi publicitaire</b> et ne collecte aucune
        données personnelles, hors données d'authentification. Des cookies sont
        utilisés à des fins statistiques ou de fonctionnement, ainsi que
        d'analyse (que vous pouvez refuser ici), nous permettant d'améliorer le
        site en continu.
      </CookieConsent>
      <QueryClientProvider client={queryClient}>
        <BackToProvider>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            style={{ top: '64px' }}
            className="snackbar"
          >
            <AuthenticationProvider>
              <AuthenticationGuard suppressError>
                <Feedback />
              </AuthenticationGuard>
              <Routes>
                <Route path="/authentication" element={<Home />} />
                <Route path="/authentication/login" element={<Login />} />
                <Route path="/authentication/register" element={<Register />} />
                <Route path="/authentication/recover" element={<Recover />} />
                <Route
                  path="/authentication/recover/:email"
                  element={<Recover />}
                />
                <Route
                  path="/authentication/reset-password/:token"
                  element={
                    <ResetPassword
                      title="Réinitialisation mot de passe"
                      fieldLabel="Nouveau mot de passe"
                      successMessage="Mot de passe réinitialisé avec succès"
                      buttonLabel="Réinitialiser"
                    />
                  }
                />
                <Route
                  path="/authentication/confirm-account/:token"
                  element={
                    <ResetPassword
                      title="Création de compte"
                      fieldLabel="Mot de passe"
                      successMessage="Compte créé avec succès"
                      buttonLabel="Créer"
                    />
                  }
                />

                <Route
                  path="/"
                  element={
                    <AuthenticationGuard>
                      <Projects />
                    </AuthenticationGuard>
                  }
                />

                <Route
                  path="/project"
                  element={
                    <AuthenticationGuard>
                      <NewProject />
                    </AuthenticationGuard>
                  }
                />

                <Route
                  path="/project/:projectId/"
                  element={
                    <AuthenticationGuard>
                      <AppLayout header={<HeaderProject />}>
                        <ProjectForm />
                      </AppLayout>
                    </AuthenticationGuard>
                  }
                />

                <Route
                  path="/project/:projectId/results"
                  element={
                    <AuthenticationGuard>
                      <AppLayout header={<HeaderProject />}>
                        <ScrollToTopOnce />
                        <Results />
                      </AppLayout>
                    </AuthenticationGuard>
                  }
                />
              </Routes>
            </AuthenticationProvider>

            <ReactQueryDevtools initialIsOpen={false} />
          </SnackbarProvider>
        </BackToProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
