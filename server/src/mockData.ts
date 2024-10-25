import { DuplicatePair } from './components/DuplicateAnalysis';
import { Document } from './components/DocumentAnalysis';

export const mockDuplicatePairs: DuplicatePair[] = [
  { 
    id: 1, 
    article1: {
      title: "Impact of Exercise on Cardiovascular Health",
      abstract: "This study examines the effects of regular exercise on heart health in adults with sedentary lifestyles. The research, conducted over a 12-month period, involved 500 participants aged 30-60 who were randomly assigned to either an exercise intervention group or a control group."
    },
    article2: {
      title: "Impact of Exercise on Cardiovascular Health",
      abstract: "This comprehensive study investigates the impact of regular physical activity on cardiovascular health among sedentary adults. Over a one-year period, 500 participants between 30 and 60 years old were randomly divided into an exercise group and a control group to assess the effects of consistent exercise routines."
    },
    proximityScore: 1.0
  },
  { 
    id: 2, 
    article1: {
      title: "Cognitive Behavioral Therapy for Insomnia",
      abstract: "This randomized controlled trial evaluates the efficacy of cognitive behavioral therapy (CBT) in treating chronic insomnia. The study included 200 participants with persistent sleep difficulties, comparing CBT interventions with standard sleep hygiene education."
    },
    article2: {
      title: "Cognitive Behavioral Therapy for Insomnia, a study",
      abstract: "This clinical trial investigates the effectiveness of cognitive behavioral therapy (CBT) as a treatment for chronic insomnia. Two hundred individuals suffering from long-term sleep problems were randomly assigned to either a CBT intervention group or a control group receiving standard sleep hygiene advice."
    },
    proximityScore: 0.98
  },
  { 
    id: 3, 
    article1: {
      title: "Effects of Mindfulness Meditation on Stress Reduction",
      abstract: "This study investigates the impact of mindfulness meditation practices on stress levels in working professionals. The research involved 300 participants who engaged in daily meditation sessions over a 6-month period, with regular assessments of stress markers and self-reported well-being scores."
    },
    article2: {
      title: "Effects of Mindfulness Meditation on Stress Reduction",
      abstract: "This study investigates the impact of mindfulness meditation practices on stress levels in working professionals. The research involved 300 participants who engaged in daily meditation sessions over a 6-month period, with regular assessments of stress markers and self-reported well-being scores."
    },
    proximityScore: 1.0
  },
  { 
    id: 4, 
    article1: {
      title: "The Role of Vitamin D in Immune Function",
      abstract: "This comprehensive review examines the current understanding of vitamin D's role in modulating immune responses. The analysis covers both innate and adaptive immunity, discussing the vitamin's effects on various immune cell types and its potential implications for autoimmune diseases and infectious disease resistance."
    },
    article2: {
      title: "Vitamin D and Its Impact on the Immune System",
      abstract: "This extensive review explores the present knowledge regarding vitamin D's influence on immune system regulation. The study encompasses both innate and adaptive immunity, analyzing the vitamin's impact on different immune cell populations and its potential significance for autoimmune disorders and resistance to infectious diseases."
    },
    proximityScore: 0.99
  },
  { 
    id: 5, 
    article1: {
      title: "Efficacy of Plant-Based Diets in Type 2 Diabetes Management",
      abstract: "This randomized controlled trial evaluates the effectiveness of plant-based diets in managing type 2 diabetes. The study included 250 participants with diagnosed type 2 diabetes, comparing a whole-food, plant-based diet intervention with standard dietary recommendations over a 12-month period."
    },
    article2: {
      title: "Efficacy of Plant-Based Diets in Type 2 Diabetes Management",
      abstract: "This randomized controlled trial evaluates the effectiveness of plant-based diets in managing type 2 diabetes. The study included 250 participants with diagnosed type 2 diabetes, comparing a whole-food, plant-based diet intervention with standard dietary recommendations over a 12-month period."
    },
    proximityScore: 1.0
  },
  { 
    id: 6, 
    article1: {
      title: "The Effects of Probiotics on Gut Health",
      abstract: "This systematic review examines the impact of probiotic supplementation on various aspects of gut health. The analysis includes 30 randomized controlled trials with a total of 3,000 participants, investigating outcomes such as gut microbiome composition, intestinal permeability, and inflammatory markers."
    },
    article2: {
      title: "Probiotic Supplementation and Its Impact on Intestinal Health",
      abstract: "This comprehensive review explores the effects of probiotic supplements on different facets of intestinal health. The study analyzes data from 30 randomized controlled trials, encompassing 3,000 participants, and examines outcomes including gut flora composition, intestinal barrier function, and inflammatory indicators."
    },
    proximityScore: 0.95
  },
  { 
    id: 7, 
    article1: {
      title: "The Role of Sleep in Memory Consolidation",
      abstract: "This experimental study investigates the impact of sleep on memory consolidation processes. The research involved 100 participants who were subjected to various sleep conditions after learning tasks, with subsequent memory tests to assess retention and recall abilities."
    },
    article2: {
      title: "Sleep's Influence on Memory Consolidation",
      abstract: "This experimental study explores how sleep affects memory consolidation mechanisms. The investigation included 100 subjects who underwent different sleep protocols following learning exercises, followed by memory assessments to evaluate retention and recall capabilities."
    },
    proximityScore: 0.97
  },
  { 
    id: 8, 
    article1: {
      title: "Effectiveness of Telehealth Interventions in Chronic Disease Management",
      abstract: "This meta-analysis evaluates the efficacy of telehealth interventions in managing chronic diseases such as diabetes, hypertension, and heart failure. The study synthesizes data from 50 randomized controlled trials, involving a total of 10,000 patients across various healthcare settings."
    },
    article2: {
      title: "Telehealth Interventions for Chronic Disease Management: A Meta-Analysis",
      abstract: "This comprehensive meta-analysis assesses the effectiveness of telehealth-based interventions in the management of chronic conditions including diabetes, hypertension, and heart failure. The research compiles and analyzes data from 50 randomized controlled trials, encompassing 10,000 patients from diverse healthcare environments."
    },
    proximityScore: 0.96
  }
];

