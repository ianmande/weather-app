import AppRouter from '@navigation/AppRouter';

import ToastProvider from '@components/common/ToastProvider';

import {useInactivityTimeout} from '@hooks/useInactivityTimeout';
import {useTokenExpiration} from '@hooks/useTokenExpiration';

import {WeatherProvider} from '@context/weatherContext';

import './index.css';

function AppContent() {
  useTokenExpiration();
  useInactivityTimeout();

  return (
    <WeatherProvider>
      <AppRouter />
      <ToastProvider />
    </WeatherProvider>
  );
}

function App() {
  return <AppContent />;
}

export default App;
