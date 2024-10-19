import React, { useState, useEffect } from 'react';
import { FaHeartbeat, FaSearch, FaFileAlt, FaProjectDiagram, FaExchangeAlt } from 'react-icons/fa';
import QueryGenerator from './components/QueryGenerator';
import DocumentAnalysis from './components/DocumentAnalysis';
import FilteringDiagram from './components/FilteringDiagram';
import DuplicateAnalysis from './components/DuplicateAnalysis';
import logo from './utils/Image1.png';

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
      <header className="bg-teal-600 shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <FaHeartbeat className="text-white text-3xl mr-4" />
            <h1 className="text-2xl font-semibold text-white">Systematic Literature Review Assistant</h1>
            </div>
            <img src={logo} alt="Logo" className="h-12 w-auto" />
            </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
              <li className="mr-2">
                <button
                  className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'query'
                      ? 'text-teal-600 border-teal-600'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('query')}
                >
                  <FaSearch className="mr-2" />
                  Query Generator
                </button>
              </li>
              <li className="mr-2">
                <button
                  className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'duplicate'
                      ? 'text-teal-600 border-teal-600'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('duplicate')}
                >
                  <FaExchangeAlt className="mr-2" />
                  Duplicate Analysis
                </button>
              </li>
              <li className="mr-2">
                <button
                  className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'analysis'
                      ? 'text-teal-600 border-teal-600'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('analysis')}
                >
                  <FaFileAlt className="mr-2" />
                  Document Screening
                </button>
              </li>
              <li className="mr-2">
                <button
                  className={`inline-flex items-center p-4 border-b-2 rounded-t-lg ${
                    activeTab === 'diagram'
                      ? 'text-teal-600 border-teal-600'
                      : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('diagram')}
                >
                  <FaProjectDiagram className="mr-2" />
                  PRISM Diagram
                </button>
              </li>
            </ul>
          </div>
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
          {activeTab === 'diagram' && <FilteringDiagram selectedQuery={analysisData.selectedQuery} />}
        </div>
      </main>
    </div>
  );
};

export default App;
