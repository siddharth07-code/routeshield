import { useState } from 'react';
import LandingPage from './sections/LandingPage';
import Sidebar from './components/Sidebar';
import Overview from './sections/Overview';
import RoadIntelligence from './sections/RoadIntelligence';
import DisruptionSimulator from './sections/DisruptionSimulator';
import EmergencyAccess from './sections/EmergencyAccess';
import RecoveryPriority from './sections/RecoveryPriority';
import AboutModel from './sections/AboutModel';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [scenario, setScenario] = useState('flood');
  const [dashboardReady, setDashboardReady] = useState(false);

  const handleEnterDashboard = () => {
    setShowLanding(false);
    // Slight delay so page-enter animation plays
    setTimeout(() => setDashboardReady(true), 50);
  };

  const handleBackToHome = () => {
    setDashboardReady(false);
    setTimeout(() => setShowLanding(true), 100);
  };

  if (showLanding) {
    return <LandingPage onEnter={handleEnterDashboard} />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview scenario={scenario} onScenarioChange={setScenario} />;
      case 'intelligence':
        return <RoadIntelligence scenario={scenario} />;
      case 'simulator':
        return <DisruptionSimulator scenario={scenario} onScenarioChange={setScenario} />;
      case 'emergency':
        return <EmergencyAccess scenario={scenario} />;
      case 'recovery':
        return <RecoveryPriority scenario={scenario} />;
      case 'about':
        return <AboutModel />;
      default:
        return <Overview scenario={scenario} onScenarioChange={setScenario} />;
    }
  };

  return (
    <div className={`flex h-screen w-screen relative z-10 ${dashboardReady ? 'page-enter' : 'opacity-0'}`}>
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} onBackToHome={handleBackToHome} />
      <main className="flex-1 overflow-hidden p-6 pl-2">
        {renderSection()}
      </main>
    </div>
  );
}
