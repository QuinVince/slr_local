import React, { useState } from 'react';
import { FaSearch, FaPlusCircle, FaExchangeAlt, FaFolder, FaProjectDiagram } from 'react-icons/fa';

interface LandingPageProps {
  onNavigate: (component: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Que souhaitez-vous faire ?</h1>
      
      <div className="relative mb-8">
        <input
          type="text"
          className="w-full p-4 pr-12 text-gray-900 border border-teal-300 rounded-full focus:ring-teal-500 focus:border-teal-500"
          placeholder="Décrivez votre recherche en langage naturel"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="absolute right-2.5 bottom-2.5 bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300"
          onClick={handleSearch}
        >
          <FaSearch className="w-6 h-6" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          className="flex items-center justify-center p-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:ring-4 focus:outline-none focus:ring-teal-300"
          onClick={() => onNavigate('query')}
        >
          <FaPlusCircle className="mr-2" />
          Nouvelle query
        </button>
        <button
          className="flex items-center justify-center p-4 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200"
          onClick={() => onNavigate('duplicate')}
        >
          <FaExchangeAlt className="mr-2" />
          Duplicate analysis
        </button>
        <button
          className="flex items-center justify-center p-4 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200"
          onClick={() => onNavigate('screening')}
        >
          <FaFolder className="mr-2" />
          File screening
        </button>
        <button
          className="flex items-center justify-center p-4 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200"
          onClick={() => onNavigate('prism')}
        >
          <FaProjectDiagram className="mr-2" />
          PRISM diagram
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
