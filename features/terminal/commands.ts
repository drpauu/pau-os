import { profile, projects } from "@/lib/content";
export const commands = [
  "help",
  "whoami",
  "projects",
  "skills",
  "experience",
  "education",
  "github",
  "resume",
  "contact",
  "clear",
  "ls",
  "open",
  "theme",
  "diagnostics",
  "sudo",
];
const routes: Record<string, string> = {
  home: "/",
  projects: "/projects/",
  about: "/about/",
  lab: "/lab/",
  resume: "/resume/",
  contact: "/contact/",
  athra: "/projects/athra/",
  trackflow: "/projects/trackflow/",
  "cami-curt": "/projects/cami-curt/",
};
export type CommandResult = {
  text: string;
  route?: string;
  clear?: boolean;
  theme?: "ice" | "titanium";
};
export function runCommand(input: string): CommandResult {
  const [command, ...args] = input.trim().toLowerCase().split(/\s+/);
  switch (command) {
    case "":
      return { text: "" };
    case "help":
      return {
        text:
          "AVAILABLE COMMANDS\n" +
          commands.filter((v) => v !== "sudo").join("  ·  ") +
          "\n\nopen <home|projects|about|lab|resume|contact|athra|trackflow|cami-curt>\ntheme <ice|titanium>\nTab: autocomplete · ↑↓: history · Escape: close",
      };
    case "whoami":
      return {
        text: profile.name + "\n" + profile.role + "\n" + profile.location,
      };
    case "projects":
    case "ls":
      return {
        text: projects
          .map((p) => p.slug.padEnd(12) + " " + p.description)
          .join("\n"),
      };
    case "skills":
      return {
        text: Object.entries(profile.skills)
          .map(([k, v]) => k + "\n  " + v.join(" · "))
          .join("\n\n"),
      };
    case "experience":
      return {
        text: "Accenture\nData & AI Consultant · Analyst\nProfessional experience in data and technology.",
      };
    case "education":
      return {
        text: "Computer Science degree\nUniversitat Politècnica de Catalunya (UPC)",
      };
    case "github":
      return {
        text:
          profile.github +
          "\nFind the clickable GitHub link in the page footer.",
      };
    case "resume":
      return { text: "Opening the resume.", route: routes.resume };
    case "contact":
      return { text: "Opening contact.", route: routes.contact };
    case "clear":
      return { text: "", clear: true };
    case "open":
      return routes[args[0]]
        ? { text: "Opening " + args[0] + ".", route: routes[args[0]] }
        : { text: "Unknown destination. Try: open projects" };
    case "theme":
      return args[0] === "ice" || args[0] === "titanium"
        ? { text: "Theme: " + args[0], theme: args[0] }
        : { text: "Choose a theme: theme ice | theme titanium" };
    case "diagnostics":
      return {
        text: "PAU.OS / ENGINEERING LABORATORY\nNext.js · React Three Fiber · Three.js · TypeScript\nProcedural geometry · static HTML content · Supabase published-content API\nTerminal: isolated command interpreter. No shell access.",
      };
    case "sudo":
      return {
        text: "Great power comes with a very small allowlist. Try help.",
      };
    default:
      return {
        text: "Command not found: " + command.slice(0, 80) + ". Type help.",
      };
  }
}
export function completeCommand(input: string): string {
  const list = input.startsWith("open ")
    ? Object.keys(routes).map((r) => "open " + r)
    : commands;
  const matches = list.filter((c) => c.startsWith(input.toLowerCase()));
  return matches.length === 1 ? matches[0] : input;
}
