import React, { useState, useCallback, useEffect } from 'react';
import { FaFolder, FaCheck, FaTimes, FaQuestion, FaInfoCircle, FaMagic, FaTrash, FaFilter, FaFileAlt, FaUsers, FaCalendarAlt, FaArrowRight, FaCheckDouble, FaDownload, FaQuoteLeft } from 'react-icons/fa';
import ReactSlider from 'react-slider';
import styled from 'styled-components';
import { SavedQuery, AnalysisData } from '../App'; // Import SavedQuery from App.tsx
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import { mockDocuments } from '../mockData';
import  CriteriaExample  from './CriteriaExample';

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
  studyType: 'Meta-analysis' | 'Systematic Review' | 'RCT' | 'Cohort study' | 'Case-control study' | 'Case report' | 'Case series' | 'Expert opinion' | 'Narrative review' | 'Animal study' | 'In vitro study';
  pico: {
    population: string;
    intervention: string;
    comparator: string;
    outcome: string;
    expanded: boolean;
  };
  citationCount: number; // Add this line
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
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#E3F9FD] text-black">
      {type === 'rct' ? 'RCT' : type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const AuthorsTag: React.FC<{ authors: string[] }> = ({ authors }) => {
  const displayAuthors = authors.length > 2 ? `${authors[0]} et al.` : authors.join(', ');
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#EDFAF1] text-black">
      <FaUsers className="mr-1" />
      {displayAuthors}
    </span>
  );
};

const YearTag: React.FC<{ date: string }> = ({ date }) => {
  const year = new Date(date).getFullYear();
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#F4EDFC] text-black">
      <FaCalendarAlt className="mr-1" />
      {year}
    </span>
  );
};

const CRITERIA_EXAMPLES = [
  "Select only RCTs, SLRs, meta-analysis",
  "Select papers that consider the use of Ocrelizumab to treat multiple sclerosis",
  "Select papers that mention side effects or adverse events",
  "Select papers with a minimum sample size of 100 patients"
];

