import React, { useState, useEffect } from 'react';
import { FaHeartbeat, FaSearch, FaFileAlt, FaProjectDiagram, FaExchangeAlt } from 'react-icons/fa';
import QueryGenerator from './components/QueryGenerator';
import DocumentAnalysis from './components/DocumentAnalysis';
import FilteringDiagram from './components/FilteringDiagram';
import DuplicateAnalysis from './components/DuplicateAnalysis';

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
    authors: string[]; // Add this line
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
  const [activeTab, setActiveTab] = useState('query');
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    selectedQuery: null,
    documents: [],
    criteria: [],
    analysisResults: {},
  });

  // Load saved queries from localStorage on component mount
  useEffect(() => {
    const storedQueries = localStorage.getItem('savedQueries');
    if (storedQueries) {
      setSavedQueries(JSON.parse(storedQueries));
    }
  }, []);

  const handleSaveQuery = (query: SavedQuery) => {
    const updatedQueries = [...savedQueries, query];
    setSavedQueries(updatedQueries);
    // Save to localStorage
    localStorage.setItem('savedQueries', JSON.stringify(updatedQueries));
  };

  const handleClearQueries = () => {
    localStorage.removeItem('savedQueries');
    setSavedQueries([]);
  };

  const updateAnalysisData = (newData: Partial<AnalysisData>) => {
    setAnalysisData(prevData => ({ ...prevData, ...newData }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <FaHeartbeat className="text-teal-600 text-3xl mr-4" />
            <h1 className="text-2xl font-semibold text-gray-800">SLR Assistant</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'query'
                      ? 'bg-teal-100 text-teal-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('query')}
                >
                  <FaSearch className="inline mr-2" />
                  Query Generator
                </button>
              </li>
              <li>
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'duplicate'
                      ? 'bg-teal-100 text-teal-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('duplicate')}
                >
                  <FaExchangeAlt className="inline mr-2" />
                  Duplicate Analysis
                </button>
              </li>
              <li>
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'analysis'
                      ? 'bg-teal-100 text-teal-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('analysis')}
                >
                  <FaFileAlt className="inline mr-2" />
                  Document Screening
                </button>
              </li>
              <li>
                <button
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'diagram'
                      ? 'bg-teal-100 text-teal-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('diagram')}
                >
                  <FaProjectDiagram className="inline mr-2" />
                  PRISM Diagram
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {activeTab === 'query' && (
            <QueryGenerator
              initialData={null}
              onSaveQuery={handleSaveQuery}
              savedQueries={savedQueries}
              onClearQueries={handleClearQueries}
            />
          )}
          {activeTab === 'duplicate' && (
            <DuplicateAnalysis savedQueries={savedQueries} />
          )}
          {activeTab === 'analysis' && (
            <DocumentAnalysis
              analysisData={analysisData}
              updateAnalysisData={updateAnalysisData}
              savedQueries={savedQueries}
            />
          )}
          {activeTab === 'diagram' && <FilteringDiagram />}
        </div>
      </main>
    </div>
  );
};

export default App;
