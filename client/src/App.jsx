import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Overview from './sections/Overview';
import RoadIntelligence from './sections/RoadIntelligence';
import DisruptionSimulator from './sections/DisruptionSimulator';
import EmergencyAccess from './sections/EmergencyAccess';
import RecoveryPriority from './sections/RecoveryPriority';
import AboutModel from './sections/AboutModel';

export default function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [scenario, setScenario] = useState('flood');

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
    <div className="flex h-screen w-screen relative z-10">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="flex-1 overflow-hidden p-6 pl-2">
        {renderSection()}
      </main>
    </div>
  );
}
