import React, { useState, useEffect } from 'react';
import SynonymList from './SynonymList';
import axios from 'axios';
import { FaSearch, FaArrowRight, FaCheck, FaList, FaDownload, FaFileAlt, FaTrash, FaUnlock } from 'react-icons/fa';
import { SavedQuery } from '../App'; // Import the SavedQuery interface from App
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface QueryGeneratorProps {
  initialData?: any;
  onSaveQuery: (query: SavedQuery) => void;
  savedQueries: SavedQuery[]; // Use the savedQueries prop
  onClearQueries: () => void; // Add this new prop
}

interface CollectedDocuments {
  pubmed: number;
  semanticScholar: number;
}

// Add this type definition
interface SynonymGroup {
  concept: string;
  abstraction: string;
  synonyms: string[];
}

const QueryGenerator: React.FC<QueryGeneratorProps> = ({ initialData, onSaveQuery, savedQueries, onClearQueries }) => {
  const [step, setStep] = useState(1);
  const [queryName, setQueryName] = useState('');
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('');
  const [pubMedQuery, setPubMedQuery] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const [estimatedDocuments, setEstimatedDocuments] = useState<number | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [collectedDocuments, setCollectedDocuments] = useState<CollectedDocuments>({ pubmed: 0, semanticScholar: 0 });
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [currentQuery, setCurrentQuery] = useState<SavedQuery | null>(null);
  const [synonymGroups, setSynonymGroups] = useState<SynonymGroup[]>([]);
  const [isSynonymsLoading, setIsSynonymsLoading] = useState(false);
  const [selectedConceptIndex, setSelectedConceptIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (initialData) {
      // Initialize state with initialData if provided
      setQueryName(initialData.name || '');
      setNaturalLanguageQuery(initialData.description || '');
      setPubMedQuery(initialData.pubmedQuery || '');
      setQuestions(initialData.questions || []);
      setAnswers(initialData.answers || {});
    }
  }, [initialData]);

  const generateQuestions = async (query: string) => {
    const response = await axios.post('http://localhost:8000/generate_questions', { query });
    return response.data;
  };

  const generatePubMedQuery = async (query: string, answers: Record<string, string>) => {
    const response = await axios.post('http://localhost:8000/generate_pubmed_query', { query, answers });
    return response.data;
  };

  const estimateDocuments = async (query: string) => {
    try {
      const response = await axios.post('http://localhost:8000/estimate_documents', { query });
      setEstimatedDocuments(response.data.estimatedDocuments);
    } catch (error) {
      console.error('Error estimating documents:', error);
      setEstimatedDocuments(null);
    }
  };

  const handleCollectDocuments = async () => {
    setIsCollecting(true);
    try {
      // Mock total number of documents to be collected
      const mockTotalDocuments = Math.floor(Math.random() * 1000) + 500; // Random number between 500 and 1500
      setTotalDocuments(mockTotalDocuments);

      // Simulate document collection process with increased speed
      for (let i = 0; i <= mockTotalDocuments; i += 25) {
        const pubmedDocs = Math.floor(i * 0.6); // 60% from PubMed
        const semanticScholarDocs = i - pubmedDocs; // Remaining from Semantic Scholar
        setCollectedDocuments({ pubmed: pubmedDocs, semanticScholar: semanticScholarDocs });
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      setIsCollected(true);
    } catch (error) {
      console.error('Error collecting documents:', error);
    } finally {
      setIsCollecting(false);
    }
  };

  const handleNextStep = async () => {
    setIsLoading(true);
    if (step === 2) {
      try {
        const data = await generateQuestions(naturalLanguageQuery);
        setQuestions(data.questions);
        setAnswers(Object.fromEntries(data.questions.map((q: string) => [q, ''])));
        setStep(step + 1);
      } catch (error) {
        console.error('Error generating questions:', error);
        alert('An error occurred while generating questions. Please try again later.');
      }
    } else if (step === 3) {
      try {
        const data = await generatePubMedQuery(naturalLanguageQuery, answers);
        const cleanedQuery = data.query.replace(/```/g, '').trim();
        setPubMedQuery(cleanedQuery);
        await estimateDocuments(cleanedQuery);
        setSynonymGroups([]); // Clear synonyms when generating a new PubMed query
        setStep(step + 1);
      } catch (error) {
        console.error('Error generating PubMed query:', error);
        if (axios.isAxiosError(error) && error.response) {
          alert(`An error occurred: ${error.response.data.error || 'Unknown error'}`);
        } else {
          alert('An error occurred while generating the PubMed query. Please try again later.');
        }
      }
    } else {
      setStep(step + 1);
    }
    setIsLoading(false);
  };

  const handleSaveQuery = () => {
    const currentYear = new Date().getFullYear();
    const mockYearDistribution: Record<number, number> = {};
    
    // Generate mock data for the last 10 years
    for (let year = currentYear - 9; year <= currentYear; year++) {
      mockYearDistribution[year] = Math.floor(Math.random() * 100);
    }

    const newQuery: SavedQuery = {
      id: Date.now().toString(),
      name: queryName,
      description: naturalLanguageQuery,
      questions: questions,
      answers: answers,
      pubmedQuery: pubMedQuery,
      collectedDocuments: {
        pubmed: collectedDocuments.pubmed,
        semanticScholar: collectedDocuments.semanticScholar
      },
      paperCount: totalDocuments,
      freeFullTextCount: Math.floor(totalDocuments * 0.4), // Assume 40% are free full text
      yearDistribution: mockYearDistribution
    };
    onSaveQuery(newQuery);
    setCurrentQuery(newQuery);
    // Reset form
    setStep(1);
    setQueryName('');
    setNaturalLanguageQuery('');
    setPubMedQuery('');
    setQuestions([]);
    setAnswers({});
    setCollectedDocuments({ pubmed: 0, semanticScholar: 0 });
    setIsCollected(false);
  };

  const handleAnswerChange = (question: string, answer: string) => {
    setAnswers({ ...answers, [question]: answer });
  };

  const handleGetSynonyms = async () => {
    setIsSynonymsLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/generate_synonyms', {
        description: naturalLanguageQuery,
        questions: questions,
        answers: answers,
        query: pubMedQuery,
      });
      if (Array.isArray(response.data.synonym_groups)) {
        setSynonymGroups(response.data.synonym_groups);
      } else {
        console.error('Unexpected synonyms format:', response.data);
        setSynonymGroups([]);
      }
    } catch (error) {
      console.error('Error generating synonyms:', error);
      setSynonymGroups([]);
    } finally {
      setIsSynonymsLoading(false);
    }
  };

  const handleSynonymClick = (synonym: string) => {
    setPubMedQuery(prevQuery => prevQuery + ' OR ' + synonym);
  };

  const handleRetry = () => {
    setRetryCount(retryCount + 1);
    handleNextStep();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-teal-700">Step 1: Choose a query name</h2>
            <input
              type="text"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter query name"
            />
            <button
              onClick={handleNextStep}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center"
            >
              Next <FaArrowRight className="ml-2" />
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-teal-700">Step 2: Describe your request in natural language</h2>
            <textarea
              value={naturalLanguageQuery}
              onChange={(e) => setNaturalLanguageQuery(e.target.value)}
              className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={4}
              placeholder="Describe your research question..."
            />
            <p className="mt-2 text-sm text-gray-600 italic">
            Example: Publications addressing the use of ocrelizumab in combination therapy for the treatment of multiple sclerosis
            </p>
            <button
              onClick={handleNextStep}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Next'} <FaArrowRight className="ml-2" />
            </button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-teal-700">Step 3: Answer follow-up questions</h2>
            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">{question}</p>
                <input
                  type="text"
                  value={answers[question] || ''}
                  onChange={(e) => handleAnswerChange(question, e.target.value)}
                  className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Your answer..."
                />
              </div>
            ))}
            <button
              onClick={handleNextStep}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Next'} <FaArrowRight className="ml-2" />
            </button>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-teal-700">Step 4: PubMed Query</h2>
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <textarea
                  value={pubMedQuery}
                  onChange={(e) => setPubMedQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={5}
                  placeholder="Generated PubMed query..."
                />
                {estimatedDocuments !== null && (
                  <p className="mt-2 text-teal-700">
                    Estimated number of documents: <span className="font-bold">{estimatedDocuments}</span>
                  </p>
                )}
              </div>
              <div className="w-full">
                <div className="flex mb-2 border-b border-teal-200 overflow-x-auto">
                  {synonymGroups.map((group, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedConceptIndex(index)}
                      className={`px-4 py-2 whitespace-nowrap ${
                        selectedConceptIndex === index
                          ? 'bg-teal-100 text-teal-700 border-b-2 border-teal-500'
                          : 'text-teal-600 hover:bg-teal-50'
                      }`}
                    >
                      {group.abstraction}
                    </button>
                  ))}
                </div>
                <SynonymList 
                  synonymGroups={synonymGroups} 
                  selectedConceptIndex={selectedConceptIndex}
                  onSynonymClick={handleSynonymClick} 
                  onGetSynonyms={handleGetSynonyms}
                  isSynonymsLoading={isSynonymsLoading}
                />
              </div>
            </div>
            
            <div className="mt-4 flex space-x-4">
              <button
                onClick={handleCollectDocuments}
                className={`px-4 py-2 ${isCollected ? 'bg-teal-700' : 'bg-teal-500'} text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center`}
                disabled={isCollecting || isCollected}
              >
                {isCollecting ? 'Collecting...' : isCollected ? 'Collected' : 'Collect Documents'}
                <FaDownload className="ml-2" />
              </button>
              
              <button
                onClick={handleSaveQuery}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center"
              >
                Save Query <FaCheck className="ml-2" />
              </button>
            </div>

            {isCollecting && (
              <div className="mt-4">
                <p className="text-teal-700">
                  Collecting documents: {collectedDocuments.pubmed + collectedDocuments.semanticScholar} / {totalDocuments}
                </p>
                <div className="w-full bg-teal-200 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-teal-600 h-2.5 rounded-full" 
                    style={{ width: `${((collectedDocuments.pubmed + collectedDocuments.semanticScholar) / totalDocuments) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {isCollected && (
              <p className="mt-4 text-teal-700">
                Collection complete! {totalDocuments} documents collected.
              </p>
            )}
          </div>
        );
      default:
        return <div className="text-teal-700 font-semibold">Query generation complete!</div>;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-teal-700 flex items-center">
        <FaSearch className="mr-2" /> Query Generator
      </h1>
      {renderStep()}
      
      {savedQueries.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-teal-700 flex items-center">
              <FaList className="mr-2" /> Saved Queries
            </h2>
            <button
              onClick={onClearQueries}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
            >
              <FaTrash className="mr-2" /> Clear All Queries
            </button>
          </div>
          <div className="space-y-6">
            {savedQueries.map((query) => (
              <div key={query.id} className="bg-white border border-teal-200 rounded-lg shadow-md overflow-hidden">
                <div className="bg-teal-500 text-white px-4 py-2">
                  <h3 className="font-semibold text-lg">{query.name}</h3>
                </div>
                <div className="p-4 flex">
                  <div className="w-1/2 pr-4">
                    <h4 className="font-semibold text-teal-700 mb-2">Description:</h4>
                    <p className="text-gray-600 mb-4">{query.description}</p>
                    <h4 className="font-semibold text-teal-700 mb-2">PubMed Query:</h4>
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueryGenerator;
