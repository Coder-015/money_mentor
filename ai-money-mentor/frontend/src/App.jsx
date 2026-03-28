import React, { useState } from 'react';
import Chat from './components/Chat';
import FireCalculator from './components/FireCalculator';
import MoneyHealthScore from './components/MoneyHealthScore';
import TaxWizard from './components/TaxWizard';
import { MessageCircle, Flame, Activity, Calculator, IndianRupee } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', name: 'Chat', icon: MessageCircle },
    { id: 'fire', name: 'FIRE Calculator', icon: Flame },
    { id: 'health', name: 'Health Score', icon: Activity },
    { id: 'tax', name: 'Tax Wizard', icon: Calculator },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <Chat />;
      case 'fire':
        return <FireCalculator />;
      case 'health':
        return <MoneyHealthScore />;
      case 'tax':
        return <TaxWizard />;
      default:
        return <Chat />;
    }
  };

  const getTabName = () => {
    const tab = tabs.find(t => t.id === activeTab);
    return tab ? tab.name : '';
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-muted/20 px-5 h-14 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center space-x-2">
          <div className="text-white text-base font-medium">{getTabName()}</div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full online-dot"></div>
          <span className="text-xs text-green-500">AI Online</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-[260px] bg-card border-r border-muted/20">
          <div className="p-5 py-4">
            <div className="flex items-center space-x-2 mb-6">
              <IndianRupee className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-text">AI Money Mentor</h2>
            </div>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-5 py-4 rounded-lg transition-all duration-200 nav-item ${
                      activeTab === tab.id
                        ? 'text-accent border-l-[3px] border-accent'
                        : 'text-muted hover:text-text'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    <span className="font-medium whitespace-nowrap">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-8 pt-4 border-t border-muted/20">
              <p className="text-xs text-muted text-center">
                For educational purposes only
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className={`max-w-6xl mx-auto p-5 page-content`}>
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile */}
      <div className="md:hidden bg-card border-t border-muted/20">
        <nav className="flex justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'text-accent'
                    : 'text-muted'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Disclaimer */}
      <footer className="bg-card border-t border-muted/20 px-4 py-3">
        <div className="max-w-7xl mx-auto text-center text-xs text-muted">
          This is AI-generated advice. Please consult a certified financial planner for major decisions.
        </div>
      </footer>
    </div>
  );
}

export default App;
