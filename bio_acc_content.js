const bioAccContent = {
  manifesto: `As computation becomes our substrate for intelligence, biotechnology stands as the foundation for engineering and orchestrating the intelligence inherent in living systems.

By accelerating biotechnology, we are accelerating life and evolution itself. The choice to flourish or perish is ours. We must lead from the heart.

DNA sits at the heart - the ancient, elegant code that orchestrates all living systems. Governed by the algorithm of DNA, biotech delineates the boundary between the animate and the inanimate.`,

  principles: [
    {
      title: "DECENTRALIZE biopower",
      description: "Harness decentralized networks for data storage, transactions and fundraising to build global collectives that fund, coordinate and commercialize scientific research outside the traditional gates and keepers."
    },
    {
      title: "ENGINEER ethical evolution",
      description: "Biosafety and accountability can be built into the foundations of our technologies through smart contracts. Communities can define which gene sequences are considered pathogenic and enforce safety parameters."
    },
    {
      title: "ALIGN with ecological blueprints",
      description: "Integrate biotechnology to be compatible with natural ecosystems. Embrace biomimicry, drawing inspiration from nature's ingenuity."
    },
    {
      title: "HACK health, claim mind-body liberty",
      description: "Assert the right of all sentient beings to explore and expand their own minds and bodies; to optimize their neurochemistry and cognition."
    },
    {
      title: "OPEN-SOURCE the code",
      description: "Build a global public commons for research, from genomes to drug designs to experimental protocols, with decentralized intellectual property frameworks."
    },
    {
      title: "ACCELERATE supply chains",
      description: "Develop direct-to-consumer supply chains that radically reduce cost and time to market. Enable local 3D printing of molecules."
    }
  ],

  technologies: [
    {
      name: "CRISPR 2.0",
      timeline: 0,
      category: "Key Technologies"
    },
    {
      name: "Synthetic Biology",
      timeline: 2,
      category: "Key Technologies"
    },
    {
      name: "Bio-Nanotechnology",
      timeline: 3,
      category: "Key Technologies"
    },
    {
      name: "Whole Genome Synthesis",
      timeline: 4,
      category: "Impact Areas"
    },
    {
      name: "Bio-Digital Fusion",
      timeline: 6,
      category: "Impact Areas"
    },
    {
      name: "Bio-Singularity",
      timeline: 10,
      category: "Bio/ACC Principles"
    }
  ],

  trinity: {
    biotech: "Foundation for engineering living systems",
    ai: "Accelerates research and discovery",
    crypto: "Enables decentralized coordination and funding"
  },

  getRandomTopic: () => {
    const topics = [
      "Decentralized biopower and research",
      "Ethical evolution through smart contracts",
      "Ecological integration and biomimicry",
      "Mind-body liberty and enhancement",
      "Open-source biology and research",
      "Accelerated supply chains",
      "Bio-digital convergence",
      "Community labs and biohacking",
      "DeSci and open research",
      "Synthetic biology advances"
    ];
    return topics[Math.floor(Math.random() * topics.length)];
  },

  getTimelineEvent: (year) => {
    return bioAccContent.technologies.find(t => t.timeline === year);
  }
};

module.exports = bioAccContent; 