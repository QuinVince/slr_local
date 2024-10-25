import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';

interface SynonymGroup {
  concept: string;
  abstraction: string;
  synonyms: string[];
}

interface SynonymListProps {
  synonymGroups: SynonymGroup[];
  selectedConceptIndex: number;
  onSynonymClick: (synonym: string) => void;
  onGetSynonyms: () => void;
  isSynonymsLoading: boolean;
}

const colors = [
  'bg-red-100 text-red-700 hover:bg-red-200',
  'bg-blue-100 text-blue-700 hover:bg-blue-200',
  'bg-green-100 text-green-700 hover:bg-green-200',
  'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  'bg-purple-100 text-purple-700 hover:bg-purple-200',
];

const SynonymList: React.FC<SynonymListProps> = ({ 
  synonymGroups = [], 
  selectedConceptIndex,
  onSynonymClick, 
  onGetSynonyms, 
  isSynonymsLoading 
}) => {
  const selectedGroup = synonymGroups[selectedConceptIndex];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-teal-700">Suggested Synonyms:</h3>
        <button
          onClick={onGetSynonyms}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          disabled={isSynonymsLoading}
        >
          {isSynonymsLoading ? 'Loading...' : 'Get Synonyms / Related Terms'}
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {selectedGroup && (
          <div className="mb-4">
            <h4 className="font-semibold text-teal-600 mb-2">{selectedGroup.abstraction}</h4>
            <p className="text-sm text-gray-600 mb-2">Original: {selectedGroup.concept}</p>
            <div className="flex flex-wrap gap-2">
              {selectedGroup.synonyms.map((synonym, index) => (
                <button
                  key={index}
                  onClick={() => onSynonymClick(synonym)}
                  className={`px-3 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center ${colors[selectedConceptIndex % colors.length]}`}
                >
                  <FaPlusCircle className="mr-1" /> {synonym}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SynonymList;
