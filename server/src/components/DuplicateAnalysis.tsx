import React, { useState, useEffect } from 'react';
import { FaSearch, FaExchangeAlt, FaFolder } from 'react-icons/fa';
import { SavedQuery } from '../App';
import { mockDuplicatePairs } from '../mockData';
import DuplicateAnalysisTable from './DuplicateAnalysisTable';

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

const DuplicateAnalysis: React.FC<DuplicateAnalysisProps> = ({ savedQueries }) => {
  const [selectedQuery, setSelectedQuery] = useState<SavedQuery | null>(null);
  const [duplicatePairs, setDuplicatePairs] = useState<DuplicatePair[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState<DuplicatePair | null>(null);
  const [selectedPairs, setSelectedPairs] = useState<Set<number>>(new Set());
  const [displayedPairs, setDisplayedPairs] = useState(5);
  const [removedDuplicates, setRemovedDuplicates] = useState(0);

  const handleQuerySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const query = savedQueries.find(q => q.id === event.target.value);
    if (query) {
      setSelectedQuery(query);
      setDuplicatePairs(mockDuplicatePairs);
      setRemovedDuplicates(0);
      setSelectedPairs(new Set());
      setDisplayedPairs(5);
    }
  };

  const handleCheckAbstracts = (id: number) => {
    const pair = duplicatePairs.find(p => p.id === id);
    if (pair) {
      setSelectedPair(pair);
      setModalOpen(true);
    }
  };

  const handleTogglePair = (id: number) => {
    setSelectedPairs(prev => {
      const newSelected = new Set(prev);
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
    <div className="flex flex-col items-center justify-center">
    <div className="w-5/6 p-6">
      <h1 className="text-2xl font-bold text-black mb-6 text-center">Duplicate analysis</h1>
      
      <div className="flex items-start space-x-6 mb-8">
        {/* Query Selector - Updated height to match stats box */}
        <div className="w-1/6">
          <div className="relative h-full">
            <select
              value={selectedQuery?.id || ''}
              onChange={handleQuerySelect}
              className="w-full h-[50px] pl-10 pr-8 py-2 border border-[#BDBDBD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62B6CB] appearance-none"
            >
              <option value="">Select a query</option>
              {savedQueries.map(query => (
                <option key={query.id} value={query.id}>
                  {query.name}
                </option>
              ))}
            </select>
            {/* Folder icon on the left */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <FaFolder className="text-[#62B6CB]" />
            </div>
            {/* Down arrow on the right */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-[#62B6CB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Statistics Box - Reorganized layout */}
        {selectedQuery && (
          <div className="w-full flex items-center justify-between h-[50px] bg-white rounded-lg border border-[#BDBDBD] p-4">
            <div className="flex items-center justify-start">
              <span className="text-sm text-black">Pubmed papers</span>
              <span className="px-3 py-1 rounded-full bg-[#62B6CB] text-white text-sm font-medium ml-2">
                {selectedQuery.collectedDocuments.pubmed}
              </span>
            </div>
            <div className="flex items-center justify-start">
              <span className="text-sm text-black">Semantic Scholar Papers</span>
              <span className="px-3 py-1 rounded-full bg-[#62B6CB] text-white text-sm font-medium ml-2">
                {selectedQuery.collectedDocuments.semanticScholar}
              </span>
            </div>
            <div className="flex items-center justify-start">
              <span className="text-sm text-black">Potential Duplicates</span>
              <span className="px-3 py-1 rounded-full bg-[#FFD700] text-black text-sm font-medium ml-2">
                {duplicatePairs.length}
              </span>
            </div>
            <div className="flex items-center justify-start">
              <span className="text-sm text-black">Removed Duplicates</span>
              <span className="px-3 py-1 rounded-full bg-[#98FB98] text-black text-sm font-medium ml-2">
                {removedDuplicates}
              </span>
            </div>
          </div>
        )}
      </div>


      {/* Analysis Table */}
      {selectedQuery && duplicatePairs.length > 0 && (
        <DuplicateAnalysisTable
          duplicatePairs={duplicatePairs}
          onCheckAbstracts={handleCheckAbstracts}
          onTogglePair={handleTogglePair}
          selectedPairs={selectedPairs}
          onSelectAllPairs={handleSelectAllPairs}
          onRemoveDuplicates={handleRemoveDuplicates}
          displayedPairs={displayedPairs}
          onSeeMore={handleSeeMorePairs}
          modalOpen={modalOpen}
          selectedPair={selectedPair}
          onCloseModal={() => setModalOpen(false)}
        />
      )}
    </div>
    </div>
  );
};

export default DuplicateAnalysis;
