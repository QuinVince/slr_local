import React, { useState, useEffect } from 'react';
import { FaDatabase, FaCopy, FaFilter, FaFileAlt, FaCheckCircle, FaDownload, FaInfoCircle, FaArrowDown, FaProjectDiagram } from 'react-icons/fa';
import axios from 'axios';
import { generateAnalysisData } from '../utils/generateAnalysisData';
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
  selectedQuery: SavedQuery | null;
}

const FilteringDiagram: React.FC<FilteringDiagramProps> = ({ selectedQuery }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [steps, setSteps] = useState<DiagramStep[]>([]);

  useEffect(() => {
    if (selectedQuery) {
      const analysisData = generateAnalysisData(selectedQuery);
      setSteps([
        {
          icon: <FaDatabase />,
          title: 'Identification',
          count: analysisData.totalVolume,
          description: 'Records identified through database searching',
        },
        {
          icon: <FaCopy />,
          title: 'Deduplication',
          count: analysisData.totalVolume,
          description: 'Records compared for deduplication',
          excluded: [
            { reason: 'Duplicate records', count: analysisData.duplicates },
          ]
        },
        {
          icon: <FaFilter />,
          title: 'Screening',
          count: analysisData.postDeduplication,
          description: 'Records screened for title, abstract and keywords',
          excluded: [
            { reason: '>1 criteria not fulfilled', count: analysisData.postDeduplication - analysisData.hundredPercentMatch },
          ]
        },
        {
          icon: <FaFileAlt />,
          title: 'Eligibility',
          count: analysisData.hundredPercentMatch,
          description: 'Full-text articles assessed for eligibility',
        },
        {
          icon: <FaCheckCircle />,
          title: 'Included',
          count: analysisData.hundredPercentMatch,
          description: 'Studies included in qualitative synthesis'
        }
      ]);
    }
  }, [selectedQuery]);

  const toggleExpand = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  const handleExport = async () => {
    if (!selectedQuery) return;

    setIsExporting(true);
    try {
      const analysisData = generateAnalysisData(selectedQuery);
      console.log('Sending request to http://localhost:8000/export_prisma');
      const response = await axios.post('http://localhost:8000/export_prisma', analysisData, { responseType: 'blob' });
      console.log('Received response:', response);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'prisma_diagram.png');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting PRISMA diagram:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', await error.response?.data.text());
        console.error('Response status:', error.response?.status);
        console.error('Response headers:', error.response?.headers);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-teal-700 flex items-center"> 
         <FaProjectDiagram className="mr-2" /> PRISMA Flow Diagram
      </h1>
      {selectedQuery ? (
        <div className="relative">
          {steps.map((step, index) => (
            <div key={index} className="mb-2 flex items-start">
              <div className="w-1/3 pr-4">
                <div className="border-2 border-dotted border-teal-500 p-3 rounded-lg bg-white h-full">
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              </div>
              <div className="w-1/3 px-4">
                <div className="border-2 border-teal-500 p-3 rounded-lg bg-white relative flex items-center justify-center">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white text-2xl mr-3">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-teal-700">{step.title}</h3>
                      <p className="font-semibold">(n = {step.count})</p>
                    </div>
                  </div>
                  {step.excluded && (
                    <button
                      onClick={() => toggleExpand(index)}
                      className="absolute top-1 right-1 text-teal-500 hover:text-teal-700"
                    >
                      <FaInfoCircle size={20} />
                    </button>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <FaArrowDown className="text-teal-500 text-2xl" />
                  </div>
                )}
              </div>
              <div className="w-1/3 pl-4">
                {expandedStep === index && step.excluded && (
                  <div className="border-2 border-red-400 p-3 rounded-lg bg-white">
                    <h4 className="font-bold text-red-600 mb-1">Records excluded</h4>
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
      ) : (
        <p className="text-center text-gray-600">Please select a query to generate the PRISMA diagram.</p>
      )}
      <div className="mt-6">
        <button
          onClick={handleExport}
          disabled={isExporting || !selectedQuery}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 flex items-center"
        >
          <FaDownload className="mr-2" />
          {isExporting ? 'Exporting...' : 'Export PRISMA Diagram'}
        </button>
      </div>
    </div>
  );
};

export default FilteringDiagram;
