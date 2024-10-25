import React, { useState, useEffect } from 'react';
import { FaHeartbeat, FaSearch, FaFileAlt, FaProjectDiagram, FaExchangeAlt } from 'react-icons/fa';
import QueryGenerator from './components/QueryGenerator';
import DocumentAnalysis from './components/DocumentAnalysis';
import FilteringDiagram from './components/FilteringDiagram';
import DuplicateAnalysis from './components/DuplicateAnalysis';
import LandingPage from './components/LandingPage';

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
    studyType: 'rct' | 'observational' | 'meta-analysis' | 'other';
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
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    selectedQuery: null,
    documents: [],
    criteria: [],
    analysisResults: {}
  });

  const handleSaveQuery = (query: SavedQuery) => {
    setSavedQueries([...savedQueries, query]);
  };

  const updateAnalysisData = (newData: Partial<AnalysisData>) => {
    setAnalysisData(prev => ({ ...prev, ...newData }));
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b fixed w-full top-0 z-50 h-12"> {/* Added h-12 for fixed height */}
        <div className="container mx-auto h-full px-4 flex items-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-teal-600 hover:text-teal-700 p-1 rounded-full hover:bg-teal-50 transition-colors mr-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-teal-700">Q-SLR</h1>
        </div>
      </header>
      <main className="pt-16"> {/* Add padding-top to account for fixed header */}
        <LandingPage
          savedQueries={savedQueries}
          onSaveQuery={handleSaveQuery}
          analysisData={analysisData}
          updateAnalysisData={updateAnalysisData}
        />
      </main>
    </div>
  );
};

export default App;
