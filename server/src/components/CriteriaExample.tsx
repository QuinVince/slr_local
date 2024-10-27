import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface CriteriaExampleProps {
  example: string;
  onSelect: (example: string) => void;
}

const CriteriaExample: React.FC<CriteriaExampleProps> = ({ example, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(example)}
      className="p-3 border border-[#62B6CB] rounded-md hover:bg-[#C2E2EB] text-left w-full transition-colors group"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-700">{example}</span>
        <FaPlus className="text-[#62B6CB] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
};

export default CriteriaExample;