// Add these styled components after the existing styled components
const ScrollableContainer = styled.div`
  overflow-y: auto;
  max-height: calc(100vh - 240px); // Increased height to extend to bottom
  padding-right: 8px; // Add padding to prevent content overlap with scrollbar
  margin-right: -8px; // Compensate for padding

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-track {
    background: #F5F5F5;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #C2E2EB;
    border-radius: 10px;
    border: 2px solid #F5F5F5;
    
    &:hover {
      background: #62B6CB;
    }
  }

  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: #C2E2EB #F5F5F5;
`;

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
  const [showTooltip, setShowTooltip] = useState(true);

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

    const totalPapers = analysisData.selectedQuery.paperCount;
    const deduplicatedPapers = Math.floor(totalPapers * 0.9); // Assume 10% are duplicates

    // Use a deterministic method to generate a percentage between 5% and 30%
    const seed = parseInt(analysisData.selectedQuery.id, 10);
    const percentage = (((seed * 1234567) % 2500) / 10000) + 0.05; // Results in 0.05 to 0.30
    const hundredPercentMatch = Math.floor(deduplicatedPapers * percentage);
    const reductionPercentage = Math.round((1 - (hundredPercentMatch / deduplicatedPapers)) * 100);

    return {
      totalPapers,
      deduplicatedPapers,
      hundredPercentMatch,
      reductionPercentage
    };
  }, [analysisData.selectedQuery]);

  const handleTooltipClick = (docId: number, criterionId: number) => {
    if (activeTooltip && activeTooltip.docId === docId && activeTooltip.criterionId === criterionId) {
      setActiveTooltip(null);
    } else {
      setActiveTooltip({ docId, criterionId });
    }
  };

  // Add new handler for Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newCriterion.trim()) {
      handleAddCriterion();
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Panel */}
      
      <div className="w-1/3 p-6 border-r border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-black">Abstract screening</h1>
        {/* Query Selector */}
        <div className="relative h-[70px]">
          <select
            className="w-full h-[50px] pl-10 pr-8 py-2 border border-[#BDBDBD] rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-[#62B6CB] appearance-none border-b-4 
              font-bold bg-white hover:bg-gray-50 transition-colors duration-200
              cursor-pointer shadow-sm hover:shadow-md"
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
          <div className="absolute top-4 left-3">
              <FaFolder className="text-[#62B6CB]" />
            </div>
            <div className="absolute top-4 right-3">
              <svg className="w-4 h-4 text-[#62B6CB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
        </div>
        {/* Tooltip */}
        {showTooltip && (
          <div className="mb-6 rounded-md ">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-700">Criteria definition:</h3>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-[#62B6CB] text-sm underline hover:text-gray-500"
              >
                Hide
              </button>
            </div>
            <p className="text-sm text-gray-600">
              We encourage you to use natural language instead of keywords.
              Example: "I want to select publications that mention one specific thing"
              This allows the tool to provide more relevant results.
            </p>
          </div>
        )}

        {/* Modified Criteria Input - removed button */}
        <div className="mb-6">
          <div className="w-full rounded-2xl border-4 border-[#C2E2EB]">
            <input
              type="text"
              value={newCriterion}
              onChange={(e) => setNewCriterion(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-3 py-2 rounded-xl border-2 border-[#62B6CB] shadow focus:outline-none focus:ring-2"
              placeholder="Enter new criterion in natural language... (press Enter to add)"
            />
          </div>
        </div>

        {/* Criteria Examples */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700 mb-3">Example criteria:</h3>
          {CRITERIA_EXAMPLES.map((example, index) => (
            <CriteriaExample
              key={index}
              example={example}
              onSelect={(example) => {
                setNewCriterion(example);
                handleAddCriterion();
              }}
            />
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-2/3 p-6 flex flex-col h-full"> {/* Added flex and h-full */}
        {/* Active Criteria */}
        {analysisData.criteria.length > 0 && (
          <div className="flex-shrink-0 mb-6">
            <h3 className="font-semibold text-gray-700 mb-4">Active Criteria:</h3>
            <div className="space-y-2 mb-4">
              {analysisData.criteria.map((criterion) => (
                <div key={criterion.id} className="flex items-center justify-between gap-4 p-2 rounded-md">
                  <span className="p-3 border border-[#62B6CB] rounded-md hover:bg-[#C2E2EB] text-left w-full transition-colors group">
                    Criteria {criterion.id}: {criterion.description}
                  </span>
                  <button
                    onClick={() => handleRemoveCriterion(criterion.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            {/* Analyze Corpus button moved here */}
            <button
              onClick={handleAnalyzeDocuments}
              disabled={isAnalyzing}
              className="w-full bg-[#62B6CB] text-white px-4 py-2 rounded-md hover:bg-[#62B6CB] disabled:bg-gray-300 flex items-center justify-center"
            >
              <FaMagic className="mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Corpus'}
            </button>
          </div>
        )}

        {/* Filters and Export */}
        {analysisData.selectedQuery && (
          <div className="flex-shrink-0 mb-4"> {/* Added flex-shrink-0 */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white text-black px-3 py-1 rounded-md border border-[#D6D6D6] border-b-4 hover:bg-gray-50 flex items-center"
                >
                  <FaFilter className="mr-2" />
                  Filters
                </button>
                {analysisCompleted && (
                  <button
                    onClick={() => setShowOnlyFullMatch(!showOnlyFullMatch)}
                    className={`px-3 py-1 rounded-md flex items-center ${
                      showOnlyFullMatch ? 'bg-[#62B6CB] text-white' : 'bg-white text-[#62B6CB] border border-[#62B6CB]'
                    }`}
                  >
                    <FaCheckDouble className="mr-2" />
                    Show 100% match only
                  </button>
                )}
              </div>
              <button
                onClick={handleExport}
                className="bg-[#62B6CB] text-white px-3 py-1 rounded-md hover:bg-[#62B6CB] flex items-center"
              >
                <FaDownload className="mr-2" />
                Export
              </button>
            </div>
          </div>
        )}
        {/* Documents Section Title */}
        <h1 className="font-semibold text-black mb-3">Documents</h1>

        {/* Analysis Results Section - only shown after analysis is completed */}
        {analysisCompleted && (
          <div className="mb-6 bg-[#F0F9FB] border border-[#C2E2EB] rounded-lg p-4 flex-shrink-0">
            <h3 className="text-lg font-semibold text-[#62B6CB] mb-3 text-center">Analysis Results</h3>
            {(() => {
              const results = calculateAnalysisResults();
              if (!results) return null;

              return (
                <div className="flex justify-between items-center mb-4 relative">
                  <div className="w-[35%] bg-white p-3 rounded-md shadow-sm border border-[#E3F9FD] flex flex-col items-center">
                    <p className="text-sm text-gray-600 text-center">Documents Analyzed</p>
                    <p className="text-2xl font-bold text-[#62B6CB] text-center">{results.deduplicatedPapers}</p>
                  </div>
                  <div className="w-[30%] flex flex-col justify-center items-center">
                    <div className="bg-white p-2 rounded-full border border-[#62B6CB] relative group mb-2">
                      <FaArrowRight className="text-xl text-[#62B6CB]" />
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                        {results.reductionPercentage}% removed
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      {results.reductionPercentage}% less abstracts to read
                    </p>
                  </div>
                  <div className="w-[35%] bg-white p-3 rounded-md shadow-sm border border-[#E3F9FD] flex flex-col items-center">
                    <p className="text-sm text-gray-600 text-center">100% Criteria Matches</p>
                    <p className="text-2xl font-bold text-[#62B6CB] text-center">
                      {results.hundredPercentMatch}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Filters Popup */}
        {showFilters && (
          <div className="flex-shrink-0 mb-4"> {/* Added flex-shrink-0 */}
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
                    <option value="Meta-analysis">Meta-analysis</option>
                    <option value="Systematic Review">Systematic Review</option>
                    <option value="RCT">RCT</option>
                    <option value="Cohort study">Cohort study</option>
                    <option value="Case-control study">Case-control study</option>
                    <option value="Case report">Case report</option>
                    <option value="Case series">Case series</option>
                    <option value="Expert opinion">Expert opinion</option>
                    <option value="Narrative review">Narrative review</option>
                    <option value="Animal study">Animal study</option>
                    <option value="In vitro study">In vitro study</option>
              </select>
            </div>
          </div>
        )}

        {/* Documents List - Now wrapped in ScrollableContainer */}
        <ScrollableContainer className="flex-grow">
          {filteredDocuments.map(doc => (
            <div key={doc.id} className="border p-4 mb-4 rounded-2xl border-b-4 ">
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
                      className="font-semibold cursor-pointer hover:text-[#62B6CB] transition-colors duration-200"
                      onClick={() => togglePICO(doc.id)}
                    >
                      {doc.title}
                    </h4>
                  </div>
                  
                  <div className="text-sm mb-2 text-gray-500">
                    <p>
                      {doc.abstractExpanded 
                        ? doc.abstract 
                        : `${doc.abstract.slice(0, 80).trim()}${doc.abstract.length > 80 ? '...' : ''}`}
                    </p>
                    {doc.abstract.length > 80 && (
                      <button 
                        className="text-[#62B6CB] cursor-pointer mt-2"
                        onClick={() => toggleAbstract(doc.id)}
                      >
                        {doc.abstractExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                  
                  {doc.pico.expanded && (
                    <div className="mt-2 bg-white p-3 rounded border border-[#62B6CB] ">
                      <h5 className="font-semibold mb-2">PICO Information</h5>
                      <ul className="list-disc pl-5">
                        <li><strong>Population:</strong> {doc.pico.population}</li>
                        <li><strong>Intervention:</strong> {doc.pico.intervention}</li>
                        <li><strong>Comparator:</strong> {doc.pico.comparator}</li>
                        <li><strong>Outcome:</strong> {doc.pico.outcome}</li>
                      </ul>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-4 text-xs text-gray-500">
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
                          {analysisData.analysisResults[doc.id][criterion.id] === 'Yes' && <FaCheck className="text-[#62B6CB]" />}
                          {analysisData.analysisResults[doc.id][criterion.id] === 'No' && <FaTimes className="text-red-500" />}
                          {analysisData.analysisResults[doc.id][criterion.id] === 'Uncertain' && <FaQuestion className="text-orange-500" />}
                          <div className="relative inline-block ml-2">
                            <button
                              className="text-[#62B6CB] hover:text-[#62B6CB] focus:outline-none"
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
                        ? 'bg-[#62B6CB] text-white'
                        : 'bg-white text-[#62B6CB] border border-[#62B6CB]'
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
        </ScrollableContainer>
      </div>
    </div>
  );
};

export default DocumentAnalysis;
