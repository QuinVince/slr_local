import { SavedQuery } from '../App';

interface AnalysisData {
  totalVolume: number;
  pubmedVolume: number;
  semanticScholarVolume: number;
  duplicates: number;
  postDeduplication: number;
  hundredPercentMatch: number;
}

export function generateAnalysisData(savedQuery: SavedQuery): AnalysisData {
  const totalVolume = savedQuery.collectedDocuments.pubmed + savedQuery.collectedDocuments.semanticScholar;
  const pubmedVolume = savedQuery.collectedDocuments.pubmed;
  const semanticScholarVolume = savedQuery.collectedDocuments.semanticScholar;

  // Generate number of duplicates (around 10% of total volume)
  const duplicates = Math.round(totalVolume * 0.1);

  // Calculate number of papers post deduplication
  const postDeduplication = totalVolume - duplicates;

  // Generate number of 100% match papers (between 5% and 30% of post-deduplication)
  const matchPercentage = 0.18;
  const hundredPercentMatch = Math.round(postDeduplication * matchPercentage);

  return {
    totalVolume,
    pubmedVolume,
    semanticScholarVolume,
    duplicates,
    postDeduplication,
    hundredPercentMatch,
  };
}
