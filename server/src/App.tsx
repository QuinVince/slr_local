import React, { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import LandingPage from './components/LandingPage';
import logo from './utils/quinten-health-logo.png'; 
// Add these type definitions
export interface SavedQuery {
  id: string;
  name: string;
  description: string;
  questions: string[];
  answers: Record<string, string>;
  pubmedQuery: string;
  collectedDocuments: {
    pubmed: number;
    semanticScholar: number;
    removedDuplicates?: number;
  };
  paperCount: number;
  freeFullTextCount: number;
  yearDistribution: Record<number, number>;
}

export interface AnalysisData {
  selectedQuery: SavedQuery | null;
  documents: Array<{
    id: number;
    title: string;
    abstract: string;
    date: string;
    authors: string[];
    citationCount: number; // Add this line
    selected: boolean;
    abstractExpanded: boolean;
    studyType: 'Meta-analysis' | 'Systematic Review' | 'RCT' | 'Cohort study' | 'Case-control study' | 'Case report' | 'Case series' | 'Expert opinion' | 'Narrative review' | 'Animal study' | 'In vitro study';
    pico: {
      population: string;
      intervention: string;
      comparator: string;
      outcome: string;
      expanded: boolean;
    };
  }>;
  criteria: Array<{
    id: number;
    description: string;
  }>;
  analysisResults: {
    [documentId: number]: {
      [criterionId: number]: 'Yes' | 'No' | 'Uncertain';
    };
  };
}

const App: React.FC = () => {
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(() => {
    // Load saved queries from localStorage on initial render
    const saved = localStorage.getItem('savedQueries');
    return saved ? JSON.parse(saved) : [];
  });

  // Update localStorage whenever savedQueries changes
  useEffect(() => {
    localStorage.setItem('savedQueries', JSON.stringify(savedQueries));
  }, [savedQueries]);

  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    selectedQuery: null,
    documents: [],
    criteria: [],
    analysisResults: {}
  });

  const handleSaveQuery = (query: SavedQuery) => {
    setSavedQueries(prev => [...prev, query]);
  };

  const handleRemoveQuery = (queryId: string) => {
    setSavedQueries(prev => prev.filter(q => q.id !== queryId));
  };

  const handleClearAllQueries = () => {
    if (window.confirm('Are you sure you want to remove all saved queries?')) {
      setSavedQueries([]);
    }
  };

  const updateAnalysisData = (newData: Partial<AnalysisData>) => {
    setAnalysisData(prev => ({ ...prev, ...newData }));
  };

  const handleUpdateQuery = (updatedQuery: SavedQuery) => {
    setSavedQueries(prev => 
      prev.map(q => q.id === updatedQuery.id ? updatedQuery : q)
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b fixed w-full top-0 z-50 h-12"> {/* Added h-12 for fixed height */}
        <div className="container mx-auto h-full px-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-[#62B6CB] p-1.5 rotate-45 hover:bg-[#62B6CB]/80 transition-colors mr-3 rounded-lg"
            >
              <div className="-rotate-45">
                <FaHome className="w-4 h-4 text-black" />
              </div>
            </button>
            <h1 className="text-xl font-bold text-[#62B6CB]-700">Systematic Review AI Assistant</h1>
          </div>
          <img src={logo} alt="Logo" className="h-10 w-auto my-1" />
        </div>
      </header>
      <main className="pt-16"> {/* Add padding-top to account for fixed header */}
        <LandingPage
          savedQueries={savedQueries}
          onSaveQuery={handleSaveQuery}
          onRemoveQuery={handleRemoveQuery}
          onClearQueries={handleClearAllQueries}
          onUpdateQuery={handleUpdateQuery}
          analysisData={analysisData}
          updateAnalysisData={updateAnalysisData}
        />
      </main>
    </div>
  );
};

export default App;
