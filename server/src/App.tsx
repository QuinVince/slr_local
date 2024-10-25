import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import QueryGenerator from './components/QueryGenerator';
import DocumentAnalysis from './components/DocumentAnalysis';
import DuplicateAnalysis from './components/DuplicateAnalysis';
import FilteringDiagram from './components/FilteringDiagram';

interface SavedQuery {
  // Add properties as needed
  id: string;
  name: string;
  query: string;
}

const App: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<string>('landing');
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [analysisData, setAnalysisData] = useState({}); // Add proper type

  const handleSaveQuery = (query: SavedQuery) => {
    setSavedQueries([...savedQueries, query]);
  };

  const handleClearQueries = () => {
    setSavedQueries([]);
  };

  const updateAnalysisData = (data: any) => { // Replace 'any' with proper type
    setAnalysisData(data);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'landing':
        return <LandingPage onNavigate={setActiveComponent} />;
      case 'query':
        return (
          <QueryGenerator
            onSaveQuery={handleSaveQuery}
            savedQueries={savedQueries}
            onClearQueries={handleClearQueries}
          />
        );
      case 'duplicate':
        return <DuplicateAnalysis savedQueries={savedQueries} />;
      case 'screening':
        return (
          <DocumentAnalysis
            analysisData={analysisData}
            updateAnalysisData={updateAnalysisData}
            savedQueries={savedQueries}
          />
        );
      case 'prism':
        return <FilteringDiagram analysisData={analysisData} />;
      default:
        return <LandingPage onNavigate={setActiveComponent} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">SLR Assistant</h1>
        </div>
      </header>
      <main>
        {renderComponent()}
      </main>
    </div>
  );
};

export default App;
