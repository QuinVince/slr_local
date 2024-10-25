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
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState(initialData?.description || '');
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

  useEffect(() => {
    if (initialData?.description) {
      setIsLoading(true);
      generateQuestions(initialData.description)
        .then(data => {
          setQuestions(data.questions);
          setAnswers(Object.fromEntries(data.questions.map((q: string) => [q, ''])));
        })
        .catch(error => {
          console.error('Error generating questions:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
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
    try {
      if (step === 1) {
        // Generate PubMed query based on answers
        const data = await generatePubMedQuery(naturalLanguageQuery, answers);
        const cleanedQuery = data.query.replace(/```/g, '').trim();
        setPubMedQuery(cleanedQuery);
        await estimateDocuments(cleanedQuery);
        setSynonymGroups([]); // Clear synonyms when generating a new PubMed query
        setStep(2); // Move to step 2
      } else if (step === 2 && isCollected) {
        setStep(3); // Move to step 3 only if documents are collected
      }
    } catch (error) {
      console.error('Error in step transition:', error);
    } finally {
      setIsLoading(false);
    }
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

  // Add this new function to handle return to landing page
  const handleReturn = () => {
    setStep(1);
    setQueryName('');
    // Keep the initial description from initialData
    setNaturalLanguageQuery(initialData?.description || '');
    setPubMedQuery('');
    setQuestions([]);
    setAnswers({});
    setCollectedDocuments({ pubmed: 0, semanticScholar: 0 });
    setIsCollected(false);
    // Call the parent component to return to landing page
    onSaveQuery(null as any);
  };

  // Add these functions to handle Enter key press in answers and query name
  const handleAnswerKeyPress = (e: React.KeyboardEvent, isLast: boolean) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isLast) {
        handleNextStep();
      }
    }
  };

  const handleQueryNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveQuery();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-teal-700">Generated Questions</h2>
            {isLoading ? (
              <div className="text-center py-4">
                <p>Generating PubMed query...</p>
              </div>
            ) : (
              <>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Your Research Description:</h3>
                  <p className="text-gray-600">{naturalLanguageQuery}</p>
                </div>
                {questions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">{question}</p>
                    <input
                      type="text"
                      value={answers[question] || ''}
                      onChange={(e) => handleAnswerChange(question, e.target.value)}
                      onKeyPress={(e) => handleAnswerKeyPress(e, index === questions.length - 1)}
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
                  Generate PubMed Query <FaArrowRight className="ml-2" />
                </button>
              </>
            )}
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-teal-700">PubMed Query and Synonyms</h2>
            <div className="flex flex-col gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">Generated PubMed Query</label>
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
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Available Synonyms</label>
                  <button
                    onClick={handleGetSynonyms}
                    className="px-3 py-1 text-sm bg-teal-100 text-teal-700 rounded-md hover:bg-teal-200"
                    disabled={isSynonymsLoading}
                  >
                    {isSynonymsLoading ? 'Loading...' : 'Refresh Synonyms'}
                  </button>
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
            
            <div className="mt-6">
              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center"
              >
                Save Query <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-teal-700">Save Query</h2>
            <input
              type="text"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              onKeyPress={handleQueryNameKeyPress}
              className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter query name"
            />
            <button
              onClick={handleSaveQuery}
              className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center"
            >
              Save Query <FaCheck className="ml-2" />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handleReturn}
          className="px-4 py-2 text-teal-600 border border-teal-600 rounded-md hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          ← Return
        </button>
        <h1 className="text-2xl font-bold text-teal-700 flex items-center">
          <FaSearch className="mr-2" /> Query Generator
        </h1>
        <div className="w-24"></div> {/* This empty div helps center the title */}
      </div>
      {renderStep()}
    </div>
  );
};

export default QueryGenerator;
