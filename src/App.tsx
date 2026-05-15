import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import OnboardingScreen from './components/OnboardingScreen';
import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import OTPScreen from './components/OTPScreen';
import KYCScreen from './components/KYCScreen';
import MainLayout from './components/MainLayout';
import DashboardScreen from './components/DashboardScreen';
import SavingsHubScreen from './components/SavingsHubScreen';
import CreateSavingsPlanScreen from './components/CreateSavingsPlanScreen';
import ThriftScreen from './components/ThriftScreen';
import AddThriftScreen from './components/AddThriftScreen';
import AirtimeScreen from './components/AirtimeScreen';
import AirtimeHistoryScreen from './components/AirtimeHistoryScreen';
import DepositScreen from './components/DepositScreen';
import WithdrawScreen from './components/WithdrawScreen';
import NotificationScreen from './components/NotificationScreen';
import ProfileScreen from './components/ProfileScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isDarkState, setIsDarkState] = useState(false);

  useEffect(() => {
    // Check dark mode
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkState(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkState(false);
    }
  }, []);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={() => setCurrentScreen('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onNavigate={setCurrentScreen} />;
      case 'login':
        return <LoginScreen onNavigate={setCurrentScreen} />;
      case 'signup':
        return <SignupScreen onNavigate={setCurrentScreen} />;
      case 'otp':
        return <OTPScreen onNavigate={setCurrentScreen} />;
      case 'kyc':
        return <KYCScreen onNavigate={setCurrentScreen} />;
      
      // Wrapped in MainLayout
      case 'dashboard':
      case 'savings_hub':
      case 'create_savings':
      case 'thrift':
      case 'add_thrift':
      case 'airtime':
      case 'airtime_history':
      case 'deposit':
      case 'withdraw':
      case 'notifications':
      case 'profile':
        return (
          <MainLayout activeScreen={currentScreen} onNavigate={setCurrentScreen}>
            {currentScreen === 'dashboard' && <DashboardScreen onNavigate={setCurrentScreen} />}
            {currentScreen === 'savings_hub' && <SavingsHubScreen onNavigate={setCurrentScreen} />}
            {currentScreen === 'create_savings' && <CreateSavingsPlanScreen onNavigate={setCurrentScreen} />}
            {currentScreen === 'thrift' && <ThriftScreen onNavigate={setCurrentScreen} />}
            {currentScreen === 'add_thrift' && <AddThriftScreen onNavigate={setCurrentScreen} />}
            {currentScreen === 'airtime' && <AirtimeScreen onNavigate={setCurrentScreen} />}
            {currentScreen === 'airtime_history' && <AirtimeHistoryScreen onNavigate={setCurrentScreen} />}
            {currentScreen === 'deposit' && <DepositScreen onNavigate={setCurrentScreen} />}
            {currentScreen === 'withdraw' && <WithdrawScreen onNavigate={setCurrentScreen} />}
            {currentScreen === 'notifications' && <NotificationScreen onNavigate={setCurrentScreen} />}
            {currentScreen === 'profile' && <ProfileScreen onNavigate={setCurrentScreen} />}
          </MainLayout>
        );
      
      default:
        return <OnboardingScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <>
      {renderScreen()}
    </>
  );
}

export default App;
