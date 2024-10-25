import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';

interface SynonymListProps {
  synonyms: string[];
  onSynonymClick: (synonym: string) => void;
  onGetSynonyms: () => void;
}

const SynonymList: React.FC<SynonymListProps> = ({ synonyms = [], onSynonymClick, onGetSynonyms }) => {
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-teal-700">Suggested Synonyms:</h3>
        <button
          onClick={onGetSynonyms}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
        >
          Get Synonyms
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {synonyms.map((synonym, index) => (
          <button
            key={index}
            onClick={() => onSynonymClick(synonym)}
            className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center"
          >
            <FaPlusCircle className="mr-1" /> {synonym}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SynonymList;
