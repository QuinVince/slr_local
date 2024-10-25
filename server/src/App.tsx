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
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-teal-700">SLR Assistant</h1>
        </div>
      </header>
      <LandingPage
        savedQueries={savedQueries}
        onSaveQuery={handleSaveQuery}
        analysisData={analysisData}
        updateAnalysisData={updateAnalysisData}
      />
    </div>
  );
};

export default App;
