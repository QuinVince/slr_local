import React, { useState, useEffect } from 'react';
import { FaSearch, FaExchangeAlt } from 'react-icons/fa';
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#62B6CB] mb-6">Duplicate analysis</h1>
      
      <div className="flex items-start space-x-6 mb-8">
        {/* Query Selector */}
        <div className="w-1/3">
          <select
            value={selectedQuery?.id || ''}
            onChange={handleQuerySelect}
            className="w-full px-4 py-2 border border-[#BDBDBD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#62B6CB]"
          >
            <option value="">Select a query</option>
            {savedQueries.map(query => (
              <option key={query.id} value={query.id}>
                {query.name}
              </option>
            ))}
          </select>
        </div>

        {/* Statistics Box */}
        {selectedQuery && (
          <div className="flex-1 bg-[#62B6CB] rounded-lg border border-[#BDBDBD] p-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-[#62B6CB] text-white text-sm font-medium">
                  {selectedQuery.collectedDocuments.pubmed}
                </span>
                <span className="text-sm text-[#BDBDBD]">Pubmed papers</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-[#62B6CB] text-white text-sm font-medium">
                  {selectedQuery.collectedDocuments.semanticScholar}
                </span>
                <span className="text-sm text-[#BDBDBD]">Semantic Scholar Papers</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-[#62B6CB] text-white text-sm font-medium">
                  138
                </span>
                <span className="text-sm text-[#BDBDBD]">Potential Duplicates</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-[#62B6CB] text-white text-sm font-medium">
                  {removedDuplicates}
                </span>
                <span className="text-sm text-[#BDBDBD]">Removed Duplicates</span>
              </div>
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
  );
};

export default DuplicateAnalysis;
