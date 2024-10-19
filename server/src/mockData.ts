import { DuplicatePair } from './components/DuplicateAnalysis';
import { Document } from './components/DocumentAnalysis';

export const mockDuplicatePairs: DuplicatePair[] = [
  { 
    id: 1, 
    article1: {
      title: "Efficacy of Ocrelizumab in Relapsing-Remitting Multiple Sclerosis",
      abstract: "This study examines the effects of ocrelizumab on disease progression in adults with relapsing-remitting multiple sclerosis. The research, conducted over a 24-month period, involved 500 participants aged 18-55 who were randomly assigned to either an ocrelizumab treatment group or a placebo control group."
    },
    article2: {
      title: "Efficacy of Ocrelizumab in Relapsing-Remitting Multiple Sclerosis",
      abstract: "This comprehensive study investigates the impact of ocrelizumab on disease activity among adults with relapsing-remitting multiple sclerosis. Over a two-year period, 500 participants between 18 and 55 years old were randomly divided into an ocrelizumab treatment group and a placebo control group to assess the effects of the medication on relapse rates and disability progression."
    },
    proximityScore: 1.0
  },
  { 
    id: 2, 
    article1: {
      title: "Ocrelizumab for Primary Progressive Multiple Sclerosis",
      abstract: "This randomized controlled trial evaluates the efficacy of ocrelizumab in treating primary progressive multiple sclerosis. The study included 200 participants with confirmed PPMS, comparing ocrelizumab interventions with standard care over a 120-week period."
    },
    article2: {
      title: "Ocrelizumab for Primary Progressive Multiple Sclerosis: A Clinical Trial",
      abstract: "This clinical trial investigates the effectiveness of ocrelizumab as a treatment for primary progressive multiple sclerosis. Two hundred individuals diagnosed with PPMS were randomly assigned to either an ocrelizumab intervention group or a control group receiving standard care, with outcomes assessed over a 120-week period."
    },
    proximityScore: 0.98
  },
  { 
    id: 3, 
    article1: {
      title: "Effects of Ocrelizumab on Fatigue in Multiple Sclerosis Patients",
      abstract: "This study investigates the impact of ocrelizumab on fatigue levels in patients with multiple sclerosis. The research involved 300 participants who received ocrelizumab infusions over a 12-month period, with regular assessments of fatigue markers and self-reported quality of life scores."
    },
    article2: {
      title: "Effects of Ocrelizumab on Fatigue in Multiple Sclerosis Patients",
      abstract: "This study investigates the impact of ocrelizumab on fatigue levels in patients with multiple sclerosis. The research involved 300 participants who received ocrelizumab infusions over a 12-month period, with regular assessments of fatigue markers and self-reported quality of life scores."
    },
    proximityScore: 1.0
  },
  { 
    id: 4, 
    article1: {
      title: "The Role of B-Cell Depletion in Multiple Sclerosis Treatment",
      abstract: "This comprehensive review examines the current understanding of B-cell depletion therapies, particularly ocrelizumab, in modulating multiple sclerosis progression. The analysis covers both relapsing-remitting and primary progressive MS, discussing the therapy's effects on various aspects of the disease and its potential implications for long-term disease management."
    },
    article2: {
      title: "B-Cell Depletion and Its Impact on Multiple Sclerosis Progression",
      abstract: "This extensive review explores the present knowledge regarding B-cell depletion therapies, with a focus on ocrelizumab, in regulating multiple sclerosis progression. The study encompasses both relapsing-remitting and primary progressive MS, analyzing the therapy's impact on different aspects of the disease and its potential significance for long-term management strategies."
    },
    proximityScore: 0.99
  },
  { 
    id: 5, 
    article1: {
      title: "Comparative Efficacy of Ocrelizumab and Other Disease-Modifying Therapies in Multiple Sclerosis",
      abstract: "This randomized controlled trial evaluates the effectiveness of ocrelizumab compared to other disease-modifying therapies in managing multiple sclerosis. The study included 250 participants with diagnosed MS, comparing ocrelizumab with interferon beta-1a and glatiramer acetate over a 24-month period."
    },
    article2: {
      title: "Comparative Efficacy of Ocrelizumab and Other Disease-Modifying Therapies in Multiple Sclerosis",
      abstract: "This randomized controlled trial evaluates the effectiveness of ocrelizumab compared to other disease-modifying therapies in managing multiple sclerosis. The study included 250 participants with diagnosed MS, comparing ocrelizumab with interferon beta-1a and glatiramer acetate over a 24-month period."
    },
    proximityScore: 1.0
  },
  { 
    id: 6, 
    article1: {
      title: "Safety Profile of Long-Term Ocrelizumab Use in Multiple Sclerosis",
      abstract: "This systematic review examines the long-term safety of ocrelizumab in treating multiple sclerosis. The analysis includes 30 clinical trials and observational studies with a total of 3,000 participants, investigating outcomes such as adverse events, infections, and malignancies over extended treatment periods."
    },
    article2: {
      title: "Long-Term Safety of Ocrelizumab in Multiple Sclerosis Treatment",
      abstract: "This comprehensive review explores the long-term safety implications of ocrelizumab use in multiple sclerosis treatment. The study analyzes data from 30 clinical trials and observational studies, encompassing 3,000 participants, and examines outcomes including adverse events, infection rates, and incidence of malignancies over prolonged treatment durations."
    },
    proximityScore: 0.95
  },
  { 
    id: 7, 
    article1: {
      title: "Ocrelizumab's Effect on Cognitive Function in Multiple Sclerosis",
      abstract: "This experimental study investigates the impact of ocrelizumab on cognitive function in multiple sclerosis patients. The research involved 100 participants who underwent cognitive assessments before and after ocrelizumab treatment, with subsequent tests to evaluate changes in memory, processing speed, and executive function."
    },
    article2: {
      title: "Cognitive Function Changes with Ocrelizumab Treatment in Multiple Sclerosis",
      abstract: "This experimental study explores how ocrelizumab affects cognitive function in individuals with multiple sclerosis. The investigation included 100 subjects who completed cognitive evaluations prior to and following ocrelizumab therapy, followed by assessments to measure alterations in memory, information processing speed, and executive functioning."
    },
    proximityScore: 0.97
  },
  { 
    id: 8, 
    article1: {
      title: "Cost-Effectiveness of Ocrelizumab in Multiple Sclerosis Management",
      abstract: "This meta-analysis evaluates the cost-effectiveness of ocrelizumab in managing multiple sclerosis compared to other disease-modifying therapies. The study synthesizes data from 50 economic evaluations and clinical trials, involving a total of 10,000 patients across various healthcare settings and countries."
    },
    article2: {
      title: "Ocrelizumab for Multiple Sclerosis Management: A Cost-Effectiveness Analysis",
      abstract: "This comprehensive meta-analysis assesses the cost-effectiveness of ocrelizumab-based interventions in the management of multiple sclerosis, compared to alternative disease-modifying therapies. The research compiles and analyzes data from 50 economic evaluations and clinical trials, encompassing 10,000 patients from diverse healthcare environments and geographical locations."
    },
    proximityScore: 0.96
  }
];

