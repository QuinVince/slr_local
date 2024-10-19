import React, { useState, useCallback, useEffect } from 'react';
import { FaPlus, FaCheck, FaTimes, FaQuestion, FaInfoCircle, FaMagic, FaTrash, FaFilter, FaFileAlt, FaUsers, FaCalendarAlt, FaArrowRight, FaCheckDouble, FaDownload } from 'react-icons/fa';
import ReactSlider from 'react-slider';
import styled from 'styled-components';
import { SavedQuery, AnalysisData } from '../App'; // Import SavedQuery from App.tsx
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import { mockDocuments } from '../mockData';
import { generateAnalysisData } from '../utils/generateAnalysisData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Add this line at the beginning of the file, right after the imports
export interface Document {
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
}

interface Criterion {
  id: number;
  description: string;
}

interface DocumentAnalysisProps {
  analysisData: AnalysisData;
  updateAnalysisData: (newAnalysisData: Partial<AnalysisData>) => void;
  savedQueries: SavedQuery[];
}

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 20px;
`;

const StyledThumb = styled.div`
  height: 24px;
  width: 10px;
  background-color: white;
  border: 2px solid #0d9488;
  border-radius: 10px;
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: none;
  top: 10%;
  transform: translate(0, -50%);
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.3);
  }
`;

const StyledTrack = styled.div<{ index: number }>`
  top: 0;
  bottom: 0;
  background: ${props => props.index === 1 ? '#0d9488' : '#ddd'};
  border-radius: 999px;
  height: 4px;
