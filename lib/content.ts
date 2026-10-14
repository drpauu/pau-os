import { z } from "zod";
const publicUrl = z
  .string()
  .url()
  .refine((v) => new URL(v).protocol === "https:", "HTTPS required");
export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1).max(80),
  subtitle: z.string().max(180),
  description: z.string().max(1200),
  technologies: z.array(z.string().max(60)).max(20),
  category: z.string(),
  repository_url: publicUrl,
  live_url: publicUrl.nullable(),
  cover_image: z.string().regex(/^\/images\/[a-z0-9-]+\.(webp|png|jpg)$/),
  gallery: z.array(z.string()).default([]),
  featured: z.boolean(),
  published: z.boolean(),
  sort_order: z.number(),
  content: z.object({
    status: z.string(),
    intro: z.string(),
    problem: z.string(),
    approach: z.string(),
    architecture: z.array(z.string()),
    challenges: z.array(
      z.object({ title: z.string(), description: z.string() }),
    ),
    scope: z.string(),
    source: z.string(),
    caption: z.string(),
  }),
});
export type Project = z.infer<typeof projectSchema>;
export const profile = {
  name: "Pau Alcázar",
  role: "Software Engineer · Data & AI Consultant",
  github: "https://github.com/drpauu",
  linkedin: "https://www.linkedin.com/in/pau-alcázar-perdomo/",
  location: "Barcelona, Spain",
  education: "Computer Science · Universitat Politècnica de Catalunya",
  summary:
    "I turn complex problems into software people can use. My work connects data, engineering and the experience on the other side of the screen.",
  skills: {
    Software: ["TypeScript", "React", "Python", "C++", "Node.js", "Git"],
    "Data & systems": [
      "SQL",
      "PostgreSQL",
      "MongoDB",
      "Supabase",
      "REST APIs",
      "Data processing",
    ],
    Practice: [
      "Graph algorithms",
      "Automated testing",
      "Linux",
      "CI/CD",
      "Application security",
      "WebGL",
    ],
  },
};
export const projects: Project[] = [
  {
    slug: "athra",
    title: "ATHRA",
    subtitle: "From training data to a clearer picture.",
    description:
      "An athlete analytics application connecting FIT imports, training load and recovery indicators in one place.",
    category: "SPORTS DATA / ANALYTICS",
    technologies: [
      "TypeScript",
      "React",
      "Express",
      "Garmin FIT SDK",
      "Recharts",
    ],
    repository_url: "https://github.com/drpauu/athra",
    live_url: null,
    cover_image: "/images/athra.webp",
    gallery: [],
    featured: true,
    published: true,
    sort_order: 1,
    content: {
      status: "Development",
      intro: "Performance starts with understanding the signal.",
      problem:
        "Training produces a lot of data. Interpreting activity, sleep and recovery together should not require jumping between disconnected tools.",
      approach:
        "ATHRA imports Garmin FIT files, normalizes activity records and calculates versioned, deterministic recovery and training-load indicators. The interface brings those calculations into focused views for daily readiness, activities, sleep and trends.",
      architecture: [
        "Garmin FIT files → validated upload",
        "FIT SDK → normalized activity records",
        "Repository interface → in-memory implementation",
        "Recovery engine → Express API",
        "React + Recharts → athlete dashboard",
      ],
      challenges: [
        {
          title: "Keep the calculation inspectable",
          description:
            "The recovery engine computes HRV baselines, resting heart-rate deviation and exponentially weighted training load in ordinary TypeScript. The calculation is separate from the optional AI coaching integration.",
        },
        {
          title: "Preserve the provenance",
          description:
            "The importer and data explorer retain a route back to imported activity records. A repository interface separates ingestion, calculations and presentation.",
        },
      ],
      scope:
        "The current checkout uses an in-memory repository. Durable persistence and production authentication are further work. Recovery indicators are product calculations, not clinically validated conclusions.",
      source:
        "Source reviewed at c755f20: App.tsx, fit-importer.ts, recovery-engine.ts, api.ts and server.ts.",
      caption:
        "Actual local application · repository demonstration data, not personal health records.",
    },
  },
  {
    slug: "trackflow",
    title: "TRACKFLOW",
    subtitle: "A training week, with everything connected.",
    description:
      "A planning application bringing coaches, athletes and weekly training into a shared workflow.",
    category: "PRODUCT ENGINEERING / SYSTEMS",
    technologies: ["React", "Vite", "Express", "MongoDB", "Playwright"],
    repository_url: "https://github.com/drpauu/TrackFlow",
    live_url: null,
    cover_image: "/images/trackflow.webp",
    gallery: [],
    featured: true,
    published: true,
    sort_order: 2,
    content: {
      status: "Web application",
      intro: "Structure for the work behind performance.",
      problem:
        "A training plan needs to stay useful after it is written: a coach publishes a week, athletes follow their sessions, and both need an up-to-date view.",
      approach:
        "TrackFlow pairs a React frontend with an Express API and MongoDB persistence. Weekly plans project into athlete day plans and completion states; incremental synchronization refreshes only the changed storage keys.",
      architecture: [
        "Coach / athlete → React interface",
        "Same-origin /api → Express",
        "Storage contract → compatibility cache",
        "Canonical model → MongoDB collections",
        "Monotonic syncVersion → incremental refresh",
      ],
      challenges: [
        {
          title: "Evolve the model without replacing the UI",
          description:
            "A compatibility layer preserves the existing tf_* storage contract while projecting writes into a canonical MongoDB data model.",
        },
        {
          title: "Keep every athlete in the right context",
          description:
            "Records and synchronization are scoped by coachId. A published week becomes daily plans and completion states used by the athlete calendar.",
        },
      ],
      scope:
        "The previous public deployment is unavailable. This case study describes the implemented planning and synchronization architecture. Authentication hardening and broader regression coverage remain areas for continued improvement.",
      source:
        "Source reviewed at 1b730d6: README.md, frontend/src and server/src.",
      caption:
        "Actual local application · unauthenticated entry screen. No athlete records displayed.",
    },
  },
  {
    slug: "cami-curt",
    title: "CAMÍ CURT",
    subtitle: "A small route. A surprisingly deep problem.",
    description:
      "A Catalan geography game that turns the comarca map into a daily graph puzzle.",
    category: "INTERACTIVE WEB / ALGORITHMS",
    technologies: ["React", "D3", "TopoJSON", "Graph algorithms", "Supabase"],
    repository_url: "https://github.com/drpauu/camicurt.cat",
    live_url: "https://camicurt.cat",
    cover_image: "/images/cami-curt.webp",
    gallery: [],
    featured: true,
    published: true,
    sort_order: 3,
    content: {
      status: "Live",
      intro: "Find the connection. Discover the territory.",
      problem:
        "A map can teach much more than names. The challenge is to make geographic relationships tangible, playful and worth returning to.",
      approach:
        "Players connect two Catalan comarques through adjacent territories. A shortest-path engine evaluates routes under changing rules; the SVG map makes the graph visible and gives feedback on every move.",
      architecture: [
        "Comarca geometry → TopoJSON + D3",
        "Adjacency graph → route calculation",
        "Rules + difficulty → valid challenges",
        "React → interactive SVG map",
        "Supabase → shared daily calendar",
      ],
      challenges: [
        {
          title: "Turn a graph into something intuitive",
          description:
            "Geometric territories act as selectable graph nodes. Route feedback connects the player’s choices with an optimal path.",
        },
        {
          title: "Make a daily challenge dependable",
          description:
            "The public calendar and local generation fallback support the daily workflow. Normal, time-trial and exploration modes provide different ways to learn the map.",
        },
      ],
      scope:
        "Live application. This portfolio links to the actual game; it does not replicate accounts, leaderboards or player data.",
      source:
        "Source reviewed in the owner’s camicurt.cat checkout: README.md, package.json and game source.",
      caption:
        "Actual public Camí Curt application · captured without signing in.",
    },
  },
];
