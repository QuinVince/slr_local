import React, { useState, useEffect } from 'react';
import SynonymList from './SynonymList';
import axios from 'axios';
import { FaSearch, FaArrowRight, FaCheck, FaList, FaDownload, FaFileAlt, FaTrash, FaUnlock } from 'react-icons/fa';
import { HiMiniArrowUturnLeft } from "react-icons/hi2";
import { SavedQuery } from '../App'; // Import the SavedQuery interface from App
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ProgressBar, Step } from "react-step-progress-bar";
import "react-step-progress-bar/styles.css";
import '../styles/progressBar.css';

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
  const [step, setStep] = useState(0);
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

  // Add these states at the beginning of the component
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [isGeneratingPubMed, setIsGeneratingPubMed] = useState(false);
  const [isGeneratingSynonyms, setIsGeneratingSynonyms] = useState(false);

  // Add this at the beginning of the component
  const steps = [
    { id: 0, name: 'New query' },
    { id: 1, name: 'Questions' },
    { id: 2, name: 'Pubmed query' },
    { id: 3, name: 'Saving' }
  ];

  const getProgressWidth = () => {
    switch(step) {
      case 0: return '27%';
      case 1: return '54%';
      case 2: return '81%';
      default: return '0%';
    }
  };

  const getStepStatus = (stepId: number) => {
    // Initial state (step 0): New query accomplished, Questions current
    if (step === 0) {
      if (stepId === 0) return 'accomplished';  // "New query" is accomplished
      if (stepId === 1) return 'current';       // "Questions" is current
      return '';                                // Other steps are default
    }
    
    // Step 1: New query and Questions accomplished, Pubmed query current
    if (step === 1) {
      if (stepId <= 1) return 'accomplished';   // First two steps accomplished
      if (stepId === 2) return 'current';       // Pubmed query is current
      return '';                                // Last step is default
    }
    
    // Step 2: All previous accomplished, Saving current
    if (step === 2) {
      if (stepId <= 2) return 'accomplished';   // First three steps accomplished
      if (stepId === 3) return 'current';       // Saving is current
      return '';
    }
    
    return '';  // Default state
  };

  useEffect(() => {
    if (initialData?.description) {
      setIsGeneratingQuestions(true);
      generateQuestions(initialData.description)
        .then(data => {
          setQuestions(data.questions);
          setAnswers(Object.fromEntries(data.questions.map((q: string) => [q, ''])));
        })
        .catch(error => {
          console.error('Error generating questions:', error);
        })
        .finally(() => {
          setIsGeneratingQuestions(false);
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
    try {
      if (step === 0) {
        setIsGeneratingPubMed(true);
        // First, generate PubMed query only
        const data = await generatePubMedQuery(naturalLanguageQuery, answers);
        const cleanedQuery = data.query.replace(/```/g, '').trim();
        setPubMedQuery(cleanedQuery);
        await estimateDocuments(cleanedQuery);
        setIsGeneratingPubMed(false);
        setStep(1);

        // After PubMed query is displayed, generate synonyms
        setTimeout(async () => {
          setIsGeneratingSynonyms(true);
          try {
            const synonymsResponse = await axios.post('http://localhost:8000/generate_synonyms', {
              description: naturalLanguageQuery,
              questions: questions,
              answers: answers,
              query: cleanedQuery,
            });
            if (Array.isArray(synonymsResponse.data.synonym_groups)) {
              setSynonymGroups(synonymsResponse.data.synonym_groups);
            }
          } catch (error) {
            console.error('Error generating initial synonyms:', error);
            setSynonymGroups([]);
          } finally {
            setIsGeneratingSynonyms(false);
          }
        }, 100); // Small delay to ensure query is displayed first
      } else if (step === 1 && isCollected) {
        setStep(2);
      }
    } catch (error) {
      console.error('Error in step transition:', error);
      setIsGeneratingPubMed(false);
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
    setStep(0);
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

  // Replace the existing handleReturn function with this one
  const handleReturn = () => {
    switch (step) {
      case 0: // At questions step
      case 1: // At pubmed query step
        // Return to landing page
        onSaveQuery(null as any);
        break;
      case 2: // At save step
        // Return to pubmed query step
        setStep(1);
        break;
      default:
        break;
    }
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

  // Add this handler in QueryGenerator
  const handleConceptSelect = (index: number) => {
    setSelectedConceptIndex(index);
  };

  const renderStep = () => {
    switch (step) {
      case 0:  // Changed from case 1
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#62B6CB]">Generated Questions</h2>
            {isGeneratingQuestions ? (
              <div className="text-center py-4 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-[#62B6CB]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p>Generating questions...</p>
              </div>
            ) : (
              <>
                {questions.map((question, index) => (
                  <div key={index} className="mb-4">
                    <p className="font-semibold">{question}</p>
                    <input
                      type="text"
                      value={answers[question] || ''}
                      onChange={(e) => handleAnswerChange(question, e.target.value)}
                      onKeyPress={(e) => handleAnswerKeyPress(e, index === questions.length - 1)}
                      className="w-full px-3 py-2 border border-[#BDBDBD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2 flex items-center justify-center"
                      placeholder="Your answer..."
                    />
                  </div>
                ))}
                <button
                  onClick={handleNextStep}
                  className="mt-4 px-4 py-2 bg-[#62B6CB] text-white rounded-md hover:bg-[#62B6CB] focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2 flex items-center justify-center"
                  disabled={isGeneratingPubMed}
                >
                  {isGeneratingPubMed ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating PubMed Query...
                    </>
                  ) : (
                    <>
                      Generate PubMed Query <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        );
      case 1:  // Changed from case 2
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-8 text-black text-center">Generated PubMed Query</h2>
            {isGeneratingPubMed ? (
              <div className="text-center py-4 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-[#62B6CB]" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p>Generating PubMed query...</p>
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="w-full">
                  <textarea
                    value={pubMedQuery}
                    onChange={(e) => setPubMedQuery(e.target.value)}
                    className="text-base w-full px-3 py-2 border border-[#BDBDBD] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2 flex items-center justify-center"
                    rows={5}
                    placeholder="Generated PubMed query..."
                  />
                  {estimatedDocuments !== null && (
                    <p className="mt-2 text-[#62B6CB]">
                      Estimated number of documents: <span className="font-bold">{estimatedDocuments}</span>
                    </p>
                  )}
                </div>
                {isGeneratingSynonyms ? (
                  <div className="text-center py-4 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-[#62B6CB]" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p>Generating synonyms...</p>
                  </div>
                ) : (
                  <div className="w-full">
                    <SynonymList 
                      synonymGroups={synonymGroups} 
                      selectedConceptIndex={selectedConceptIndex}
                      onSynonymClick={handleSynonymClick}
                      onConceptSelect={handleConceptSelect}
                      onGetSynonyms={handleGetSynonyms}  // Add this line
                      isSynonymsLoading={isSynonymsLoading}
                    />
                  </div>
                )}
                
                <div className="mt-4">
                  <button
                    onClick={handleCollectDocuments}
                    className={`w-full px-4 py-2 ${isCollected ? 'bg-[#62B6CB]' : 'bg-[#62B6CB]'} text-white rounded-md hover:bg-[#62B6CB] focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2 flex items-center justify-center`}
                    disabled={isCollecting || isCollected}
                  >
                    {isCollecting ? 'Collecting...' : isCollected ? 'Documents Collected' : 'Collect Documents'}
                    <FaDownload className="ml-2" />
                  </button>

                  {isCollecting && (
                    <div className="mt-4">
                      <p className="text-[#62B6CB]">
                        Collecting documents: {collectedDocuments.pubmed + collectedDocuments.semanticScholar} / {totalDocuments}
                      </p>
                      <div className="w-full bg-[#BDBDBD] rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-[#62B6CB] h-2.5 rounded-full transition-all duration-200" 
                          style={{ width: `${((collectedDocuments.pubmed + collectedDocuments.semanticScholar) / totalDocuments) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {isCollected && (
                    <div className="mt-4">
                      <p className="text-[#62B6CB] text-center">
                        Collection complete! {totalDocuments} documents collected
                      </p>
                      <button
                        onClick={() => setStep(2)}
                        className="mt-4 w-full px-4 py-2 bg-[#62B6CB] text-white rounded-md hover:bg-[#62B6CB] focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2 flex items-center justify-center"
                      >
                        Save Query <FaArrowRight className="ml-2" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case 2:  // Changed from case 3
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-black">Save Query</h2>
            <input
              type="text"
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              onKeyPress={handleQueryNameKeyPress}
              className="w-full px-3 py-2 border border-[#BDBDBD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2 flex items-center justify-center"
              placeholder="Enter query name"
            />
            <button
              onClick={handleSaveQuery}
              className="mt-4 px-4 py-2 bg-[#62B6CB] text-white rounded-md hover:bg-[#62B6CB] focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2 flex items-center justify-center"
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
    <div className="p-4">
      {/* Return button moved to top-right */}
      <div className="flex justify-start mb-6 pl-20">
        <button
          onClick={handleReturn}
          className="text-[#62B6CB] hover:text-[#62B6CB] p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Return"
        >
          <HiMiniArrowUturnLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Progress bar container with centered alignment and reduced width */}
      <div className="flex justify-center mb-8">
        <div className="w-2/3"> {/* Set width to half */}
          <div className="progress-container">
            <div className="progress-line"></div>
            <div 
              className="progress-line-fill"
              style={{ width: getProgressWidth() }}
            ></div>
            <div className="steps-container">
            <div className="flex justify-between w-full relative">
              {steps.map((stepItem) => (
                <div key={stepItem.id} className="step-wrapper">
                  <div 
                    className={`step ${getStepStatus(stepItem.id)}`}
                  >
                    {getStepStatus(stepItem.id) === 'accomplished' && (
                      <svg className="checkmark" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className={`step-label ${
                    getStepStatus(stepItem.id) === 'current' 
                      ? 'font-bold text-[#62B6CB]' 
                      : 'text-gray-400'
                  }`}>
                    {stepItem.name}
                  </span>
                </div>
              
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update case 0 in renderStep */}
      {step === 0 && (
        <div className="max-w-2xl mx-auto mt-8"> {/* Added max width and center alignment */}
          <h2 className="text-2xl font-semibold text-center text-black mb-2">
            Please answer the following questions
          </h2>
          <p className="text-[#BDBDBD]  text-center mb-8">
            This step will help to generate a relevant PubMed query
          </p>

          {isGeneratingQuestions ? (
            <div className="text-center py-4 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-[#62B6CB]" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p>Generating questions...</p>
            </div>
          ) : (
            <>
              {questions.map((question, index) => (
                <div key={index} className="mb-6"> {/* Increased margin between questions */}
                  <p className="font-semibold text-center mb-2">{question}</p>
                  <input
                    type="text"
                    value={answers[question] || ''}
                    onChange={(e) => handleAnswerChange(question, e.target.value)}
                    onKeyPress={(e) => handleAnswerKeyPress(e, index === questions.length - 1)}
                    className="w-full px-4 py-3 border border-[#BDBDBD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2 flex items-center justify-center"
                    placeholder="Your answer..."
                  />
                </div>
              ))}
              <div className="flex justify-center"> {/* Center the button */}
                <button
                  onClick={handleNextStep}
                  className="px-6 py-3 bg-[#62B6CB] text-white rounded-md hover:bg-[#62B6CB] focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2 flex items-center justify-center"
                  disabled={isGeneratingPubMed}
                >
                  {isGeneratingPubMed ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating PubMed Query...
                    </>
                  ) : (
                    <>
                      Generate PubMed Query <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
      {step !== 0 && renderStep()}
    </div>
  );
};

export default QueryGenerator;
