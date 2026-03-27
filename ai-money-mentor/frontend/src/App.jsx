import React, { useState } from 'react';
import Chat from './components/Chat';
import FireCalculator from './components/FireCalculator';
import MoneyHealthScore from './components/MoneyHealthScore';
import TaxWizard from './components/TaxWizard';
import { MessageCircle, Calculator, Heart, FileText, IndianRupee } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', name: 'Chat', icon: MessageCircle },
    { id: 'fire', name: 'FIRE Calculator', icon: Calculator },
    { id: 'health', name: 'Money Health Score', icon: Heart },
    { id: 'tax', name: 'Tax Wizard', icon: FileText },
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

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-muted/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-bold text-text">AI Money Mentor</h1>
          </div>
          <div className="hidden md:block text-sm text-muted">
            Your Personal Finance Advisor
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 bg-card border-r border-muted/20">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-accent/10 text-accent border-l-2 border-accent'
                      : 'text-muted hover:text-text hover:bg-primary/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4">
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
