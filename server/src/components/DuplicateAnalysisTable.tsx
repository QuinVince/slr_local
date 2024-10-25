import React, { useState } from 'react';
import { FaFileAlt, FaToggleOn, FaToggleOff, FaChevronDown, FaTrash, FaTimes } from 'react-icons/fa';
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
        <h2 className="text-xl font-semibold text-teal-700">Duplicate Comparison</h2>
        <div className="flex space-x-2">
          <button
            onClick={onSelectAllPairs}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
          >
            {selectedPairs.size === duplicatePairs.length ? 'Deselect All' : 'Select All'}
          </button>
          <button
            onClick={onRemoveDuplicates}
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
                    onClick={() => onCheckAbstracts(pair.id)}
                    className="text-teal-600 hover:text-teal-900 flex items-center"
                  >
                    <FaFileAlt className="mr-2" />
                    Check Abstracts
                  </button>
                </td>
                <td className="px-4 py-4 text-sm font-medium">
                  <button
                    onClick={() => onTogglePair(pair.id)}
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
            onClick={onSeeMore}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700"
          >
            See More Pairs <FaChevronDown className="ml-2" />
          </button>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={onCloseModal} pair={selectedPair} />
    </div>
  );
};

// Fix the Modal component by adding the return statement
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

export default DuplicateAnalysisTable;