export const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Ocrelizumab and Other CD20+ B-Cell-Depleting Therapies in Multiple Sclerosis",
    abstract: "Selective depletion of CD20+ B cells by anti-CD20 monoclonal antibodies as monotherapy in multiple sclerosis (MS) profoundly suppresses acute inflammatory disease activity and signifies an important advance in the treatment of relapsing-remitting MS. Ocrelizumab, a humanized anti-CD20 monoclonal antibody, is also the first proven therapy to lessen disability progression in primary progressive MS-a breakthrough for patients with a disease that had no proven therapy. Ocrelizumab is generally well tolerated, with the most common adverse events experienced being infusion reactions and infections. In ocrelizumab trials in MS a numerical imbalance in the risk of malignancies was observed. In this article, we review advances in anti-CD20 B-cell-depleting biological therapies for MS, including ocrelizumab, rituximab, and ofatumumab.",
    date: "2017-10-01",
    authors: ["Jeffrey, M.", "Bruce, A.", "Stephen, M."],
    selected: false,
    abstractExpanded: false,
    studyType: 'RCT',
    pico: {
      population: "Patients with advanced multiple sclerosis",
      intervention: "Ocrelizumab combined with exercise therapy",
      comparator: "Standard ocrelizumab treatment alone",
      outcome: "Disease progression and quality of life",
      expanded: false
    },
    pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/28695471/"
  },
  {
    id: 2,
    title: "The importance of considering differences in study and patient characteristics before undertaking indirect treatment comparisons: a case study of siponimod for secondary progressive multiple sclerosis",
    abstract: "Background: Indirect treatment comparisons (ITCs) provide valuable evidence on comparative efficacy where head-to-head clinical trials do not exist; however, differences in patient populations may introduce bias. Therefore, it is essential to assess between-trial heterogeneity to determine the suitability of synthesizing ITC results. We provide an illustrative case study in multiple sclerosis (MS) where we assess the feasibility of conducting ITCs between siponimod and interferon beta-1b (IFN β-1b) and between siponimod and ocrelizumab.\n Methods: We assessed the feasibility of conducting ITCs using standard unadjusted methods (e.g. Bucher or network meta-analysis [NMA]) as well as matching-adjusted indirect comparisons (MAICs) using individual patient data (IPD) from the siponimod (EXPAND) trial, based on guidance from NICE. Time to confirmed disability progression (CDP) at 3 or 6 months was assessed.Results: Bucher ITCs and NMAs, which rely on summary-level data, were not able to account for important cross-trial differences. Comparisons between siponimod and IFN β-1b were feasible using MAIC; the HRs (95% CI) for CDP-6 and CDP-3 were 0.55 (0.33-0.91) and 0.82 (0.42-1.63), respectively. ITCs were not feasible between siponimod and ocrelizumab because study designs and patient populations were too dissimilar to conduct a reliable ITC.Conclusions: This study highlights the importance of conducting a detailed feasibility assessment before undertaking ITCs to illuminate when excessive between-trial heterogeneity would cause biased results. MAIC was performed for siponimod and IFN β-1b in the absence of a head-to-head trial and was considered a more valid approach than a traditional ITC to examine comparative effectiveness.",
    date: "2023-04-02",
    authors: ["Brown, E.", "Davis, M."],
    selected: false,
    abstractExpanded: false,
    studyType: 'Meta-analysis',
    pico: {
      population: "Individuals with relapsing-remitting multiple sclerosis",
      intervention: "Ocrelizumab",
      comparator: "Placebo or other disease-modifying therapies",
      outcome: "Relapse rates and disease progression",
      expanded: false
    },
    pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/32216597/"
  },
  {
    id: 3,
    title: "The Impact of Ocrelizumab on Brain Atrophy in Primary Progressive Multiple Sclerosis",
    abstract: "This randomized controlled trial investigates the effects of ocrelizumab on brain atrophy rates in primary progressive multiple sclerosis. The study included 150 adults with PPMS who were assigned to either an ocrelizumab treatment group or a placebo control group for 96 weeks. Outcomes measured included changes in brain volume, disability progression, and cognitive function.",
    date: "2023-06-10",
    authors: ["Wilson, T.", "Taylor, M.", "Anderson, K."],
    selected: false,
    abstractExpanded: false,
    studyType: 'RCT',
    pico: {
      population: "Adults with primary progressive multiple sclerosis",
      intervention: "Ocrelizumab",
      comparator: "Placebo",
      outcome: "Brain atrophy rates and disability progression",
      expanded: false
    },
    pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/"
  },
  {
    id: 4,
    title: "Long-Term Safety and Efficacy of Ocrelizumab in Multiple Sclerosis: A 5-Year Follow-Up Study",
    abstract: "This long-term follow-up study evaluates the safety and efficacy of ocrelizumab in patients with multiple sclerosis over a 5-year period. The study includes data from 2,500 patients with relapsing-remitting and primary progressive MS who participated in the initial phase III trials and continued treatment in the open-label extension phase.",
    date: "2023-03-22",
    authors: ["Thomas, R.", "Moore, J.", "Jackson, L."],
    selected: false,
    abstractExpanded: false,
    studyType: 'Cohort study',
    pico: {
      population: "Patients with relapsing-remitting and primary progressive multiple sclerosis",
      intervention: "Long-term ocrelizumab treatment",
      comparator: "Historical data and initial trial results",
      outcome: "Long-term safety profile and efficacy measures",
      expanded: false
    },
    pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/"
  },
  {
    id: 5,
    title: "Ocrelizumab's Effect on Fatigue and Cognitive Function in Multiple Sclerosis",
    abstract: "This observational study investigates the impact of ocrelizumab on fatigue levels and cognitive function in patients with multiple sclerosis. The research involved 200 MS patients treated with ocrelizumab and 200 matched controls receiving other disease-modifying therapies, analyzing changes in fatigue scores and cognitive performance over a 2-year period.",
    date: "2023-07-05",
    authors: ["White, H.", "Harris, P.", "Clark, S."],
    selected: false,
    abstractExpanded: false,
    studyType: 'Case-control study',
    pico: {
      population: "Patients with multiple sclerosis",
      intervention: "Ocrelizumab treatment",
      comparator: "Other disease-modifying therapies",
      outcome: "Changes in fatigue levels and cognitive function",
      expanded: false
    },
    pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/"
  },
  {
    id: 6,
    title: "Ocrelizumab in Pediatric Multiple Sclerosis: A Pilot Study",
    abstract: "This pilot study investigates the safety and efficacy of ocrelizumab in pediatric patients with multiple sclerosis. The study included 30 patients aged 10-17 with relapsing-remitting MS, who received weight-based dosing of ocrelizumab over 24 weeks. Primary outcomes included safety profile and changes in relapse rate.",
    date: "2023-08-20",
    authors: ["Rodriguez, C.", "Lee, S.", "Patel, A."],
    selected: false,
    abstractExpanded: false,
    studyType: 'Case series',
    pico: {
      population: "Pediatric patients with relapsing-remitting multiple sclerosis",
      intervention: "Weight-based ocrelizumab treatment",
      comparator: "Historical controls",
      outcome: "Safety profile and relapse rate",
      expanded: false
    },
    pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/"
  },
  {
    id: 7,
    title: "Ocrelizumab and Pregnancy Outcomes in Multiple Sclerosis: A Retrospective Analysis",
    abstract: "This retrospective study examines pregnancy outcomes in women with multiple sclerosis who were exposed to ocrelizumab before or during pregnancy. The study analyzed data from 150 pregnancies in women who received ocrelizumab within 6 months prior to conception or during pregnancy.",
    date: "2023-09-05",
    authors: ["Garcia, M.", "Thompson, R.", "Chen, L."],
    selected: false,
    abstractExpanded: false,
    studyType: 'Cohort study',
    pico: {
      population: "Pregnant women with multiple sclerosis exposed to ocrelizumab",
      intervention: "Ocrelizumab exposure",
      comparator: "General MS population pregnancy outcomes",
      outcome: "Pregnancy and fetal outcomes, postpartum disease activity",
      expanded: false
    },
    pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/"
  },
  {
    id: 8,
    title: "Comparative Effectiveness of Ocrelizumab vs Natalizumab in Highly Active Relapsing Multiple Sclerosis",
    abstract: "This head-to-head study compares the effectiveness of ocrelizumab and natalizumab in patients with highly active relapsing multiple sclerosis. The study included 300 patients randomized to receive either ocrelizumab or natalizumab over 2 years.",
    date: "2023-10-12",
    authors: ["Kim, J.", "Novak, I.", "Fernandez, O."],
    selected: false,
    abstractExpanded: false,
    studyType: 'RCT',
    pico: {
      population: "Patients with highly active relapsing multiple sclerosis",
      intervention: "Ocrelizumab",
      comparator: "Natalizumab",
      outcome: "Relapse rate and disability progression",
      expanded: false
    },
    pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/"
  },
  {
    id: 9,
    title: "Long-term Effects of Ocrelizumab on Disability in Primary Progressive Multiple Sclerosis",
    abstract: "This extension study evaluates the long-term effects of ocrelizumab on disability progression in patients with primary progressive multiple sclerosis. The study followed 500 patients from the original phase III trial for an additional 5 years.",
    date: "2023-11-18",
    authors: ["Smith, A.", "Jones, B.", "Williams, C."],
    selected: false,
    abstractExpanded: false,
    studyType: 'Cohort study',
    pico: {
      population: "Patients with primary progressive multiple sclerosis",
      intervention: "Long-term ocrelizumab treatment",
      comparator: "Historical data from untreated PPMS cohorts",
      outcome: "Time to confirmed disability progression",
      expanded: false
    },
    pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/"
  },
  {
    id: 10,
    title: "Ocrelizumab and Risk of Infections: A Comprehensive Safety Analysis",
    abstract: "This comprehensive safety analysis focuses on the risk of infections associated with ocrelizumab treatment in multiple sclerosis. The study pooled data from clinical trials and post-marketing surveillance, including over 5000 patients treated with ocrelizumab.",
    date: "2023-12-01",
    authors: ["Brown, E.", "Miller, F.", "Davis, G."],
    selected: false,
    abstractExpanded: false,
    studyType: 'Meta-analysis',
    pico: {
      population: "Multiple sclerosis patients treated with ocrelizumab",
      intervention: "Ocrelizumab treatment",
      comparator: "Other MS treatments and general population",
      outcome: "Incidence and types of infections",
      expanded: false
    },
    pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/"
  }
];
