import React, { useState, useEffect } from 'react';
import { FaSearch, FaExchangeAlt, FaFileAlt, FaTimes, FaToggleOn, FaToggleOff, FaChevronDown, FaTrash } from 'react-icons/fa';
import { SavedQuery } from '../App';
import { mockDuplicatePairs } from '../mockData';
import { generateAnalysisData } from '../utils/generateAnalysisData';

interface DuplicateAnalysisProps {
  savedQueries: SavedQuery[];
}

export interface DuplicatePair {
  id: number;
  article1: {
    title: string;
    abstract: string;
  };
  article2: {
    title: string;
    abstract: string;
  };
  proximityScore: number;
}

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  pair: DuplicatePair | null;
}> = ({ isOpen, onClose, pair }) => {
  if (!isOpen || !pair) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-teal-700">Abstract Comparison</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">{pair.article1.title}</h4>
            <p className="text-sm">{pair.article1.abstract}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">{pair.article2.title}</h4>
            <p className="text-sm">{pair.article2.abstract}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DuplicateAnalysis: React.FC<DuplicateAnalysisProps> = ({ savedQueries }) => {
  const [selectedQuery, setSelectedQuery] = useState<SavedQuery | null>(null);
  const [duplicatePairs, setDuplicatePairs] = useState<DuplicatePair[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState<DuplicatePair | null>(null);
  const [selectedPairs, setSelectedPairs] = useState<Set<number>>(new Set());
  const [displayedPairs, setDisplayedPairs] = useState(5);
  const [removedDuplicates, setRemovedDuplicates] = useState(0);

  useEffect(() => {
    if (selectedQuery) {
      const analysisData = generateAnalysisData(selectedQuery);
      setDuplicatePairs(mockDuplicatePairs.slice(0, analysisData.duplicates));
      setRemovedDuplicates(0);
      setSelectedPairs(new Set());
    }
  }, [selectedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const query = savedQueries.find(q => q.id === event.target.value) || null;
    setSelectedQuery(query);
    setSelectedPairs(new Set());
    setDisplayedPairs(5);
    setRemovedDuplicates(0);
  };

  const handleCheckAbstracts = (id: number) => {
    const pair = duplicatePairs.find(p => p.id === id);
    if (pair) {
      setSelectedPair(pair);
      setModalOpen(true);
    }
  };

  const handleTogglePair = (id: number) => {
    setSelectedPairs(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  };

  const handleSelectAllPairs = () => {
    if (selectedPairs.size === duplicatePairs.length) {
      setSelectedPairs(new Set());
    } else {
      setSelectedPairs(new Set(duplicatePairs.map(pair => pair.id)));
    }
  };

  const handleSeeMorePairs = () => {
    setDisplayedPairs(prevDisplayed => prevDisplayed + 5);
  };

  const handleRemoveDuplicates = () => {
    const newDuplicatePairs = duplicatePairs.filter(pair => !selectedPairs.has(pair.id));
    setDuplicatePairs(newDuplicatePairs);
    setRemovedDuplicates(prev => prev + selectedPairs.size);
    setSelectedPairs(new Set());
    setDisplayedPairs(Math.min(displayedPairs, newDuplicatePairs.length));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-teal-700 flex items-center">
        <FaExchangeAlt className="mr-2" /> Duplicate Analysis
      </h1>

      <div className="mb-6">
        <label htmlFor="querySelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select a Query
        </label>
        <select
          id="querySelect"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
          onChange={handleQueryChange}
          value={selectedQuery?.id || ''}
        >
          <option value="">Select a query</option>
          {savedQueries.map((query) => (
            <option key={query.id} value={query.id}>
              {query.name}
            </option>
          ))}
        </select>
      </div>

      {selectedQuery && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-teal-700">Query Summary</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-teal-100 p-4 rounded-lg">
              <p className="text-sm text-teal-700">PubMed Papers</p>
              <p className="text-2xl font-bold text-teal-800">{selectedQuery.collectedDocuments.pubmed}</p>
            </div>
            <div className="bg-teal-100 p-4 rounded-lg">
              <p className="text-sm text-teal-700">Semantic Scholar Papers</p>
              <p className="text-2xl font-bold text-teal-800">{selectedQuery.collectedDocuments.semanticScholar}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <p className="text-sm text-yellow-700">Potential Duplicates</p>
              <p className="text-2xl font-bold text-yellow-800">{generateAnalysisData(selectedQuery).duplicates}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-sm text-green-700">Duplicates Removed</p>
              <p className="text-2xl font-bold text-green-800">{removedDuplicates}</p>
            </div>
          </div>
        </div>
      )}

      {duplicatePairs.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-teal-700">Duplicate Comparison</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleSelectAllPairs}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
              >
                {selectedPairs.size === duplicatePairs.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={handleRemoveDuplicates}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                disabled={selectedPairs.size === 0}
              >
                <FaTrash className="mr-2" />
                Remove Selected Duplicates
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article 1</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article 2</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proximity Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selection</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {duplicatePairs.slice(0, displayedPairs).map((pair) => (
                  <tr key={pair.id}>
                    <td className="px-4 py-4 text-sm text-gray-900">{pair.article1.title}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{pair.article2.title}</td>
                    <td className="px-4 py-4 text-sm text-gray-900">{pair.proximityScore.toFixed(2)}</td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <button
                        onClick={() => handleCheckAbstracts(pair.id)}
                        className="text-teal-600 hover:text-teal-900 flex items-center"
                      >
                        <FaFileAlt className="mr-2" />
                        Check Abstracts
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm font-medium">
                      <button
                        onClick={() => handleTogglePair(pair.id)}
                        className="text-teal-600 hover:text-teal-900"
                      >
                        {selectedPairs.has(pair.id) ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {displayedPairs < duplicatePairs.length && (
            <div className="mt-4 text-center">
              <button
                onClick={handleSeeMorePairs}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
              >
                See More Pairs <FaChevronDown className="ml-2" />
              </button>
            </div>
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} pair={selectedPair} />
    </div>
  );
};

export default DuplicateAnalysis;
