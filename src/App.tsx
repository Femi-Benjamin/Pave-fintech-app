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
import ThriftDetailScreen from './components/ThriftDetailScreen';
import JoinThriftGroupScreen from './components/JoinThriftGroupScreen';
import AllThriftGroupsScreen from './components/AllThriftGroupsScreen';
import AllSavingsGoalsScreen from './components/AllSavingsGoalsScreen';
import DepositScreen from './components/DepositScreen';
import WithdrawScreen from './components/WithdrawScreen';
import NotificationScreen from './components/NotificationScreen';
import ProfileScreen from './components/ProfileScreen';
import SaveToBuyScreen from './components/SaveToBuyScreen';

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
    const baseScreen = currentScreen.split(':')[0];
    const screenParam = currentScreen.split(':')[1];

    switch (baseScreen) {
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
      case 'join_thrift':
      case 'all_thrifts':
      case 'all_savings':
      case 'airtime':
      case 'airtime_history':
      case 'thrift_detail':
      case 'deposit':
      case 'withdraw':
      case 'notifications':
      case 'profile':
      case 'save_to_buy':
        return (
          <MainLayout activeScreen={baseScreen} onNavigate={setCurrentScreen}>
            {baseScreen === 'dashboard' && <DashboardScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'savings_hub' && <SavingsHubScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'create_savings' && <CreateSavingsPlanScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'thrift' && <ThriftScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'add_thrift' && <AddThriftScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'join_thrift' && <JoinThriftGroupScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'all_thrifts' && <AllThriftGroupsScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'all_savings' && <AllSavingsGoalsScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'airtime' && <AirtimeScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'airtime_history' && <AirtimeHistoryScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'thrift_detail' && <ThriftDetailScreen onNavigate={setCurrentScreen} groupId={screenParam || 'q3_tech'} />}
            {baseScreen === 'deposit' && <DepositScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'withdraw' && <WithdrawScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'notifications' && <NotificationScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'profile' && <ProfileScreen onNavigate={setCurrentScreen} />}
            {baseScreen === 'save_to_buy' && <SaveToBuyScreen onNavigate={setCurrentScreen} />}
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
