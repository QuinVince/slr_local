import React, { useState } from 'react';
import { FaSearch, FaExchangeAlt, FaFileAlt, FaProjectDiagram, FaArrowRight, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import QueryGenerator from './QueryGenerator';
import DuplicateAnalysis from './DuplicateAnalysis';
import DocumentAnalysis from './DocumentAnalysis';
import FilteringDiagram from './FilteringDiagram';
import { SavedQuery, AnalysisData } from '../App';

interface LandingPageProps {
  savedQueries: SavedQuery[];
  onSaveQuery: (query: SavedQuery) => void;
  analysisData: AnalysisData;
  updateAnalysisData: (newData: Partial<AnalysisData>) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ savedQueries, onSaveQuery, analysisData, updateAnalysisData }) => {
  const [activeComponent, setActiveComponent] = useState<string>('query');
  const [description, setDescription] = useState('');
  const [showQueryGenerator, setShowQueryGenerator] = useState(false);
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null);

  const handleDescriptionSubmit = () => {
    if (description.trim()) {
      setShowQueryGenerator(true);
    }
  };

  const handleQuerySaved = (query: SavedQuery | null) => {
    if (query === null) {
      // Handle return to landing page
      setShowQueryGenerator(false);
      setDescription('');
    } else {
      // Handle normal query save
      onSaveQuery(query);
      setShowQueryGenerator(false);
      setDescription('');
    }
  };

  const toggleQueryExpansion = (queryId: string) => {
    setExpandedQuery(expandedQuery === queryId ? null : queryId);
  };

  const renderComponent = () => {
    if (showQueryGenerator) {
      return (
        <QueryGenerator
          initialData={{ description }}
          onSaveQuery={handleQuerySaved}
          savedQueries={savedQueries}
          onClearQueries={() => {}}
        />
      );
    }

    switch (activeComponent) {
      case 'duplicate':
        return <DuplicateAnalysis savedQueries={savedQueries} />;
      case 'document':
        return <DocumentAnalysis analysisData={analysisData} updateAnalysisData={updateAnalysisData} savedQueries={savedQueries} />;
      case 'diagram':
        return <FilteringDiagram />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!showQueryGenerator && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-teal-700 mb-6">Systematic Literature Review Assistant</h1>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-teal-700 mb-4">Describe your research</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows={4}
                placeholder="Describe your research question..."
              />
              <button
                onClick={handleDescriptionSubmit}
                className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center"
              >
                Start Query Generation <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setActiveComponent('duplicate')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <FaExchangeAlt className="text-3xl text-teal-500 mb-2" />
              <h3 className="text-lg font-semibold text-teal-700">Duplicate Analysis</h3>
              <p className="text-sm text-gray-600">Identify and manage duplicate papers</p>
            </button>

            <button
              onClick={() => setActiveComponent('document')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <FaFileAlt className="text-3xl text-teal-500 mb-2" />
              <h3 className="text-lg font-semibold text-teal-700">Document Analysis</h3>
              <p className="text-sm text-gray-600">Analyze and screen papers</p>
            </button>

            <button
              onClick={() => setActiveComponent('diagram')}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <FaProjectDiagram className="text-3xl text-teal-500 mb-2" />
              <h3 className="text-lg font-semibold text-teal-700">PRISMA Diagram</h3>
              <p className="text-sm text-gray-600">Generate PRISMA flow diagram</p>
            </button>
          </div>

          {savedQueries.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-teal-700 mb-4">Saved Queries</h2>
              <div className="space-y-4">
                {savedQueries.map((query) => (
                  <div key={query.id} className="border rounded-lg">
                    <button
                      onClick={() => toggleQueryExpansion(query.id)}
                      className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50"
                    >
                      <span className="font-medium text-teal-700">{query.name}</span>
                      {expandedQuery === query.id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {expandedQuery === query.id && (
                      <div className="p-4 border-t">
                        <p className="text-gray-600 mb-2">{query.description}</p>
                        <div className="bg-gray-50 p-3 rounded mb-3">
                          <code className="text-sm">{query.pubmedQuery}</code>
                        </div>
                        {/* Include your existing charts and stats here */}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {renderComponent()}
    </div>
  );
};

export default LandingPage;
