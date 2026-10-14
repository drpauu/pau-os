/**
 * Public, privacy-reviewed transcription of the owner's source CV.
 * Never import the PDF itself or add private contacts/client identities here.
 * Updating career facts starts here; About, Experience and Resume share this model.
 */
export const professional = {
  name: "Pau Alcázar",
  role: "Data & AI Engineer",
  resume: {
    fullName: "Pau Alcázar Perdomo",
    headline: "DATA & AI ENGINEER | PYTHON, PYSPARK, AWS & AZURE",
    availability: "Open to relocation: Geneva / Vaud, Switzerland",
    summary:
      "Data & AI Engineer and consultant with 3+ years of experience delivering end-to-end data, AI and cloud solutions for public-sector and healthcare organisations. Strong hands-on background in Python, PySpark, SQL, FastAPI, AWS and Azure, spanning ETL/data integration, REST APIs, LLM and RAG workflows, document intelligence, BI and production deployment. Experienced in translating client requirements into secure, observable and maintainable solutions and collaborating across engineering, architecture, functional and stakeholder teams.",
    skills: [
      {
        category: "Languages & data engineering",
        items: [
          "Python",
          "PySpark",
          "SQL",
          "SAS",
          "JavaScript/TypeScript",
          "Bash",
          "R",
          "ETL/ELT",
          "Data modelling",
          "Data quality",
          "Batch processing",
        ],
      },
      {
        category: "AWS",
        items: [
          "Glue",
          "Athena",
          "S3",
          "Lambda",
          "API Gateway",
          "CloudFront",
          "Bedrock",
          "QuickSight",
        ],
      },
      {
        category: "Azure & platforms",
        items: [
          "Azure OpenAI",
          "AI Search",
          "Document Intelligence",
          "Blob Storage",
          "Cosmos DB",
          "Key Vault",
          "ARO/OpenShift",
          "PostgreSQL",
          "PostGIS",
          "Delta Lake",
          "Redis/RQ",
        ],
      },
      {
        category: "AI, backend & DevOps",
        items: [
          "LLM/RAG",
          "Prompt evaluation",
          "Text-to-SQL",
          "Document processing",
          "PII redaction",
          "FastAPI",
          "REST APIs",
          "Asynchronous workers",
          "Docker",
          "Kubernetes/OpenShift",
          "Jenkins CI/CD",
          "Git",
          "Linux",
        ],
      },
      {
        category: "Web & analytics",
        items: [
          "Angular",
          "React/Vite",
          "D3/TopoJSON",
          "Power BI",
          "QuickSight",
          "Excel",
        ],
      },
    ],
    selectedWork: [
      {
        title: "AI-assisted document ingestion",
        description:
          "Designed an asynchronous workflow that extracts and validates PDFs, generates metadata with GPT-4o, supports human review, maps metadata to a controlled vocabulary and publishes records through REST APIs. Implemented queue-based and no-Redis processing alternatives for enterprise deployment constraints.",
        technologies:
          "Python, FastAPI, Angular, GPT-4o, DSpace REST APIs, controlled vocabularies, Redis/RQ, Azure Blob Storage, Key Vault, OIDC, OpenShift",
      },
      {
        title: "Production cloud architecture & deployment",
        description:
          "Designed a containerised application platform with a single-page web app, API backend and Python worker for a managed OpenShift environment. Defined environment-specific integrations, API exposure, identity, secrets, observability, CI/CD and asynchronous processing alternatives for production readiness.",
        technologies:
          "Angular, FastAPI, Python, Docker, ARO/OpenShift, Jenkins, OIDC, API gateway, Key Vault, Blob Storage, Application Insights, Log Analytics",
      },
      {
        title: "Healthcare data engineering & GenAI",
        description:
          "Developed PySpark and AWS Glue ETL processes across Oracle, S3/Delta Lake and Athena; supported healthcare reporting, clinical form completion, data preparation and batch LLM workflows with Amazon Bedrock.",
        technologies:
          "Python, PySpark, AWS Glue, S3, Delta Lake, Athena, Amazon Bedrock, Oracle, QuickSight",
      },
      {
        title: "Multi-agent mobility assistant",
        description:
          "Contributed to a mobility assistant combining natural-language responses, map output and deterministic data queries. Worked across text-to-SQL, PostGIS/GeoJSON, ETL and serving layers, prompt evaluation and production diagnosis of environment-specific data-refresh failures.",
        technologies:
          "Python, FastAPI, PostgreSQL/PostGIS, GeoJSON, SQL templates, ETL, prompt evaluation, OpenShift",
      },
      {
        title: "PII anonymisation platform",
        description:
          "Worked on an asynchronous document-anonymisation service using hexagonal architecture and explicit workflow states, with secure storage, secrets management, PII redaction and automated tests designed for enterprise deployment.",
        technologies:
          "Python, FastAPI, Azure Cosmos DB, Blob Storage, Key Vault, Document Intelligence, Docker, automated testing",
      },
      {
        title: "Serverless analytics delivery",
        description:
          "Built an Athena–Lambda–API Gateway–CloudFront–S3 delivery layer for a custom BI visual, implementing paginated retrieval beyond default row limits and serving more than 32,000 records to the client application.",
        technologies:
          "Python, Amazon Athena, Lambda, API Gateway, CloudFront, S3, QuickSight, JavaScript",
      },
      {
        title: "Road-safety analytics",
        description:
          "Produced official quarterly, campaign, thematic and provincial analyses using SAS/SQL, reusable reporting macros, quality controls for provisional and consolidated records, geographic and population enrichment, and validated office-document outputs.",
        technologies:
          "SAS, SQL, Excel, Word, PowerPoint, RTF, data validation, reporting automation",
      },
      {
        title: "Camí Curt — independent web product",
        description:
          "Built and deployed an educational route-planning game for Catalonia using Dijkstra/A* pathfinding. The application covers 41 comarques and 1,550 route constraints, with daily, standard, timed and exploration modes.",
        technologies:
          "React 18, Vite, JavaScript, D3, TopoJSON, Web Workers, Vercel, pathfinding algorithms",
        url: "https://camicurt.cat",
      },
    ],
  },
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
        "Deliver end-to-end data, AI and cloud solutions for public-sector and healthcare clients, from discovery and architecture through implementation, testing, deployment and production troubleshooting.",
      responsibilities: [
        "Design and implement generative AI applications and reference architectures for public-service use cases with Python/FastAPI, Angular/React, Azure services, Docker and OpenShift.",
        "Build and industrialise data pipelines and APIs across AWS and Azure, including PySpark/Glue ETL, Athena-based analytics, REST integrations, asynchronous processing and serverless delivery patterns.",
        "Apply data governance and engineering controls covering data quality, traceability, consistency, PII handling, testing, observability and operational ownership.",
        "Collaborate directly with clients and multidisciplinary teams to turn functional needs into technical requirements, implementation plans and maintainable production solutions.",
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
