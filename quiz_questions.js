const quizQuestions = [
  {
    question: "What is CRISPR primarily used for?",
    options: ["Gene editing", "Protein synthesis", "Cell division", "RNA transcription"],
    correctIndex: 0,
    explanation: "CRISPR is a revolutionary gene-editing technology that allows precise DNA modifications."
  },
  {
    question: "Which principle is fundamental to BIO/ACC?",
    options: ["Decentralization", "Centralization", "Restriction", "Limitation"],
    correctIndex: 0,
    explanation: "Decentralization of biopower is a core principle of BIO/ACC philosophy."
  },
  {
    question: "What is synthetic biology?",
    options: ["Engineering biological systems", "Natural selection", "Spontaneous mutation", "Genetic drift"],
    correctIndex: 0,
    explanation: "Synthetic biology involves engineering biological components and systems that don't exist in nature."
  },
  {
    question: "What is the main goal of DeSci?",
    options: ["Democratizing science", "Restricting research", "Centralizing control", "Limiting access"],
    correctIndex: 0,
    explanation: "DeSci aims to democratize science through decentralized research and open access."
  },
  {
    question: "Which technology is crucial for DIY bio experiments?",
    options: ["PCR machine", "Smartphone", "Social media", "Virtual reality"],
    correctIndex: 0,
    explanation: "PCR machines are essential for DNA amplification in DIY bio experiments."
  },
  {
    question: "What is biohacking?",
    options: ["Self-experimentation", "Computer hacking", "Social engineering", "Data mining"],
    correctIndex: 0,
    explanation: "Biohacking involves self-experimentation and modification of biological systems."
  },
  {
    question: "What is the primary goal of longevity research?",
    options: ["Extending lifespan", "Cosmetic enhancement", "Weight loss", "Muscle growth"],
    correctIndex: 0,
    explanation: "Longevity research focuses on extending human lifespan through biological interventions."
  },
  {
    question: "What is optogenetics used for?",
    options: ["Controlling neurons with light", "Improving vision", "Solar energy", "Light therapy"],
    correctIndex: 0,
    explanation: "Optogenetics allows control of neurons using light-sensitive proteins."
  },
  {
    question: "What is bioprinting?",
    options: ["3D printing biological tissues", "DNA sequencing", "Protein synthesis", "Cell culture"],
    correctIndex: 0,
    explanation: "Bioprinting uses 3D printing technology to create biological tissues and structures."
  },
  {
    question: "What is the main application of mRNA technology?",
    options: ["Vaccine development", "Gene editing", "Cloning", "Protein extraction"],
    correctIndex: 0,
    explanation: "mRNA technology is primarily used in vaccine development and therapeutic applications."
  },
  {
    question: "What is the purpose of a bioreactor?",
    options: ["Growing organisms", "Generating electricity", "Water purification", "Waste disposal"],
    correctIndex: 0,
    explanation: "Bioreactors provide controlled environments for growing organisms and biological processes."
  },
  {
    question: "What is metabolic engineering?",
    options: ["Optimizing cellular processes", "Exercise science", "Nutrition planning", "Energy production"],
    correctIndex: 0,
    explanation: "Metabolic engineering involves optimizing cellular metabolic processes."
  },
  {
    question: "What is the main goal of tissue engineering?",
    options: ["Regenerating tissues", "Genetic modification", "Drug development", "Protein synthesis"],
    correctIndex: 0,
    explanation: "Tissue engineering aims to regenerate damaged tissues and organs."
  },
  {
    question: "What is biomimicry?",
    options: ["Imitating nature", "Artificial life", "Synthetic biology", "Genetic engineering"],
    correctIndex: 0,
    explanation: "Biomimicry involves imitating natural biological designs and processes."
  },
  {
    question: "What is the primary use of nanobiotechnology?",
    options: ["Molecular manipulation", "Drug delivery", "Imaging", "Gene therapy"],
    correctIndex: 0,
    explanation: "Nanobiotechnology enables manipulation of biological systems at molecular scale."
  },
  {
    question: "What is the main principle of open science?",
    options: ["Sharing research freely", "Patent protection", "Data restriction", "Limited access"],
    correctIndex: 0,
    explanation: "Open science promotes free sharing of research data and methods."
  },
  {
    question: "What is biocomputing?",
    options: ["Using biological materials for computation", "Regular computing", "Cloud computing", "Quantum computing"],
    correctIndex: 0,
    explanation: "Biocomputing uses biological materials and processes for computational tasks."
  },
  {
    question: "What is the goal of neuroenhancement?",
    options: ["Improving brain function", "Physical strength", "Immune response", "Metabolic rate"],
    correctIndex: 0,
    explanation: "Neuroenhancement aims to improve cognitive function and brain performance."
  },
  {
    question: "What is synthetic genomics?",
    options: ["Creating artificial genomes", "Natural selection", "Gene therapy", "DNA sequencing"],
    correctIndex: 0,
    explanation: "Synthetic genomics involves creating artificial genetic sequences and genomes."
  },
  {
    question: "What is bioelectronics?",
    options: ["Biological-electronic interfaces", "Electronic devices", "Computer chips", "Circuit boards"],
    correctIndex: 0,
    explanation: "Bioelectronics combines biology with electronic devices and systems."
  },
  {
    question: "What is the role of epigenetics in BIO/ACC?",
    options: ["Gene expression control", "DNA sequencing", "Protein folding", "Cell division"],
    correctIndex: 0,
    explanation: "Epigenetics studies how environmental factors control gene expression without changing DNA sequence."
  },
  {
    question: "Which technology enables direct brain-computer interfaces?",
    options: ["Neural implants", "Virtual reality", "Augmented reality", "Quantum computing"],
    correctIndex: 0,
    explanation: "Neural implants allow direct communication between the brain and external devices."
  },
  {
    question: "What is the primary goal of xenotransplantation?",
    options: ["Cross-species organ transplants", "Gene therapy", "Stem cell research", "Protein synthesis"],
    correctIndex: 0,
    explanation: "Xenotransplantation aims to use animal organs for human transplantation."
  },
  {
    question: "What is the main focus of optogenetics?",
    options: ["Light-controlled neurons", "Visual processing", "Optical computing", "Light therapy"],
    correctIndex: 0,
    explanation: "Optogenetics uses light to control genetically modified neurons."
  },
  {
    question: "What is the purpose of CRISPR-Cas9?",
    options: ["Gene editing", "Protein synthesis", "Cell division", "DNA replication"],
    correctIndex: 0,
    explanation: "CRISPR-Cas9 is a precise gene-editing tool that can modify DNA sequences."
  },
  {
    question: "What is synthetic biology's main goal?",
    options: ["Engineering life forms", "Natural selection", "Evolution study", "Genetic testing"],
    correctIndex: 0,
    explanation: "Synthetic biology aims to design and engineer new biological systems."
  },
  {
    question: "What characterizes biohacking spaces?",
    options: ["Community access", "Corporate control", "Limited access", "Government oversight"],
    correctIndex: 0,
    explanation: "Biohacking spaces emphasize community access and democratized science."
  },
  {
    question: "What is the focus of regenerative medicine?",
    options: ["Tissue regeneration", "Drug development", "Surgery", "Diagnostic testing"],
    correctIndex: 0,
    explanation: "Regenerative medicine focuses on repairing or replacing damaged tissues and organs."
  },
  {
    question: "What is the main application of biosensors?",
    options: ["Biological monitoring", "Weather tracking", "Internet connectivity", "Data storage"],
    correctIndex: 0,
    explanation: "Biosensors detect and monitor biological or chemical processes."
  },
  {
    question: "What is the goal of synthetic neurobiology?",
    options: ["Engineering neural circuits", "Brain mapping", "Memory storage", "Consciousness study"],
    correctIndex: 0,
    explanation: "Synthetic neurobiology aims to engineer and control neural circuits."
  },
  {
    question: "What is the primary use of microfluidics?",
    options: ["Precise fluid control", "Water purification", "Blood testing", "Drug delivery"],
    correctIndex: 0,
    explanation: "Microfluidics enables precise control of tiny amounts of fluids."
  },
  {
    question: "What is the main goal of bioprinting?",
    options: ["Creating tissue structures", "Document printing", "3D modeling", "Pattern recognition"],
    correctIndex: 0,
    explanation: "Bioprinting aims to create functional tissue and organ structures."
  },
  {
    question: "What is the focus of synthetic metabolism?",
    options: ["Engineered metabolic pathways", "Natural metabolism", "Digestion", "Energy production"],
    correctIndex: 0,
    explanation: "Synthetic metabolism involves engineering new metabolic pathways in organisms."
  },
  {
    question: "What is the main application of optogenetics?",
    options: ["Neural control", "Vision enhancement", "Light therapy", "Optical imaging"],
    correctIndex: 0,
    explanation: "Optogenetics uses light to control neural activity in specific cells."
  },
  {
    question: "What is the goal of neuroengineering?",
    options: ["Neural system interfaces", "Brain mapping", "Mental health", "Cognitive testing"],
    correctIndex: 0,
    explanation: "Neuroengineering develops interfaces between neural systems and technology."
  },
  {
    question: "What is the purpose of gene therapy?",
    options: ["Treating genetic disorders", "Cosmetic enhancement", "Athletic performance", "Weight management"],
    correctIndex: 0,
    explanation: "Gene therapy aims to treat genetic disorders by modifying or replacing faulty genes."
  },
  {
    question: "What is the main principle of synthetic genomics?",
    options: ["DNA synthesis", "Gene sequencing", "Protein folding", "Cell culture"],
    correctIndex: 0,
    explanation: "Synthetic genomics focuses on synthesizing artificial DNA sequences."
  },
  {
    question: "What is the primary goal of bionanotechnology?",
    options: ["Molecular machines", "Large structures", "Chemical synthesis", "Data storage"],
    correctIndex: 0,
    explanation: "Bionanotechnology aims to create molecular-scale biological machines."
  },
  {
    question: "What is the main focus of neuromorphic engineering?",
    options: ["Brain-like computing", "Traditional computing", "Quantum computing", "Cloud computing"],
    correctIndex: 0,
    explanation: "Neuromorphic engineering creates computing systems that mimic brain function."
  },
  {
    question: "What is the purpose of biosynthetic materials?",
    options: ["Biological compatibility", "Industrial strength", "Cost reduction", "Energy efficiency"],
    correctIndex: 0,
    explanation: "Biosynthetic materials are designed for biological compatibility and function."
  },
  {
    question: "What is the main goal of metabolic engineering?",
    options: ["Optimize metabolism", "Natural selection", "Genetic variation", "Cell division"],
    correctIndex: 0,
    explanation: "Metabolic engineering optimizes cellular metabolic processes for desired outcomes."
  },
  {
    question: "What is the main application of synthetic neurobiology?",
    options: ["Neural circuit design", "Brain scanning", "Drug testing", "Memory storage"],
    correctIndex: 0,
    explanation: "Synthetic neurobiology focuses on designing and controlling neural circuits."
  },
  {
    question: "What is the primary goal of biomechanical engineering?",
    options: ["Biological mechanics", "Industrial machines", "Computer systems", "Energy production"],
    correctIndex: 0,
    explanation: "Biomechanical engineering studies and applies mechanical principles to biological systems."
  },
  {
    question: "What is the main focus of biocomputing?",
    options: ["Biological computation", "Electronic computing", "Quantum computing", "Cloud services"],
    correctIndex: 0,
    explanation: "Biocomputing uses biological systems to perform computational tasks."
  },
  {
    question: "What is the purpose of synthetic ecology?",
    options: ["Engineered ecosystems", "Natural preservation", "Wildlife study", "Climate research"],
    correctIndex: 0,
    explanation: "Synthetic ecology designs and engineers artificial ecological systems."
  },
  {
    question: "What is the main goal of biomaterials science?",
    options: ["Biological materials", "Industrial materials", "Construction materials", "Electronic materials"],
    correctIndex: 0,
    explanation: "Biomaterials science develops materials that interact with biological systems."
  },
  {
    question: "What is the main principle of biorobotics?",
    options: ["Biological robots", "Industrial robots", "Computer systems", "Electronic devices"],
    correctIndex: 0,
    explanation: "Biorobotics combines biological principles with robotic systems."
  },
  {
    question: "What is the primary goal of synthetic immunology?",
    options: ["Engineered immunity", "Natural immunity", "Disease treatment", "Vaccine development"],
    correctIndex: 0,
    explanation: "Synthetic immunology aims to engineer artificial immune responses."
  },
  {
    question: "What is the main focus of neuromodulation?",
    options: ["Neural stimulation", "Brain mapping", "Memory enhancement", "Cognitive testing"],
    correctIndex: 0,
    explanation: "Neuromodulation involves altering neural activity through targeted stimulation."
  },
  {
    question: "What is the purpose of bioelectronics?",
    options: ["Biological circuits", "Electronic devices", "Computer chips", "Power systems"],
    correctIndex: 0,
    explanation: "Bioelectronics integrates biological and electronic systems."
  },
  {
    question: "What is the main goal of synthetic evolution?",
    options: ["Directed evolution", "Natural selection", "Species preservation", "Genetic diversity"],
    correctIndex: 0,
    explanation: "Synthetic evolution guides evolutionary processes toward desired outcomes."
  }
];

// Function to get a random question
function getRandomQuestion() {
  return quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
}

// Function to get multiple unique questions
function getUniqueQuestions(count) {
  const questions = [...quizQuestions];
  const selected = [];
  
  while (selected.length < count && questions.length > 0) {
    const index = Math.floor(Math.random() * questions.length);
    selected.push(questions[index]);
    questions.splice(index, 1);
  }
  
  return selected;
}

module.exports = {
  quizQuestions,
  getRandomQuestion,
  getUniqueQuestions
}; 