import React, { useState } from 'react';
import { FaSearch, FaExchangeAlt, FaFileAlt, FaProjectDiagram, FaArrowRight, FaChevronDown, FaChevronUp, FaFileAlt as FaFileAltIcon, FaUnlock } from 'react-icons/fa';
import QueryGenerator from './QueryGenerator';
import DuplicateAnalysis from './DuplicateAnalysis';
import DocumentAnalysis from './DocumentAnalysis';
import FilteringDiagram from './FilteringDiagram';
import { SavedQuery, AnalysisData } from '../App';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
  const [selectedQueryId, setSelectedQueryId] = useState<string>('');
  const [showComponent, setShowComponent] = useState(false);

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

  const handleNavigation = (component: string) => {
    setActiveComponent(component);
    if (component === 'query') {
      setShowQueryGenerator(false); // Reset to show description input
      setShowComponent(false);
    } else {
      setShowQueryGenerator(false);
      setShowComponent(false); // Reset component visibility
      setSelectedQueryId(''); // Reset selected query
    }
  };

  const handleQuerySelect = (queryId: string) => {
    setSelectedQueryId(queryId);
    setShowComponent(true);
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

    if (activeComponent !== 'query' && !showComponent) {
      return null;
    }

    switch (activeComponent) {
      case 'duplicate':
        return showComponent && <DuplicateAnalysis savedQueries={savedQueries} />;
      case 'document':
        return showComponent && <DocumentAnalysis analysisData={analysisData} updateAnalysisData={updateAnalysisData} savedQueries={savedQueries} />;
      case 'diagram':
        return showComponent && <FilteringDiagram />;
      default:
        return null;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleDescriptionSubmit();
    }
  };

  const renderQuerySelector = () => {
    if (activeComponent === 'query') {
      return (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-teal-700 mb-4">Describe your research</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={1}
            placeholder="Décrivez votre recherche en langage naturel"
          />
          <div className="flex justify-end">
            <button
              onClick={handleDescriptionSubmit}
              className="mt-4 px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
            >
              →
            </button>
          </div>
        </div>
      );
    } else if (savedQueries.length > 0) {
      return (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-teal-700 mb-4">Select a Query</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedQueryId}
              onChange={(e) => handleQuerySelect(e.target.value)}
              className="flex-1 px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select a query</option>
              {savedQueries.map(query => (
                <option key={query.id} value={query.id}>
                  {query.name}
                </option>
              ))}
            </select>
            {selectedQueryId && (
              <button
                onClick={() => setShowComponent(true)}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
              >
                →
              </button>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-center text-gray-600">No saved queries available. Create a new query first.</p>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!showQueryGenerator && !showComponent && (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-teal-700 mb-6">Que souhaitez-vous faire ?</h1>
            {renderQuerySelector()}
          </div>

          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => handleNavigation('query')}
              className={`flex-1 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center ${
                activeComponent === 'query' ? 'bg-teal-500 text-white' : 'bg-white'
              }`}
            >
              <FaSearch className="text-2xl mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Nouvelle query</h3>
            </button>

            <button
              onClick={() => handleNavigation('duplicate')}
              className={`flex-1 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center ${
                activeComponent === 'duplicate' ? 'bg-teal-500 text-white' : 'bg-white'
              }`}
            >
              <FaExchangeAlt className="text-2xl mx-auto mb-2" />
              <h3 className="text-lg font-semibold">Duplicate analysis</h3>
            </button>

            <button
              onClick={() => handleNavigation('document')}
              className={`flex-1 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center ${
                activeComponent === 'document' ? 'bg-teal-500 text-white' : 'bg-white'
              }`}
            >
              <FaFileAlt className="text-2xl mx-auto mb-2" />
              <h3 className="text-lg font-semibold">File screening</h3>
            </button>

            <button
              onClick={() => handleNavigation('diagram')}
              className={`flex-1 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center ${
                activeComponent === 'diagram' ? 'bg-teal-500 text-white' : 'bg-white'
              }`}
            >
              <FaProjectDiagram className="text-2xl mx-auto mb-2" />
              <h3 className="text-lg font-semibold">PRISM diagram</h3>
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
                        <div className="flex">
                          <div className="w-1/2 pr-4">
                            <p className="text-gray-600 mb-2">{query.description}</p>
                            <div className="bg-gray-100 p-3 rounded-md text-sm text-gray-700 overflow-x-auto mb-3">
                              <code className="whitespace-pre-wrap">{query.pubmedQuery}</code>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                              <span>{query.questions.length} questions</span>
                              <span>{Object.keys(query.answers).length} answers</span>
                            </div>
                          </div>
                          <div className="w-1/2 pl-4 border-l border-teal-200">
                            <h4 className="text-lg font-semibold mb-4 text-teal-700">Query Statistics</h4>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-teal-100 p-4 rounded-lg flex items-center">
                                <FaFileAlt className="text-teal-600 text-2xl mr-3" />
                                <div>
                                  <p className="text-sm text-teal-600">Total Papers</p>
                                  <p className="text-2xl font-bold text-teal-800">{query.paperCount}</p>
                                </div>
                              </div>
                              <div className="bg-teal-100 p-4 rounded-lg flex items-center">
                                <FaUnlock className="text-teal-600 text-2xl mr-3" />
                                <div>
                                  <p className="text-sm text-teal-600">Free Full Text</p>
                                  <p className="text-2xl font-bold text-teal-800">{query.freeFullTextCount}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-sm">
                              <div className="flex items-center">
                                <FaFileAlt className="mr-1" />
                                <span>{query.collectedDocuments.pubmed + query.collectedDocuments.semanticScholar} docs</span>
                              </div>
                              <div className="flex space-x-2">
                                <span className="bg-teal-600 text-white rounded-full px-2 py-1">
                                  PubMed: {query.collectedDocuments.pubmed}
                                </span>
                                <span className="bg-teal-600 text-white rounded-full px-2 py-1">
                                  Semantic Scholar: {query.collectedDocuments.semanticScholar}
                                </span>
                              </div>
                            </div>
                            <div className="mt-4" style={{ height: '200px' }}>
                              <Bar 
                                data={{
                                  labels: Object.keys(query.yearDistribution).sort(),
                                  datasets: [{
                                    label: 'Papers per Year',
                                    data: Object.values(query.yearDistribution),
                                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1,
                                  }]
                                }} 
                                options={{
                                  responsive: true,
                                  maintainAspectRatio: false,
                                  plugins: {
                                    legend: {
                                      display: false,
                                    },
                                    title: {
                                      display: true,
                                      text: 'Papers Distribution by Year',
                                    },
                                  },
                                }} 
                              />
                            </div>
                          </div>
                        </div>
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
