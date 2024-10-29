import React, { useState } from 'react';
import { FaSearch, FaExchangeAlt, FaFileAlt, FaArrowRight, FaChevronDown, FaChevronUp, FaFileAlt as FaFileAltIcon, FaUnlock, FaTrash } from 'react-icons/fa';
import {FaDiagramNext} from "react-icons/fa6"
import { PiStackPlusFill } from "react-icons/pi";
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
  onRemoveQuery: (queryId: string) => void;
  onClearQueries: () => void;
  onUpdateQuery: (query: SavedQuery) => void;
  analysisData: AnalysisData;
  updateAnalysisData: (newData: Partial<AnalysisData>) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ savedQueries, onSaveQuery, onRemoveQuery, onClearQueries, onUpdateQuery, analysisData, updateAnalysisData }) => {
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
      setShowQueryGenerator(false);
    } else {
      // For other components, directly show them
      setShowComponent(true);
    }
  };

  const handleQuerySelect = (queryId: string) => {
    setSelectedQueryId(queryId);
    setShowComponent(true);
  };

  const handleReturn = () => {
    setShowComponent(false);
    setActiveComponent('query');
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
        return showComponent && (
          <DuplicateAnalysis 
            savedQueries={savedQueries} 
            onReturn={handleReturn}
            onUpdateQuery={onUpdateQuery}
          />
        );
      case 'document':
        return showComponent && (
          <DocumentAnalysis 
            analysisData={analysisData}
            updateAnalysisData={updateAnalysisData}
            savedQueries={savedQueries}
          />
        );
      case 'diagram':
        return showComponent && (
          <FilteringDiagram 
            savedQueries={savedQueries}
          />
        );
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
  return (
    <div className="w-4/5 p-6container mx-auto px-6 pt-16">
      {!showQueryGenerator && !showComponent && (
        <>
          <h2 className="text-center text-black text-2xl font-bold mb-10">
            Que souhaitez-vous faire ?
          </h2>

          {activeComponent === 'query' && (
            <div className="flex items-center relative mb-8">
              <div className="w-full rounded-2xl border-4 border-[#C2E2EB]">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full h-14 rounded-xl  border-2 border-[#62B6CB] shadow text-lg pl-5 pr-16 flex items-center"
                  placeholder="Décrivez votre recherche en langage naturel"
                  style={{paddingTop: '14px'}} 
                />
              </div>
              <button
                onClick={handleDescriptionSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#C2E2EB] rounded-full flex items-center justify-center"
              >
                <FaArrowRight className="w-5 h-5 text-[#62B6CB]" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
            <button
              onClick={() => handleNavigation('query')}
              className={`h-20 w-11/12 mx-auto rounded-2xl text-base font-bold flex items-center justify-center ${
                activeComponent === 'query'
                  ? 'bg-[#62B6CB] text-white hover:opacity-90'
                  : 'border border-[#BDBDBD] text-black hover:bg-[#C2E2EB]'
              }`}
            >
              <PiStackPlusFill className="w-6 h-6 mr-4" />
              Nouvelle query
            </button>

            <button
              onClick={() => handleNavigation('duplicate')}
              className={`h-20 w-11/12 mx-auto rounded-2xl text-base font-bold flex items-center justify-center ${
                activeComponent === 'duplicate'
                  ? 'bg-[#62B6CB] text-white hover:opacity-90'
                  : 'border border-[#BDBDBD] text-black hover:bg-[#C2E2EB]'
              }`}
            >
              <FaExchangeAlt className="w-6 h-6 mr-4" />
              Duplicate analysis
            </button>

            <button
              onClick={() => handleNavigation('document')}
              className={`h-20 w-11/12 mx-auto rounded-2xl text-base font-bold flex items-center justify-center ${
                activeComponent === 'document'
                  ? 'bg-[#62B6CB] text-white hover:opacity-90'
                  : 'border border-[#BDBDBD] text-black hover:bg-[#C2E2EB]'
              }`}
            >
              <FaFileAlt className="w-6 h-6 mr-4" />
              File screening
            </button>

            <button
              onClick={() => handleNavigation('diagram')}
              className={`h-20 w-11/12 mx-auto rounded-2xl text-base font-bold flex items-center justify-center ${
                activeComponent === 'diagram'
                  ? 'bg-[#62B6CB] text-white hover:opacity-90'
                  : 'border border-[#BDBDBD] text-black hover:bg-[#C2E2EB]'
              }`}
            >
              <FaDiagramNext className="w-6 h-6 mr-4" />
              PRISM diagram
            </button>
          </div>

          {savedQueries.length > 0 && (
            <div className="bg-white rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-black">Saved Queries</h2>
                <button
                  onClick={onClearQueries}
                  className="px-3 py-1 text-red-600 border-2 border-red-600 rounded-xl hover:bg-red-50 flex items-center"
                >
                  <FaTrash className="mr-2" />
                  Clear All
                </button>
              </div>
              <div className="space-y-4">
                {savedQueries.map((query) => (
                  <div key={query.id} className="border-2 border-[#D6D6D6] rounded-xl">
                    <div className="flex justify-between items-center px-4 py-3 hover:bg-[#C2E2EB] rounded-xl">
                      <button
                        onClick={() => toggleQueryExpansion(query.id)}
                        className="flex-1 flex justify-between items-center"
                      >
                        <span className="font-bold text-black">{query.name}</span>
                        {expandedQuery === query.id ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      <button
                        onClick={() => onRemoveQuery(query.id)}
                        className="ml-4 text-red-600 hover:text-red-700 p-1 rounded-full hover:bg-red-50 "
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {expandedQuery === query.id && (
                      <div className="p-4 border-t">
                        <div className="flex">
                          <div className="w-1/2 pr-4">
                          <h4 className="text-lg font-semibold mb-4 text-black">Query description</h4>
                            <p className="text-gray-600 mb-2 font-semibold pb-4">{query.description}</p>
                            <h4 className="text-lg font-semibold mb-4 text-black">PubMed Query</h4>
                            <div className="bg p-3 rounded-md border border-[#62B6CB] border-b-4 text-sm text-gray-700 overflow-x-auto mb-3">
                              <code className="whitespace-pre-wrap">{query.pubmedQuery}</code>
                            </div>

                          </div>
                          <div className="w-1/2 pl-4 border-l border-[#62B6CB]">
                            <h4 className="text-lg font-semibold mb-4 text-black">Query Statistics</h4>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="bg-[#D5F7FF] p-4 rounded-lg flex items-center">
                                <FaFileAlt className="text-[#296A7A] text-2xl mr-3" />
                                <div>
                                  <p className="text-sm text-[#296A7A]">Total Papers</p>
                                  <p className="text-2xl font-bold text-[#296A7A]">{query.paperCount}</p>
                                </div>
                              </div>
                              <div className="bg-[#D5F7FF] p-4 rounded-lg flex items-center">
                                <FaUnlock className="text-[#296A7A] text-2xl mr-3" />
                                <div>
                                  <p className="text-sm text-[#296A7A]">Free Full Text</p>
                                  <p className="text-2xl font-bold text-[#296A7A]">{query.freeFullTextCount}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-sm">
                              <div className="flex items-center">
                              </div>
                              <div className="flex space-x-2">
                                <span className="bg-[#D5F7FF] text-[#296A7A] rounded-xl px-2 py-1 font-bold">
                                  PubMed: {query.collectedDocuments.pubmed}
                                </span>
                                <span className="bg-[#D5F7FF] text-[#296A7A] rounded-xl px-2 py-1 font-bold">
                                  Semantic Scholar: {query.collectedDocuments.semanticScholar}
                                </span>
                                {query.collectedDocuments.removedDuplicates !== undefined && (
                                  <span className="bg-[#D7ECD4] text-[#408038] rounded-xl px-2 py-1 font-bold">
                                    Removed Duplicates: {query.collectedDocuments.removedDuplicates}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="mt-4" style={{ height: '200px' }}>
                              <Bar 
                                data={{
                                  labels: Object.keys(query.yearDistribution).sort(),
                                  datasets: [{
                                    label: 'Papers per Year',
                                    data: Object.values(query.yearDistribution),
                                    backgroundColor: '#296A7A',
                                    borderColor: '#296A7A',
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
