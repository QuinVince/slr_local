import React from 'react';
import { FaPlusCircle, FaSync } from 'react-icons/fa';

interface SynonymGroup {
  concept: string;
  abstraction: string;
  synonyms: string[];
}

interface SynonymListProps {
  synonymGroups: SynonymGroup[];
  selectedConceptIndex: number;
  onSynonymClick: (synonym: string) => void;
  onConceptSelect: (index: number) => void;
  onGetSynonyms: () => void;
  isSynonymsLoading: boolean;
}

const SynonymList: React.FC<SynonymListProps> = ({
  synonymGroups,
  selectedConceptIndex,
  onSynonymClick,
  onConceptSelect,
  onGetSynonyms,
  isSynonymsLoading
}) => {
  if (isSynonymsLoading) {
    return <div>Loading synonyms...</div>;
  }

  return (
    <div>
      {/* Concepts Selection with Dropdown */}
      <div className="flex items-center mb-4">
        <div className="flex items-center w-1/2">
          <label className="text-lg  font-large text-black mr-3 font-bold">
            Select keywords:
          </label>
          <select
            value={selectedConceptIndex}
            onChange={(e) => onConceptSelect(Number(e.target.value))}
            className="w-full px-3 py-2 border border-[#BDBDBD] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#62B6CB] border-b-4"
          >
            {synonymGroups.map((group, index) => (
              <option key={index} value={index}>
                {group.abstraction}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onGetSynonyms}
          className="ml-3 text-[#62B6CB] hover:text-white p-2 rounded-full hover:bg-[#C2E2EB] transition-colors"
          disabled={isSynonymsLoading}
        >
          <FaSync className={`w-4 h-4 ${isSynonymsLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Synonyms Display */}
      {synonymGroups.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {synonymGroups[selectedConceptIndex]?.synonyms.map((synonym, index) => (
            <button
              key={index}
              onClick={() => onSynonymClick(synonym)}
              className="inline-flex items-center px-3 py-1 rounded-full bg-[#C2E2EB] text-black hover:bg-[#62B6CB] transition-colors"
            >
              <FaPlusCircle className="mr-1 text-[#62B6CB] bg-white rounded-full" />
              {synonym}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SynonymList;
