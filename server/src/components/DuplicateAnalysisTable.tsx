import React, { useState } from 'react';
import { FaFileAlt, FaToggleOn, FaToggleOff, FaChevronDown, FaTrash, FaTimes, FaEye } from 'react-icons/fa';
import { DuplicatePair } from './DuplicateAnalysis';

interface DuplicateAnalysisTableProps {
  duplicatePairs: DuplicatePair[];
  onCheckAbstracts: (id: number) => void;
  onTogglePair: (id: number) => void;
  selectedPairs: Set<number>;
  onSelectAllPairs: () => void;
  onRemoveDuplicates: () => void;
  displayedPairs: number;
  onSeeMore: () => void;
  modalOpen: boolean;
  selectedPair: DuplicatePair | null;
  onCloseModal: () => void;
}

const DuplicateAnalysisTable: React.FC<DuplicateAnalysisTableProps> = ({
  duplicatePairs,
  onCheckAbstracts,
  onTogglePair,
  selectedPairs,
  onSelectAllPairs,
  onRemoveDuplicates,
  displayedPairs,
  onSeeMore,
  modalOpen,
  selectedPair,
  onCloseModal,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-black">Potential duplicates comparison</h2>
        <button
          onClick={onRemoveDuplicates}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg text-red-600 bg-red-50 hover:bg-red-100"
          disabled={selectedPairs.size === 0}
        >
          Remove selected
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#BDBDBD]">
              <th className="px-4 py-3 text-left text-sm font-bold text-black">Article 1</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-black">Article 2</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-black">Proximity score</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-black">Abstracts</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-black">
                <input
                  type="checkbox"
                  checked={selectedPairs.size === duplicatePairs.length}
                  onChange={onSelectAllPairs}
                  className="w-4 h-4 rounded border-[#BDBDBD] text-[#62B6CB] focus:ring-[#62B6CB]"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {duplicatePairs.slice(0, displayedPairs).map((pair) => (
              <tr key={pair.id} className="border-b border-[#BDBDBD]">
                <td className="px-4 py-4 text-sm text-black">{pair.article1.title}</td>
                <td className="px-4 py-4 text-sm text-black">{pair.article2.title}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-[#62B6CB] text-white">
                    {pair.proximityScore.toFixed(1)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => onCheckAbstracts(pair.id)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#62B6CB] text-white hover:bg-[#62B6CB]/90"
                  >
                    <FaEye className="w-4 h-4" />
                  </button>
                </td>
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedPairs.has(pair.id)}
                    onChange={() => onTogglePair(pair.id)}
                    className="w-4 h-4 rounded border-[#BDBDBD] text-[#62B6CB] focus:ring-[#62B6CB]"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayedPairs < duplicatePairs.length && (
        <div className="mt-4 text-center">
          <button
            onClick={onSeeMore}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#62B6CB] hover:bg-[#62B6CB]"
          >
            See More Pairs <FaChevronDown className="ml-2" />
          </button>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={onCloseModal} pair={selectedPair} />
    </div>
  );
};

// Update Modal styling
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  pair: DuplicatePair | null;
}> = ({ isOpen, onClose, pair }) => {
  if (!isOpen || !pair) return null;

  return (
    <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-4/5 shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-black">Abstract Comparison</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">{pair.article1.title}</h4>
            <p className="text-sm">{pair.article1.abstract}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">{pair.article2.title}</h4>
            <p className="text-sm">{pair.article2.abstract}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateAnalysisTable;