`;

const Thumb = (props: any, state: any) => <StyledThumb {...props} />;
const Track = (props: any, state: any) => <StyledTrack {...props} index={state.index} />;

const StudyTypeTag: React.FC<{ type: string }> = ({ type }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
      {type === 'rct' ? 'RCT' : type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const AuthorsTag: React.FC<{ authors: string[] }> = ({ authors }) => {
  const displayAuthors = authors.length > 2 ? `${authors[0]} et al.` : authors.join(', ');
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
      <FaUsers className="mr-1" />
      {displayAuthors}
    </span>
  );
};

const YearTag: React.FC<{ date: string }> = ({ date }) => {
  const year = new Date(date).getFullYear();
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
      <FaCalendarAlt className="mr-1" />
      {year}
    </span>
  );
};

const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({ analysisData, updateAnalysisData, savedQueries }) => {
  const [newCriterion, setNewCriterion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [tooltips, setTooltips] = useState<{[key: number]: {[key: number]: string}}>({});
  const [dateRange, setDateRange] = useState([new Date('2023-01-01').getTime(), new Date().getTime()]);
  const [showFilters, setShowFilters] = useState(false);
  const [studyType, setStudyType] = useState('all');
  const [analyzedDocuments, setAnalyzedDocuments] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [includedDocuments, setIncludedDocuments] = useState<number[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<SavedQuery | null>(null);
  const [selectedPresetCriteria, setSelectedPresetCriteria] = useState('');
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<{ docId: number; criterionId: number } | null>(null);
  const [showOnlyFullMatch, setShowOnlyFullMatch] = useState(false);

  useEffect(() => {
    if (selectedQuery && selectedQuery !== analysisData.selectedQuery) {
      updateAnalysisData({ selectedQuery });
    }
  }, [selectedQuery, analysisData.selectedQuery, updateAnalysisData]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const query = savedQueries.find(q => q.id === event.target.value) || null;
    if (query) {
      handleQuerySelect(query);
    }
  };

  const handleQuerySelect = (query: SavedQuery) => {
    console.log('Query selected:', query);
    setSelectedQuery(query);
    
    
    
    console.log('Updated analysis data:', { selectedQuery: query, documents: mockDocuments });
    updateAnalysisData({ selectedQuery: query, documents: mockDocuments });
  };

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      updateAnalysisData({
        criteria: [
          ...analysisData.criteria,
          { id: analysisData.criteria.length + 1, description: newCriterion.trim() }
        ]
      });
      setNewCriterion('');
    }
  };

  const handleRemoveCriterion = (id: number) => {
    updateAnalysisData({
      criteria: analysisData.criteria.filter(criterion => criterion.id !== id)
    });
  };

  const handleDocumentSelect = (id: number) => {
    updateAnalysisData({
      documents: analysisData.documents.map(doc => 
        doc.id === id ? { ...doc, selected: !doc.selected } : doc
      )
    });
  };

  const handleAnalyzeDocuments = () => {
    setIsAnalyzing(true);
    // Simulate analysis process
    setTimeout(() => {
      const mockResults: {[key: number]: {[key: number]: 'Yes' | 'No' | 'Uncertain'}} = {};
      const mockTooltips: {[key: number]: {[key: number]: string}} = {};
      analysisData.documents.forEach(doc => {
        if (doc.selected) {
          mockResults[doc.id] = {};
          mockTooltips[doc.id] = {};
          analysisData.criteria.forEach(criterion => {
            const randomValue = Math.random();
            let result: 'Yes' | 'No' | 'Uncertain';
            if (randomValue < 0.7) {
              result = 'Yes';
            } else if (randomValue < 0.85) {
              result = 'No';
            } else {
              result = 'Uncertain';
            }
            mockResults[doc.id][criterion.id] = result;
            let tooltip = '';
            switch(result) {
              case 'Yes':
                tooltip = `Strong evidence found supporting this criterion. Key points: ${['Statistically significant results', 'Large sample size', 'Well-designed methodology'][Math.floor(Math.random() * 3)]}`;
                break;
              case 'No':
                tooltip = `Evidence does not support this criterion. Reasons include: ${['Conflicting results', 'Small effect size', 'Potential bias in study design'][Math.floor(Math.random() * 3)]}`;
                break;
              case 'Uncertain':
                tooltip = `More information needed. ${['Limited data available', 'Inconsistent findings across studies', 'Potential confounding factors not addressed'][Math.floor(Math.random() * 3)]}`;
                break;
            }
            mockTooltips[doc.id][criterion.id] = `Justification for Criteria ${criterion.id}: ${tooltip}`;
          });
        }
      });
      updateAnalysisData({ analysisResults: mockResults });
      setTooltips(mockTooltips);
      setIsAnalyzing(false);
      setAnalysisCompleted(true);
      setAnalyzedDocuments(analysisData.documents.filter(doc => doc.selected).map(doc => doc.id));
    }, 3000);
  };

  const handleDateRangeChange = useCallback((newValues: number[]) => {
    setDateRange(newValues);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toISOString().split('T')[0];
  };


  const isDocumentFullMatch = (docId: number) => {
    if (!analysisData.analysisResults[docId]) return false;
    return Object.values(analysisData.analysisResults[docId]).every(result => result === 'Yes');
  };

  const handleExport = () => {
    // Implement export functionality here
    console.log("Exporting analysis results...");
  };

  const filteredDocuments = analysisData.documents.filter(doc => {
    const docDate = new Date(doc.date).getTime();
    const matchesFilters = (
      docDate >= dateRange[0] && docDate <= dateRange[1] &&
      (!filterKeyword || doc.title.toLowerCase().includes(filterKeyword.toLowerCase()) || doc.abstract.toLowerCase().includes(filterKeyword.toLowerCase())) &&
      (studyType === 'all' || doc.studyType === studyType)
    );
    return matchesFilters && (!showOnlyFullMatch || isDocumentFullMatch(doc.id));
  });

  const toggleAbstract = (id: number) => {
    updateAnalysisData({
      documents: analysisData.documents.map(doc => 
        doc.id === id ? { ...doc, abstractExpanded: !doc.abstractExpanded } : doc
      )
    });
  };

  const togglePICO = (id: number) => {
    updateAnalysisData({
      documents: analysisData.documents.map(doc => 
        doc.id === id ? { ...doc, pico: { ...doc.pico, expanded: !doc.pico.expanded } } : doc
      )
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    updateAnalysisData({
      documents: analysisData.documents.map(doc => ({ ...doc, selected: !selectAll }))
    });
  };

  const handleIncludeDocument = (id: number) => {
    setIncludedDocuments(prev => 
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    );
  };

  const handlePresetCriteriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCriteria = e.target.value;
    setSelectedPresetCriteria(selectedCriteria);

    if (selectedCriteria) {
      updateAnalysisData({
        criteria: [
          ...analysisData.criteria,
          { id: analysisData.criteria.length + 1, description: selectedCriteria }
        ]
      });
    }
  };

  const calculateAnalysisResults = useCallback(() => {
    if (!analysisData.selectedQuery) return null;

    const generatedData = generateAnalysisData(analysisData.selectedQuery);

    return {
      totalPapers: generatedData.totalVolume,
      deduplicatedPapers: generatedData.postDeduplication,
      hundredPercentMatch: generatedData.hundredPercentMatch,
      reductionPercentage: Math.round((1 - (generatedData.hundredPercentMatch / generatedData.postDeduplication)) * 100)
    };
  }, [analysisData.selectedQuery]);

  const handleTooltipClick = (docId: number, criterionId: number) => {
    if (activeTooltip && activeTooltip.docId === docId && activeTooltip.criterionId === criterionId) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip({ docId, criterionId });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-6 text-teal-700">
        <FaFileAlt className="mr-2 inline-block" /> Document Analysis
      </h3>
      <div className="mb-6">
        <label htmlFor="querySelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select a Query
        </label>
        <select
          id="querySelect"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          onChange={handleQueryChange}
          value={analysisData.selectedQuery?.id || ''}
        >
          <option value="">Select a query</option>
          {savedQueries.map((query) => (
            <option key={query.id} value={query.id}>
              {query.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-4">
        {/* Criteria definition box */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">Criteria definition</h2>
          <div className="mb-4">
            <input
              type="text"
              value={newCriterion}
              onChange={(e) => setNewCriterion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter new criterion"
            />
            <button
              onClick={handleAddCriterion}
              className="mt-2 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors duration-200 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Criterion
            </button>
          </div>
          <div className="mb-4">
            <select
              value={selectedPresetCriteria}
              onChange={handlePresetCriteriaChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Criteria examples</option>
              <option value="Select only RCTs, SLRs, meta-analysis">Select only RCTs, SLRs, meta-analysis</option>
              <option value="Select papers that consider the use of Ocrelizumab to treat multiple sclerosis">Select papers that consider the use of Ocrelizumab to treat multiple sclerosis</option>
            </select>
          </div>
        </div>

        {/* Newly created criteria list */}
        <div className="w-1/2">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">Created Criteria</h2>
          <div>
            {analysisData.criteria.map((criterion) => (
              <div key={criterion.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-2">
                <span className="text-sm font-medium text-teal-700">Criteria {criterion.id}: {criterion.description}</span>
                <button
                  onClick={() => handleRemoveCriterion(criterion.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {analysisData.selectedQuery && (
        <>
          <div className="mb-4 mt-8">
            <button
              onClick={handleAnalyzeDocuments}
              disabled={isAnalyzing || analysisData.criteria.length === 0 || analysisData.documents.filter(d => d.selected).length === 0}
              className="w-full bg-teal-500 text-white p-2 rounded-md hover:bg-teal-600 disabled:bg-gray-300 flex items-center justify-center"
            >
              <FaMagic className="mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Documents with AI'}
            </button>

            {isAnalyzing && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div className="bg-teal-600 h-2.5 rounded-full" style={{width: '45%'}}></div>
              </div>
            )}
          </div>
          {/* Analysis Results Section - only shown after analysis is completed */}
          {analysisCompleted && (
            <div className="mb-6 bg-teal-50 border border-teal-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-teal-700 mb-3 text-center">Analysis Results</h3>
              {(() => {
                const results = calculateAnalysisResults();
                if (!results) return null;

                return (
                  <div className="flex justify-between items-center mb-4 relative">
                    <div className="w-[35%] bg-white p-3 rounded-md shadow flex flex-col items-center">
                      <p className="text-sm text-gray-600 text-center">Documents Analyzed</p>
                      <p className="text-2xl font-bold text-teal-600 text-center">{results.deduplicatedPapers}</p>
                    </div>
                    <div className="w-[30%] flex flex-col justify-center items-center">
                      <div className="bg-white p-2 rounded-full border border-teal-500 relative group mb-2">
                        <FaArrowRight className="text-xl text-teal-500" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                          {results.reductionPercentage}% removed
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 text-center">
                        {results.reductionPercentage}% less abstracts to read
                      </p>
                    </div>
                    <div className="w-[35%] bg-white p-3 rounded-md shadow flex flex-col items-center">
                      <p className="text-sm text-gray-600 text-center">100% Criteria Matches</p>
                      <p className="text-2xl font-bold text-green-600 text-center">
                        {results.hundredPercentMatch}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Documents Section - shown as soon as a query is selected */}
          <div className="mb-4 border p-4 rounded-md relative">
            <h3 className="text-lg font-semibold text-teal-700 mb-2">Documents</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <label className="flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="mr-2"
                  />
                  <span className="text-sm">Select All</span>
                </label>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-teal-500 text-white px-3 py-1 rounded-md hover:bg-teal-600 flex items-center text-sm mr-2"
                >
                  <FaFilter className="mr-2" />
                  Filters
                </button>
                {analysisCompleted && (
                  <button
                    onClick={() => setShowOnlyFullMatch(!showOnlyFullMatch)}
                    className={`px-3 py-1 rounded-md flex items-center text-sm ${
                      showOnlyFullMatch ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'
                    }`}
                  >
                    <FaCheckDouble className="mr-2" />
                    Show 100% match only
                  </button>
                )}
              </div>
              <button
                onClick={handleExport}
                className="bg-teal-500 text-white px-3 py-1 rounded-md hover:bg-teal-600 flex items-center text-sm"
              >
                <FaDownload className="mr-2" />
                Export
              </button>
            </div>

            {showFilters && (
              <div className="absolute left-0 top-24 w-80 mb-4 p-4 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keyword</label>
                  <input
                    type="text"
                    value={filterKeyword}
                    onChange={(e) => setFilterKeyword(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                    placeholder="Search keyword"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="px-2">
                    <StyledSlider
                      value={dateRange}
                      onChange={(newValues: number | readonly number[], index: number) => handleDateRangeChange(newValues as number[])}
                      min={new Date('2023-01-01').getTime()}
                      max={new Date().getTime()}
                      renderTrack={Track}
                      renderThumb={Thumb}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{formatDate(dateRange[0])}</span>
                    <span>{formatDate(dateRange[1])}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Study Type</label>
                  <select
                    value={studyType}
                    onChange={(e) => setStudyType(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md w-full"
                  >
                    <option value="all">All Types</option>
                    <option value="rct">Randomized Controlled Trial</option>
                    <option value="observational">Observational Study</option>
                    <option value="meta-analysis">Meta-Analysis</option>
                  </select>
                </div>
              </div>
            )}

            {filteredDocuments.map(doc => (
              <div key={doc.id} className="border p-4 mb-4 rounded-md">
                <div className="flex">
                  <div className="w-1/12 flex items-start justify-center pt-1">
                    <input
                      type="checkbox"
                      checked={doc.selected}
                      onChange={() => handleDocumentSelect(doc.id)}
                    />
                  </div>
                  <div className="w-8/12 pr-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 
                        className="font-semibold cursor-pointer hover:text-teal-500 transition-colors duration-200"
                        onClick={() => togglePICO(doc.id)}
                      >
                        {doc.title}
                      </h4>
                    </div>
                    
                    <div className="text-sm mb-2">
                      <p>
                        {doc.abstractExpanded 
                          ? doc.abstract 
                          : `${doc.abstract.slice(0, 80).trim()}${doc.abstract.length > 80 ? '...' : ''}`}
                      </p>
                      {doc.abstract.length > 80 && (
                        <button 
                          className="text-teal-500 cursor-pointer mt-2"
                          onClick={() => toggleAbstract(doc.id)}
                        >
                          {doc.abstractExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                    
                    {doc.pico.expanded && (
                      <div className="mt-2 bg-gray-100 p-3 rounded">
                        <h5 className="font-semibold mb-2">PICO Information</h5>
                        <ul className="list-disc pl-5">
                          <li><strong>Population:</strong> {doc.pico.population}</li>
                          <li><strong>Intervention:</strong> {doc.pico.intervention}</li>
                          <li><strong>Comparator:</strong> {doc.pico.comparator}</li>
                          <li><strong>Outcome:</strong> {doc.pico.outcome}</li>
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <YearTag date={doc.date} />
                      <StudyTypeTag type={doc.studyType} />
                      <AuthorsTag authors={doc.authors} />
                    </div>
                  </div>

                  <div className="w-3/12 border-l pl-4">
                    <h5 className="font-semibold mb-2">Criteria Selection</h5>
                    {analysisCompleted && analyzedDocuments.includes(doc.id) && analysisData.analysisResults[doc.id] && (
                      <>
                        {analysisData.criteria.map(criterion => (
                          <div key={criterion.id} className="flex items-center mb-1 relative">
                            <span className="mr-2">Criteria {criterion.id}:</span>
                            {analysisData.analysisResults[doc.id][criterion.id] === 'Yes' && <FaCheck className="text-green-500" />}
                            {analysisData.analysisResults[doc.id][criterion.id] === 'No' && <FaTimes className="text-red-500" />}
                            {analysisData.analysisResults[doc.id][criterion.id] === 'Uncertain' && <FaQuestion className="text-orange-500" />}
                            <div className="relative inline-block ml-2">
                              <button
                                className="text-teal-500 hover:text-teal-700 focus:outline-none"
                                onClick={() => handleTooltipClick(doc.id, criterion.id)}
                              >
                                <FaInfoCircle />
                              </button>
                              {activeTooltip && 
                               activeTooltip.docId === doc.id && 
                               activeTooltip.criterionId === criterion.id && (
                                <div className="absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 w-48">
                                  {tooltips[doc.id] && tooltips[doc.id][criterion.id]}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                    {(!analysisCompleted || !analyzedDocuments.includes(doc.id)) && (
                      <p className="text-sm text-gray-500">Select this document and click "Analyze" to see criteria fulfillment.</p>
                    )}
                    <button
                      onClick={() => handleIncludeDocument(doc.id)}
                      className={`mt-4 px-3 py-1 rounded-full flex items-center justify-center transition-colors duration-200 ${
                        includedDocuments.includes(doc.id)
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-green-500 border border-green-500'
                      }`}
                    >
                      {includedDocuments.includes(doc.id) ? (
                        <>
                          <FaCheck className="mr-1" /> Added
                        </>
                      ) : (
                        <>
                          <FaFileAlt className="mr-1" /> Include in review
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentAnalysis;