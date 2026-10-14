/**
 * Public, privacy-reviewed transcription of the owner's source CV.
 * Never import the PDF itself or add private contacts/client identities here.
 * Updating career facts starts here; About, Experience and Resume share this model.
 */
export const professional = {
  name: "Pau Alcázar",
  role: "Data & AI Engineer",
  location: "Barcelona, Spain",
  summary:
    "I build data systems, APIs and digital products. My work connects software engineering with data and AI, from the first requirements to deployment and the details that keep a system running.",
  about:
    "At Accenture, I work across data pipelines, cloud platforms and AI applications for public-sector and healthcare organisations. Independent products give me another way to explore the same questions: how to model a problem, make the interface understandable and build something useful.",
  approach:
    "My background in computer engineering brings algorithms, databases and systems into that work. Teaching technical subjects has also shaped how I explain complex ideas and turn them into practical steps.",
  experience: [
    {
      id: "accenture",
      company: "Accenture",
      title: "Data & AI Analyst (AI Decision Science)",
      location: "Barcelona, Spain",
      start: "2023-06",
      end: null,
      dates: "Jun 2023 – Present",
      summary:
        "Delivering data, AI and cloud solutions from requirements and architecture through implementation, testing, deployment and production troubleshooting.",
      responsibilities: [
        "Build data pipelines and APIs across AWS and Azure, including PySpark ETL, analytics, asynchronous processing and serverless delivery.",
        "Develop generative AI applications and supporting architectures with Python, FastAPI, web interfaces and cloud services.",
        "Apply data quality, traceability, privacy, testing and observability controls throughout delivery.",
        "Work with clients and multidisciplinary teams to turn functional needs into maintainable technical solutions.",
      ],
      provenance: {
        source: "owner-cv",
        page: 1,
        section: "PROFESSIONAL EXPERIENCE",
      },
    },
    {
      id: "superprof",
      company: "Superprof",
      title: "Technology Subjects Tutor",
      location: "Barcelona, Spain",
      start: "2021-09",
      end: null,
      dates: "Sep 2021 – Present",
      summary:
        "Teaching programming, algorithms, operating systems, mathematics and physics.",
      responsibilities: [
        "Adapt technical explanations and practical exercises to different student profiles.",
      ],
      provenance: {
        source: "owner-cv",
        page: 1,
        section: "PROFESSIONAL EXPERIENCE",
      },
    },
  ],
  education: [
    {
      institution: "Universitat Politècnica de Catalunya (UPC) – EPSEVG",
      degree: "Bachelor of Science in Computer Engineering",
      start: "2020",
      end: "2024",
      dates: "2020 – 2024",
      description:
        "Software engineering, algorithms, databases, operating systems, networks, data science, cybersecurity and parallel programming.",
      provenance: { source: "owner-cv", page: 1, section: "EDUCATION" },
    },
  ],
  languages: ["Catalan", "Spanish", "English"],
  provenance: {
    sourceId: "owner-cv",
    sourceFile: "Pau_Alcazar_CV.pdf",
    sourceSha256:
      "07af49c0bf51e57e743a24b2aa4dd4c5d88baa2e6d7bb960b387a1663cfb522f",
    reviewedOn: "2026-10-14",
    sourceDate: null,
    notes:
      "Source document has no explicit version date. Present dates are preserved as written. Public copy omits private contact details, client identities and client-specific project details. No language levels or certifications are inferred.",
  },
} as const;