export const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Effects of Immunotherapy Combined with High-Intensity Interval Training on Advanced Melanoma",
    abstract: "This study investigates the impact of combining immunotherapy with high-intensity interval training (HIIT) on various markers of tumor progression and overall survival in patients with advanced melanoma. The research involved 100 participants who underwent a 12-week HIIT program alongside standard immunotherapy treatment, with regular assessments of tumor size, immune cell activation, and quality of life measures.",
    date: "2023-05-15",
    authors: ["Smith, J.", "Johnson, A.", "Williams, R."],
    selected: false,
    abstractExpanded: false,
    studyType: 'rct',
    pico: {
      population: "Patients with advanced melanoma",
      intervention: "Immunotherapy combined with high-intensity interval training (HIIT)",
      comparator: "Standard immunotherapy treatment alone",
      outcome: "Tumor progression and overall survival",
      expanded: false
    }
  },
  {
    id: 2,
    title: "Efficacy of Mindfulness-Based Stress Reduction in Anxiety Disorders",
    abstract: "This meta-analysis examines the effectiveness of mindfulness-based stress reduction (MBSR) techniques in treating various anxiety disorders. The study synthesizes data from 20 randomized controlled trials, involving a total of 1,500 participants diagnosed with generalized anxiety disorder, social anxiety disorder, or panic disorder.",
    date: "2023-04-02",
    authors: ["Brown, E.", "Davis, M."],
    selected: false,
    abstractExpanded: false,
    studyType: 'meta-analysis',
    pico: {
      population: "Individuals with anxiety disorders",
      intervention: "Mindfulness-based stress reduction (MBSR)",
      comparator: "Standard treatment or waitlist control",
      outcome: "Anxiety symptoms and quality of life",
      expanded: false
    }
  },
  {
    id: 3,
    title: "The Impact of Intermittent Fasting on Metabolic Health",
    abstract: "This randomized controlled trial investigates the effects of intermittent fasting on various markers of metabolic health. The study included 150 overweight adults who were assigned to either a time-restricted feeding group or a control group following a standard diet for 16 weeks. Outcomes measured included changes in body weight, insulin sensitivity, and lipid profiles. Participants in the intermittent fasting group were instructed to restrict their daily food intake to an 8-hour window, typically from 12 pm to 8 pm, while the control group maintained their usual eating patterns. Both groups received counseling on maintaining a balanced diet without calorie restrictions. Anthropometric measurements, blood samples, and oral glucose tolerance tests were conducted at baseline, 8 weeks, and 16 weeks. Results showed that the intermittent fasting group experienced significant reductions in body weight (mean loss of 4.2 kg) compared to the control group (mean loss of 0.8 kg). Fasting insulin levels decreased by 31% in the intermittent fasting group, indicating improved insulin sensitivity. The intermittent fasting group also showed more favorable changes in lipid profiles, with increases in HDL cholesterol and decreases in LDL cholesterol and triglycerides. Additionally, markers of inflammation, such as C-reactive protein, were significantly reduced in the intermittent fasting group. Participants reported improved energy levels and better sleep quality, although some initially experienced difficulties adapting to the fasting schedule. Adherence to the intermittent fasting protocol was high, with 85% of participants completing the 16-week intervention. These findings suggest that intermittent fasting can be an effective strategy for improving metabolic health in overweight adults, potentially reducing the risk of type 2 diabetes and cardiovascular diseases.",
    date: "2023-06-10",
    authors: ["Wilson, T.", "Taylor, M.", "Anderson, K."],
    selected: false,
    abstractExpanded: false,
    studyType: 'rct',
    pico: {
      population: "Overweight adults",
      intervention: "Intermittent fasting (time-restricted feeding)",
      comparator: "Standard diet",
      outcome: "Metabolic health markers",
      expanded: false
    }
  },
  {
    id: 4,
    title: "Effectiveness of Cognitive Behavioral Therapy for Chronic Pain Management",
    abstract: "This systematic review and meta-analysis evaluates the efficacy of cognitive behavioral therapy (CBT) in managing chronic pain conditions. The study analyzes data from 30 randomized controlled trials, encompassing a total of 2,500 patients with various chronic pain disorders, including fibromyalgia, lower back pain, and osteoarthritis. The included studies compared CBT interventions to standard pain management approaches, waitlist controls, or other psychological interventions. CBT protocols typically involved 8-12 weekly sessions focusing on pain education, cognitive restructuring, and behavioral techniques such as activity pacing and relaxation training. The primary outcomes assessed were pain intensity and quality of life, measured using standardized scales. Secondary outcomes included depression, anxiety, and pain-related disability. The meta-analysis employed random-effects models to account for heterogeneity between studies. Results indicated that CBT was associated with significant reductions in pain intensity compared to control conditions, with a moderate effect size (standardized mean difference = 0.42, 95% CI: 0.33-0.51). Improvements in quality of life were also observed, with CBT participants reporting better physical and emotional functioning. Subgroup analyses revealed that CBT was effective across different chronic pain conditions, although the magnitude of effect varied somewhat. Long-term follow-up data, available for a subset of studies, suggested that the benefits of CBT were largely maintained at 6-12 months post-intervention. The review also examined factors influencing treatment efficacy, such as treatment duration, delivery format (individual vs. group), and therapist expertise. While some variability was observed, CBT consistently demonstrated beneficial effects across different implementation conditions. Additionally, the analysis explored potential mechanisms of change, with improvements in pain catastrophizing and self-efficacy emerging as important mediators of treatment outcomes. These findings support the use of CBT as an evidence-based intervention for chronic pain management, offering a non-pharmacological approach to improving pain outcomes and overall quality of life for individuals with chronic pain conditions.",
    date: "2023-03-22",
    authors: ["Thomas, R.", "Moore, J.", "Jackson, L."],
    selected: false,
    abstractExpanded: false,
    studyType: 'meta-analysis',
    pico: {
      population: "Patients with chronic pain conditions",
      intervention: "Cognitive behavioral therapy (CBT)",
      comparator: "Standard pain management or waitlist control",
      outcome: "Pain intensity and quality of life",
      expanded: false
    }
  },
  {
    id: 5,
    title: "The Role of Gut Microbiome in Autism Spectrum Disorders",
    abstract: "This observational study investigates the potential link between gut microbiome composition and autism spectrum disorders (ASD). The research involved 200 children with ASD and 200 neurotypical controls, analyzing their gut microbiome profiles through stool sample analysis and correlating the findings with ASD symptoms and severity. Participants were recruited from multiple clinical centers specializing in neurodevelopmental disorders. Stool samples were collected and analyzed using 16S rRNA gene sequencing to characterize the gut microbiome composition. ASD symptoms were assessed using standardized diagnostic tools, including the Autism Diagnostic Observation Schedule (ADOS) and the Social Responsiveness Scale (SRS). Additionally, parents completed questionnaires regarding their child's gastrointestinal symptoms, dietary habits, and medication use. The study found significant differences in gut microbiome diversity and composition between children with ASD and neurotypical controls. Children with ASD showed reduced microbial diversity and an altered abundance of specific bacterial taxa. Notably, there was a decreased abundance of Bifidobacterium and Prevotella species, and an increased abundance of Clostridium species in the ASD group. These microbial differences were correlated with ASD symptom severity, particularly in the domains of social communication and repetitive behaviors. Furthermore, children with ASD who experienced gastrointestinal symptoms showed more pronounced alterations in their gut microbiome compared to those without such symptoms. The study also explored potential confounding factors, such as diet and antibiotic use, and found that these factors partially, but not fully, explained the observed microbiome differences. Functional analysis of the microbiome data suggested alterations in metabolic pathways related to short-chain fatty acid production and amino acid metabolism in the ASD group. While this observational study cannot establish causality, it provides compelling evidence for a relationship between gut microbiome composition and ASD, suggesting potential avenues for future research into microbiome-based interventions for ASD management.",
    date: "2023-07-05",
    authors: ["White, H.", "Harris, P.", "Clark, S."],
    selected: false,
    abstractExpanded: false,
    studyType: 'observational',
    pico: {
      population: "Children with autism spectrum disorders and neurotypical controls",
      intervention: "N/A (observational study)",
      comparator: "Neurotypical children",
      outcome: "Gut microbiome composition and correlation with ASD symptoms",
      expanded: false
    }
  }
];