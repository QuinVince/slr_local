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
          <label className="text-sm font-medium text-gray-700 mr-3">
            Select keywords:
          </label>
          <select
            value={selectedConceptIndex}
            onChange={(e) => onConceptSelect(Number(e.target.value))}
            className="w-full px-3 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
          className="ml-3 text-teal-600 hover:text-teal-700 p-2 rounded-full hover:bg-teal-50 transition-colors"
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
              className="inline-flex items-center px-3 py-1 rounded-full bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors"
            >
              <FaPlusCircle className="mr-1" />
              {synonym}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SynonymList;
