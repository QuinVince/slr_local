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
    title: "Effects of Ocrelizumab Combined with Exercise Therapy on Advanced Multiple Sclerosis",
    abstract: "This study investigates the impact of combining ocrelizumab with exercise therapy on various markers of disease progression and overall quality of life in patients with advanced multiple sclerosis. The research involved 100 participants who underwent a 12-week exercise program alongside standard ocrelizumab treatment, with regular assessments of disability progression, brain atrophy, and quality of life measures.",
    date: "2023-05-15",
    authors: ["Smith, J.", "Johnson, A.", "Williams, R."],
    selected: false,
    abstractExpanded: false,
    studyType: 'rct',
    pico: {
      population: "Patients with advanced multiple sclerosis",
      intervention: "Ocrelizumab combined with exercise therapy",
      comparator: "Standard ocrelizumab treatment alone",
      outcome: "Disease progression and quality of life",
      expanded: false
    }
  },
  {
    id: 2,
    title: "Efficacy of Ocrelizumab in Reducing Relapses in Relapsing-Remitting Multiple Sclerosis",
    abstract: "This meta-analysis examines the effectiveness of ocrelizumab in reducing relapse rates in patients with relapsing-remitting multiple sclerosis. The study synthesizes data from 20 randomized controlled trials, involving a total of 1,500 participants diagnosed with RRMS, comparing ocrelizumab to placebo and other disease-modifying therapies.",
    date: "2023-04-02",
    authors: ["Brown, E.", "Davis, M."],
    selected: false,
    abstractExpanded: false,
    studyType: 'meta-analysis',
    pico: {
      population: "Individuals with relapsing-remitting multiple sclerosis",
      intervention: "Ocrelizumab",
      comparator: "Placebo or other disease-modifying therapies",
      outcome: "Relapse rates and disease progression",
      expanded: false
    }
  },
  {
    id: 3,
    title: "The Impact of Ocrelizumab on Brain Atrophy in Primary Progressive Multiple Sclerosis",
    abstract: "This randomized controlled trial investigates the effects of ocrelizumab on brain atrophy rates in primary progressive multiple sclerosis. The study included 150 adults with PPMS who were assigned to either an ocrelizumab treatment group or a placebo control group for 96 weeks. Outcomes measured included changes in brain volume, disability progression, and cognitive function. Participants in the ocrelizumab group received intravenous infusions every 24 weeks, while the control group received placebo infusions. Both groups underwent regular MRI scans, clinical assessments, and cognitive testing. Results showed that the ocrelizumab group experienced significantly lower rates of brain atrophy (mean reduction of 0.9% vs 1.3% in the placebo group) over the study period. Disability progression, as measured by the Expanded Disability Status Scale (EDSS), was also slower in the ocrelizumab group. Cognitive function, particularly in areas of processing speed and memory, showed relative preservation in the ocrelizumab group compared to the placebo group. Additionally, ocrelizumab was associated with a reduction in new or enlarging T2 lesions on MRI. The safety profile was consistent with previous studies, with infusion-related reactions being the most common adverse event. These findings suggest that ocrelizumab can effectively slow brain atrophy and disability progression in patients with primary progressive multiple sclerosis, potentially offering a valuable treatment option for this challenging form of the disease.",
    date: "2023-06-10",
    authors: ["Wilson, T.", "Taylor, M.", "Anderson, K."],
    selected: false,
    abstractExpanded: false,
    studyType: 'rct',
    pico: {
      population: "Adults with primary progressive multiple sclerosis",
      intervention: "Ocrelizumab",
      comparator: "Placebo",
      outcome: "Brain atrophy rates and disability progression",
      expanded: false
    }
  },
  {
    id: 4,
    title: "Long-Term Safety and Efficacy of Ocrelizumab in Multiple Sclerosis: A 5-Year Follow-Up Study",
    abstract: "This long-term follow-up study evaluates the safety and efficacy of ocrelizumab in patients with multiple sclerosis over a 5-year period. The study includes data from 2,500 patients with relapsing-remitting and primary progressive MS who participated in the initial phase III trials and continued treatment in the open-label extension phase. The primary outcomes assessed were long-term safety profile, annualized relapse rate, and disability progression. Secondary outcomes included MRI activity, patient-reported outcomes, and work productivity. Safety data were collected through adverse event reporting and regular laboratory assessments. Efficacy was measured using the Expanded Disability Status Scale (EDSS), the Multiple Sclerosis Functional Composite (MSFC), and brain MRI scans. Results indicated that the safety profile of ocrelizumab remained consistent with the initial trials, with no new safety signals emerging over the 5-year period. The most common adverse events were infusion-related reactions and upper respiratory tract infections. The annualized relapse rate remained low throughout the study period, with a mean of 0.14 relapses per year. Disability progression was significantly slowed, with 76% of patients showing no confirmed disability progression at 5 years. MRI data showed sustained reduction in new or enlarging T2 lesions and gadolinium-enhancing lesions. Patient-reported outcomes demonstrated improvements or stability in quality of life measures and reduced fatigue. Work productivity assessments showed that a higher proportion of patients maintained employment compared to natural history data of untreated MS populations. Subgroup analyses revealed that the benefits were observed across different patient demographics and disease characteristics. While this study provides valuable long-term data, limitations include the open-label design and potential bias due to the selection of patients who continued treatment. Nevertheless, these findings support the long-term use of ocrelizumab in multiple sclerosis, demonstrating sustained efficacy and a manageable safety profile over an extended treatment period.",
    date: "2023-03-22",
    authors: ["Thomas, R.", "Moore, J.", "Jackson, L."],
    selected: false,
    abstractExpanded: false,
    studyType: 'observational',
    pico: {
      population: "Patients with relapsing-remitting and primary progressive multiple sclerosis",
      intervention: "Long-term ocrelizumab treatment",
      comparator: "Historical data and initial trial results",
      outcome: "Long-term safety profile and efficacy measures",
      expanded: false
    }
  },
  {
    id: 5,
    title: "Ocrelizumab's Effect on Fatigue and Cognitive Function in Multiple Sclerosis",
    abstract: "This observational study investigates the impact of ocrelizumab on fatigue levels and cognitive function in patients with multiple sclerosis. The research involved 200 MS patients treated with ocrelizumab and 200 matched controls receiving other disease-modifying therapies, analyzing changes in fatigue scores and cognitive performance over a 2-year period. Participants were recruited from multiple MS clinics across the country. Fatigue was assessed using the Modified Fatigue Impact Scale (MFIS) and the Fatigue Severity Scale (FSS). Cognitive function was evaluated using a comprehensive neuropsychological battery, including tests of processing speed, attention, memory, and executive function. Assessments were conducted at baseline, 12 months, and 24 months. The study found significant improvements in fatigue scores in the ocrelizumab group compared to the control group, with a mean reduction of 30% in MFIS scores at 24 months. Cognitive function showed a more mixed picture, with significant improvements in processing speed and attention, but more modest effects on memory and executive function. Notably, patients with higher baseline fatigue levels showed the greatest improvements in both fatigue and cognitive measures. MRI data, collected on a subset of participants, showed correlations between reductions in T2 lesion load and improvements in fatigue and cognitive scores in the ocrelizumab group. The study also explored potential mechanisms, suggesting that the reduction in CNS inflammation and preservation of brain volume associated with ocrelizumab treatment may contribute to these improvements. Quality of life measures, including work productivity and social engagement, showed corresponding improvements in the ocrelizumab group. While this observational study cannot establish causality, it provides compelling evidence for the positive effects of ocrelizumab on fatigue and aspects of cognitive function in MS patients, suggesting potential benefits beyond its known effects on relapse rates and disability progression.",
    date: "2023-07-05",
    authors: ["White, H.", "Harris, P.", "Clark, S."],
    selected: false,
    abstractExpanded: false,
    studyType: 'observational',
    pico: {
      population: "Patients with multiple sclerosis",
      intervention: "Ocrelizumab treatment",
      comparator: "Other disease-modifying therapies",
      outcome: "Changes in fatigue levels and cognitive function",
      expanded: false
    }
  }
];

