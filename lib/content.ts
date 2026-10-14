import { professional } from "./professional";
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
  repository_url: publicUrl.nullable(),
  live_url: publicUrl.nullable(),
  cover_image: z.string().regex(/^\/images\/[a-z0-9-]+\.(webp|png|jpg)$/),
  gallery: z
    .array(z.string().regex(/^\/images\/[a-z0-9-]+\.(webp|png|jpg)$/))
    .max(12)
    .default([]),
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
  name: professional.name,
  role: professional.role,
  github: "https://github.com/drpauu",
  linkedin: "https://www.linkedin.com/in/pau-alcázar-perdomo/",
  location: professional.location,
  education: professional.education[0].degree + " · UPC",
  summary: professional.summary,
};
export const projects: Project[] = [
  {
    slug: "camicurt",
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
    sort_order: 1,
    content: {
      status: "Live",
      intro: "Find the connection. Discover the territory.",
      problem:
        "A map can teach much more than names. The challenge is to make geographic relationships tangible, playful and worth returning to.",
      approach:
        "Players connect two Catalan comarques through adjacent territories, with rules requiring or forbidding particular regions. Dijkstra enumerates optimal routes; A* provides a complementary length check. The SVG map makes the graph visible and gives feedback on every move.",
      architecture: [
        "Comarca geometry → TopoJSON + D3",
        "Adjacency graph → Dijkstra + rule validation",
        "Web Worker → shortest-path cache",
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
            "A shared daily calendar has a local generation fallback. A Web Worker precomputes route caches while the main thread keeps the map responsive. Normal, time-trial and exploration modes complement the daily challenge.",
        },
      ],
      scope:
        "Live application. The installation uses the game’s 41-region geographic dataset. That dataset is not presented as a claim of current administrative completeness. Portfolio interactions stay local and do not access player sessions.",
      source:
        "Public source reviewed at 612657b: README.md, src/lib/pathfinding.js and src/lib/geography.js; matching local game data and worker inspected.",
      caption:
        "Actual public Camí Curt application · captured without signing in.",
    },
  },
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
    sort_order: 2,
    content: {
      status: "Development prototype",
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
    slug: "alcoholfabet",
    title: "ALCOHOLFABET",
    subtitle: "A playful surface. A deliberate system underneath.",
    description:
      "A Catalan question-based board game with in-person and online play, server-validated turns and synchronized sessions.",
    category: "MULTIPLAYER / INTERACTION DESIGN",
    technologies: [
      "TypeScript",
      "React",
      "SVG",
      "Supabase",
      "PostgreSQL",
      "Realtime",
    ],
    repository_url: "https://github.com/drpauu/Alcoholfabet",
    live_url: "https://alcoholfabet.cat",
    cover_image: "/images/alcoholfabet.webp",
    gallery: [],
    featured: true,
    published: true,
    sort_order: 3,
    content: {
      status: "Live",
      intro: "The board is playful. The rules stay consistent.",
      problem:
        "A shared board game needs one trustworthy sequence of turns, whether both players share a screen or join from separate devices. Questions, answers and actions also need to respect each player’s role.",
      approach:
        "React presents a tactile SVG board, pieces and question cards. The browser sends action requests to PostgreSQL functions through Supabase; the server validates the move and returns a view appropriate to the viewer. Private Realtime channels notify connected devices when the session changes.",
      architecture: [
        "React + SVG → board and turn presentation",
        "Validated action request → Supabase RPC",
        "PostgreSQL → authoritative game state",
        "Role-aware view → safe answer visibility",
        "Private Realtime channel → refreshed session",
      ],
      challenges: [
        {
          title: "Keep the answer on the right side of the table",
          description:
            "Server views control which role can see an answer or judge a response. The client validates the returned shape and rejects responses that expose an answer to a responding player.",
        },
        {
          title: "Make a turn survive reconnection",
          description:
            "State versions and idempotency keys support consistent actions. The session reducer and private channel recover the authoritative view after interruptions, while the motion system follows explicit game phases.",
        },
      ],
      scope:
        "The public application includes in-person play; online roles require private player codes. These capabilities were inspected in source. No production game was created or modified during portfolio verification. The installation is an illustration, not a live game session.",
      source:
        "Public repository and local source match d184832: game-repository.ts, useGameSession.ts, useGameChannel.ts, game rules and SQL migrations reviewed.",
      caption:
        "Actual Alcoholfabet interface · isolated menu fixture with an empty score; no production game or auth session opened.",
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
    sort_order: 4,
    content: {
      status: "Source available",
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
        "Original editorial illustration of TrackFlow’s weekly planning workflow, not a product screenshot or live athlete data.",
    },
  },
  {
    slug: "adhoc-medical-data-processing",
    title: "AD-HOC MEDICAL DATA PROCESSING",
    subtitle: "Connecting specialist workflows to existing platforms.",
    description:
      "A pinned data-engineering project centered on ad-hoc processing and integration with an existing data platform.",
    category: "DATA ENGINEERING / ETL",
    technologies: ["Python", "C", "JavaScript", "PowerShell", "Shell"],
    repository_url: null,
    live_url: null,
    cover_image: "/images/pinned-medical-operations.webp",
    gallery: [],
    featured: false,
    published: true,
    sort_order: 5,
    content: {
      status: "Pinned · source review needed",
      intro: "Data work shaped around a platform that already exists.",
      problem:
        "Ad-hoc data processing has to fit the contracts and constraints of an existing platform. The challenge is to bridge one-off workflows and established systems.",
      approach:
        "The project is described in the GitHub profile as medical data processing and platform integration. Its public source tree shows a Python-led ETL structure with configuration, ingestion, pipeline and backend folders, supported by C, JavaScript, PowerShell and shell tooling. This page summarizes the stated scope and repository structure only.",
      architecture: [
        "Ad-hoc source processing → Python ETL",
        "Input handling → ingestion module",
        "Schema and settings → configuration",
        "Existing platform → integration boundary",
      ],
      challenges: [
        {
          title: "Fit a workflow to an existing platform",
          description:
            "The pinned project focuses on processing data for integration with an established data platform, using a mixed-language toolchain around a Python-heavy ETL codebase.",
        },
        {
          title: "Keep example data out of the portfolio",
          description:
            "PAU.OS contains no medical records or sample payloads. The case study uses an original abstract diagram and avoids reproducing source data.",
        },
      ],
      scope:
        "The public repository currently contains a tracked environment file with a credential-shaped database connection value and bundled data files. The repository link is withheld until those files receive a secrets and privacy review. No values or medical records were copied into PAU.OS.",
      source:
        "GitHub profile README pinned-project description and public repository tree reviewed at ce45dc4b3e04b220db3656dba08dbed3269b94d9. Configuration values and medical data payloads were not inspected or copied.",
      caption:
        "Original illustrative workflow diagram · no medical records or sample payloads.",
    },
  },
  {
    slug: "connect4-ai",
    title: "CONNECT4 AI",
    subtitle: "Search the game tree. Choose the next column.",
    description:
      "A collaborative Java Connect Four assignment exploring depth-limited minimax, alpha-beta pruning and board evaluation.",
    category: "GAME AI / SEARCH",
    technologies: ["Java", "Minimax", "Alpha-beta pruning", "Heuristics"],
    repository_url: "https://github.com/drpauu/Connect4-AI",
    live_url: null,
    cover_image: "/images/pinned-connect4-ai.webp",
    gallery: [],
    featured: false,
    published: true,
    sort_order: 6,
    content: {
      status: "Academic · collaborative",
      intro: "A move is a small decision inside a much larger tree.",
      problem:
        "A Connect Four player needs to look beyond the immediate move, compare possible replies and score positions before the full game tree becomes too large to search.",
      approach:
        "The pinned university project includes a Java player that searches to a configured depth with minimax and alpha-beta pruning. Its evaluation checks winning outcomes and scores horizontal, vertical and diagonal board patterns. The repository credits the player to Pau and a collaborator.",
      architecture: [
        "Current board → legal column choices",
        "Candidate move → copied game state",
        "Replies → depth-bounded minimax",
        "Alpha / beta bounds → pruned branches",
        "Position patterns → heuristic score",
      ],
      challenges: [
        {
          title: "Spend search effort where it matters",
          description:
            "Alpha-beta bounds stop exploring branches that cannot improve the current choice, while depth limits keep the search bounded.",
        },
        {
          title: "Evaluate positions before they are decided",
          description:
            "A board heuristic scores promising runs in each direction; terminal wins and losses receive decisive values.",
        },
      ],
      scope:
        "Collaborative coursework rather than a deployed game product. The pinned source includes a supplied course game library; PAU.OS links to the repository but does not copy or redistribute its code or bundled materials. No runtime or strength benchmark is claimed.",
      source:
        "Public pinned repository reviewed at 2b1bb25a8902d89cf86fedf49e7dff8934b4fab9: MinimaxPlayer.java and Java/Ant project structure.",
      caption:
        "Original game-tree illustration · search visualization is explanatory, not a live benchmark.",
    },
  },
  {
    slug: "checkers-ai",
    title: "CHECKERS AI",
    subtitle: "Iterative search over a changing board.",
    description:
      "A pinned Java checkers project with a minimax player, iterative deepening, alpha-beta pruning and a custom heuristic.",
    category: "GAME AI / SEARCH",
    technologies: [
      "Java",
      "Minimax",
      "Iterative deepening",
      "Alpha-beta pruning",
    ],
    repository_url: "https://github.com/drpauu/Checkers-AI",
    live_url: null,
    cover_image: "/images/pinned-checkers-ai.webp",
    gallery: [],
    featured: false,
    published: true,
    sort_order: 7,
    content: {
      status: "Academic · source available",
      intro: "Deeper search, with a useful answer at every completed depth.",
      problem:
        "A checkers player must compare sequences of captures and replies while keeping move choice useful as the search explores farther ahead.",
      approach:
        "The Java project implements a minimax player with a configured search depth, alpha-beta bounds and a board-evaluation heuristic. Its move-selection method iterates through shallower depths before returning the deepest completed result.",
      architecture: [
        "Checkers board → legal move generation",
        "Successive depth limits → iterative deepening",
        "Alternating turns → minimax values",
        "Alpha / beta bounds → branch pruning",
        "Board position → custom heuristic",
      ],
      challenges: [
        {
          title: "Keep a valid choice as search deepens",
          description:
            "Iterative deepening searches successive depth limits and returns the best move from the last completed iteration.",
        },
        {
          title: "Bound the branching search",
          description:
            "Alpha-beta pruning avoids evaluating continuations that cannot change the current minimax decision.",
        },
      ],
      scope:
        "Pinned academic source with a Java board and player implementation. Individual contribution boundaries and playing strength have not been independently measured; no runtime benchmark is claimed. PAU.OS does not copy the supplied course engine or game assets.",
      source:
        "Public pinned repository reviewed at dcea720415b6c17a209ac8f6c67ebf5bdbc3b131: PlayerMiniMax.java and Board.java.",
      caption:
        "Original board and search illustration · not a screenshot of the course engine.",
    },
  },
  {
    slug: "esinmath",
    title: "ESINMATH",
    subtitle: "Expressions become trees that can be evaluated and simplified.",
    description:
      "A C++ mathematics project covering tokenization, expression trees, rational arithmetic, variables and simplification.",
    category: "C++ / LANGUAGE AND MATHEMATICS",
    technologies: ["C++", "Expression trees", "Rational arithmetic", "Parsing"],
    repository_url: "https://github.com/drpauu/EsinMath",
    live_url: null,
    cover_image: "/images/pinned-esinmath.webp",
    gallery: [],
    featured: false,
    published: true,
    sort_order: 8,
    content: {
      status: "Academic · source available",
      intro:
        "Turn mathematical notation into a structure a program can reason about.",
      problem:
        "A mathematical expression needs a clear grammar and representation before it can be evaluated, simplified or connected to variables and a user session.",
      approach:
        "The C++ project tokenizes input, builds expression-tree structures and implements rational arithmetic. Its source includes expression simplification, variable handling and a session layer, supported by the course-provided ESIN libraries.",
      architecture: [
        "Input text → tokenization",
        "Tokens → expression tree",
        "Rational values → exact arithmetic",
        "Tree operations → evaluation and simplification",
        "Variables → interactive math session",
      ],
      challenges: [
        {
          title: "Preserve structure while simplifying",
          description:
            "Expression nodes represent operations and operands, allowing simplification rules to operate over the expression rather than raw text alone.",
        },
        {
          title: "Keep rational calculations exact",
          description:
            "A separate rational type handles fraction arithmetic and its error cases alongside integer and real expression values.",
        },
      ],
      scope:
        "Coursework built around supplied ESIN teaching libraries and fixtures. The repository does not declare a license, and its bundled course materials are not redistributed here. No fresh build or numerical benchmark is claimed.",
      source:
        "Public pinned repository reviewed at 0d8c6e30409ed893091df65043503139fa5a8708: expressio.cpp, racional.cpp, math_sessio.cpp and the project Makefile.",
      caption:
        "Original expression-tree illustration · no supplied library or test fixture is reproduced.",
    },
  },
];
