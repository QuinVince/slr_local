import React, { useState, useEffect } from 'react';
import { FaSearch, FaExchangeAlt, FaFolder, FaCheck, FaCheckDouble } from 'react-icons/fa';
import { HiMiniArrowUturnLeft } from "react-icons/hi2";
import { SavedQuery } from '../App';
import { mockDuplicatePairs } from '../mockData';
import DuplicateAnalysisTable from './DuplicateAnalysisTable';

interface DuplicateAnalysisProps {
  savedQueries: SavedQuery[];
  onReturn: () => void;
  onUpdateQuery: (query: SavedQuery) => void;
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

const DuplicateAnalysis: React.FC<DuplicateAnalysisProps> = ({ savedQueries, onReturn, onUpdateQuery }) => {
  const [selectedQuery, setSelectedQuery] = useState<SavedQuery | null>(null);
  const [duplicatePairs, setDuplicatePairs] = useState<DuplicatePair[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPair, setSelectedPair] = useState<DuplicatePair | null>(null);
  const [selectedPairs, setSelectedPairs] = useState<Set<number>>(new Set());
  const [displayedPairs, setDisplayedPairs] = useState(5);
  const [removedDuplicates, setRemovedDuplicates] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  const handleQuerySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const query = savedQueries.find(q => q.id === event.target.value);
    if (query) {
      setSelectedQuery(query);
      setRemovedDuplicates(query.collectedDocuments.removedDuplicates || 0);
      const remainingPairs = mockDuplicatePairs.slice(query.collectedDocuments.removedDuplicates || 0);
      setDuplicatePairs(remainingPairs);
      setSelectedPairs(new Set());
      setDisplayedPairs(5);
    }
  };

  useEffect(() => {
    if (selectedQuery?.collectedDocuments.removedDuplicates !== undefined) {
      setRemovedDuplicates(selectedQuery.collectedDocuments.removedDuplicates);
    }
  }, [selectedQuery]);

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
    const newRemovedCount = removedDuplicates + selectedPairs.size;
    setRemovedDuplicates(newRemovedCount);
    
    if (selectedQuery) {
      const updatedQuery = {
        ...selectedQuery,
        collectedDocuments: {
          ...selectedQuery.collectedDocuments,
          removedDuplicates: newRemovedCount
        }
      };
      onUpdateQuery(updatedQuery);
      setSelectedQuery(updatedQuery);
    }
    
    setSelectedPairs(new Set());
    setDisplayedPairs(Math.min(displayedPairs, newDuplicatePairs.length));
  };

  const handleSaveAndReturn = () => {
    if (selectedQuery) {
      const updatedQuery = {
        ...selectedQuery,
        collectedDocuments: {
          ...selectedQuery.collectedDocuments,
          removedDuplicates: removedDuplicates
        }
      };

      onUpdateQuery(updatedQuery);
      setIsSaved(true);
      
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full p-6">
        <h1 className="text-2xl font-bold text-black mb-6 text-center">Duplicate analysis</h1>
        
        <div className="flex items-center space-x-6 mb-8">
          {/* Query Selector - Always visible */}
          <div className="w-1/4 flex items-center">
            <div className="relative h-full">
              <select
                value={selectedQuery?.id || ''}
                onChange={handleQuerySelect}
                className="w-full h-[50px] pl-10 pr-8 py-2 border border-[#BDBDBD] rounded-xl 
                focus:outline-none focus:ring-2 focus:ring-[#62B6CB] appearance-none border-b-4 
                font-bold bg-white hover:bg-gray-50 transition-colors duration-200
                cursor-pointer shadow-sm hover:shadow-md"
              >
                <option value="" className="text-gray-500 bg-white hover:bg-gray-50">
                  Select a query
                </option>
                {savedQueries.map(query => (
                  <option 
                    key={query.id} 
                    value={query.id}
                    className="py-2 text-gray-800 hover:bg-gray-50"
                  >
                    {query.name}
                  </option>
                ))}
              </select>
              {/* Folder icon on the left */}
              <div className="absolute top-4 left-3">
                <FaFolder className="text-[#62B6CB]" />
              </div>
              {/* Down arrow on the right */}
              <div className="absolute top-4 right-3 ">
                <svg className="w-4 h-4 text-[#62B6CB] " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Statistics Box - Always visible with placeholder values */}
          <div className="w-full flex items-center justify-between h-[50px] bg-white rounded-xl border border-[#BDBDBD] p-4 border-b-4">
            <div className="flex items-center justify-start">
              <span className="text-sm text-black font-bold">Pubmed papers</span>
              <span className="px-3 py-1 rounded-xl bg-[#D5F7FF] text-[#296A7A] text-sm font-bold ml-2">
                {selectedQuery ? selectedQuery.collectedDocuments.pubmed : '-'}
              </span>
            </div>
            <div className="flex items-center justify-start">
              <span className="text-sm text-black font-bold">Semantic Scholar Papers</span>
              <span className="px-3 py-1 rounded-xl bg-[#D5F7FF] text-[#296A7A] text-sm font-bold ml-2">
                {selectedQuery ? selectedQuery.collectedDocuments.semanticScholar : '-'}
              </span>
            </div>
            <div className="flex items-center justify-start">
              <span className="text-sm text-black font-bold">Potential Duplicates</span>
              <span className="px-3 py-1 rounded-xl bg-[#FFE299] text-[#664900]text-sm font-bold ml-2">
                {duplicatePairs.length || '-'}
              </span>
            </div>
            <div className="flex items-center justify-start">
              <span className="text-sm text-black font-bold">Removed Duplicates</span>
              <span className="px-3 py-1 rounded-xl bg-[#D7ECD4] text-[#408038] text-sm font-bold ml-2">
                {removedDuplicates || '-'}
              </span>
            </div>
          </div>
        </div>

        {/* Analysis Table - Only shown when a query is selected and duplicates exist */}
        {selectedQuery && (
          <>
            {duplicatePairs.length > 0 && (
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

            {/* Updated Save Button */}
            <div className="flex justify-center mt-8">
              <button
                onClick={handleSaveAndReturn}
                disabled={isSaved}
                className={`flex items-center px-6 py-3 bg-[#62B6CB] text-white rounded-xl 
                transition-colors duration-200 font-semibold
                focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2
                ${isSaved ? 'bg-[#408038] hover:bg-[#408038]' : 'hover:bg-[#5AA3B7]'}`}
              >
                {isSaved ? (
                  <>
                    <FaCheckDouble className="w-5 h-5 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <FaCheck className="w-5 h-5 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DuplicateAnalysis;
