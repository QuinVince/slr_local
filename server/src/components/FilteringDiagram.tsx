import React, { useState, useEffect } from 'react';
import { FaDatabase, FaCopy, FaFilter, FaFileAlt, FaCheckCircle, FaDownload, FaInfoCircle, FaArrowDown, FaProjectDiagram, FaFolder } from 'react-icons/fa';
import axios from 'axios';
import { SavedQuery } from '../App';

interface ExclusionReason {
  reason: string;
  count: number;
}

interface DiagramStep {
  icon: React.ReactNode;
  title: string;
  count: number;
  description: string;
  excluded?: ExclusionReason[];
}

interface FilteringDiagramProps {
  savedQueries: SavedQuery[];
}

const FilteringDiagram: React.FC<FilteringDiagramProps> = ({ savedQueries }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<SavedQuery | null>(null);
  const [steps, setSteps] = useState<DiagramStep[]>([]);

  const handleQuerySelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const query = savedQueries.find(q => q.id === event.target.value);
    if (query) {
      setSelectedQuery(query);
      
      // Calculate numbers based on the selected query
      const totalPapers = query.collectedDocuments.pubmed + query.collectedDocuments.semanticScholar;
      const afterDeduplication = totalPapers - (query.collectedDocuments.removedDuplicates || 0);
      const screening = Math.round(afterDeduplication * 0.25); // 25% of papers after deduplication
      const eligibility = Math.round(screening * 0.35); // 35% of screened papers
      const included = Math.round(eligibility * 0.80); // 80% of eligible papers

      setSteps([
        {
          icon: <FaDatabase />,
          title: 'Identification',
          count: totalPapers,
          description: 'Records identified through database searching',
          excluded: [
            { reason: 'PubMed', count: query.collectedDocuments.pubmed },
            { reason: 'Semantic Scholar', count: query.collectedDocuments.semanticScholar },
          ]
        },
        {
          icon: <FaCopy />,
          title: 'Deduplication',
          count: afterDeduplication,
          description: 'Records after duplicates removed',
          excluded: [
            { reason: 'Duplicate records', count: query.collectedDocuments.removedDuplicates || 0 },
          ]
        },
        {
          icon: <FaFilter />,
          title: 'Screening',
          count: screening,
          description: 'Records screened',
          excluded: [
            { reason: 'Records excluded', count: afterDeduplication - screening },
          ]
        },
        {
          icon: <FaFileAlt />,
          title: 'Eligibility',
          count: eligibility,
          description: 'Full-text articles assessed for eligibility',
          excluded: [
            { reason: 'Full-text articles excluded', count: screening - eligibility },
          ]
        },
        {
          icon: <FaCheckCircle />,
          title: 'Included',
          count: included,
          description: 'Studies included in review',
          excluded: [
            { reason: 'Articles excluded from review', count: eligibility - included },
          ]
        }
      ]);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get('http://localhost:8000/export_prisma', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'prisma_diagram.png');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting PRISMA diagram:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white p-6 ">
      <h1 className="text-2xl font-bold mb-6 text-black text-center">
        PRISMA Flow Diagram
      </h1>

      {/* Query Selector */}
      <div className="w-1/4 mb-8">
        <div className="relative h-full">
          <select
            value={selectedQuery?.id || ''}
            onChange={handleQuerySelect}
            className="w-full h-[50px] pl-10 pr-8 py-2 border border-[#BDBDBD] rounded-xl 
            focus:outline-none focus:ring-2 focus:ring-[#62B6CB] appearance-none border-b-4 
            font-bold bg-white hover:bg-gray-50 transition-colors duration-200
            cursor-pointer shadow-sm hover:shadow-md"
          >
            <option value="" className="text-gray-500">Select a query</option>
            {savedQueries.map(query => (
              <option key={query.id} value={query.id}>
                {query.name}
              </option>
            ))}
          </select>
          <div className="absolute top-4 left-3">
            <FaFolder className="text-[#62B6CB]" />
          </div>
          <div className="absolute top-4 right-3">
            <svg className="w-4 h-4 text-[#62B6CB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {selectedQuery && (
        <>
          <div className="relative">
            {steps.map((step, index) => (
              <div key={index} className="mb-2 flex items-start">
                <div className="w-1/3 pr-4">
                  <div className="border-2 border-[#62B6CB] p-3 rounded-lg bg-white h-full">
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <div className="w-1/3 px-4">
                  <div className="border-2 border-[#62B6CB] p-3 rounded-lg bg-white relative flex items-center justify-center">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-[#62B6CB] rounded-full flex items-center justify-center text-white text-2xl mr-3">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#62B6CB]">{step.title}</h3>
                        <p className="font-semibold">(n = {step.count})</p>
                      </div>
                    </div>
                    {step.excluded && (
                      <button
                        onClick={() => toggleExpand(index)}
                        className="absolute top-1 right-1 text-[#62B6CB] hover:text-[#62B6CB]"
                      >
                        <FaInfoCircle size={20} />
                      </button>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-2">
                      <FaArrowDown className="text-[#62B6CB] text-2xl" />
                    </div>
                  )}
                </div>
                <div className="w-1/3 pl-4">
                  {expandedStep === index && step.excluded && (
                    <div className="border-2 border-[#62B6CB] p-3 rounded-lg bg-white">
                      <h4 className="font-bold text-[#62B6CB] mb-1">Records excluded</h4>
                      {step.excluded.map((reason, idx) => (
                        <div key={idx} className="mb-1">
                          <p className="text-xs">{reason.reason}: <span className="font-semibold">{reason.count}</span></p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 bg-[#62B6CB] text-white rounded-xl hover:bg-[#5AA3B7] 
              focus:outline-none focus:ring-2 focus:ring-[#62B6CB] focus:ring-offset-2 
              flex items-center transition-colors duration-200"
            >
              <FaDownload className="mr-2" />
              {isExporting ? 'Exporting...' : 'Export PRISMA Diagram'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FilteringDiagram;
