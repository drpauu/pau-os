export const nodes = [
  { id: "A", x: 85, y: 180 },
  { id: "B", x: 210, y: 85 },
  { id: "C", x: 210, y: 280 },
  { id: "D", x: 365, y: 100 },
  { id: "E", x: 350, y: 260 },
  { id: "F", x: 505, y: 180 },
];
export type Edge = { a: string; b: string; weight: number };
export const edges: Edge[] = [
  { a: "A", b: "B", weight: 4 },
  { a: "A", b: "C", weight: 2 },
  { a: "B", b: "C", weight: 1 },
  { a: "B", b: "D", weight: 5 },
  { a: "C", b: "E", weight: 7 },
  { a: "B", b: "E", weight: 6 },
  { a: "D", b: "E", weight: 2 },
  { a: "D", b: "F", weight: 3 },
  { a: "E", b: "F", weight: 1 },
];
export function shortestPath(graph: Edge[], start: string, end: string) {
  const ids = new Set(graph.flatMap((e) => [e.a, e.b]));
  if (!ids.has(start) || !ids.has(end))
    return { path: [] as string[], cost: Infinity, visited: [] as string[] };
  if (graph.some((e) => e.weight < 0 || !Number.isFinite(e.weight)))
    throw new Error("Dijkstra requires finite nonnegative weights");
  const distances = new Map([...ids].map((id) => [id, Infinity]));
  distances.set(start, 0);
  const previous = new Map<string, string>(),
    remaining = new Set(ids),
    visited: string[] = [];
  while (remaining.size) {
    const current = [...remaining].sort(
      (a, b) => distances.get(a)! - distances.get(b)!,
    )[0];
    if (distances.get(current) === Infinity) break;
    remaining.delete(current);
    visited.push(current);
    if (current === end) break;
    for (const edge of graph) {
      const next =
        edge.a === current ? edge.b : edge.b === current ? edge.a : null;
      if (!next || !remaining.has(next)) continue;
      const d = distances.get(current)! + edge.weight;
      if (d < distances.get(next)!) {
        distances.set(next, d);
        previous.set(next, current);
      }
    }
  }
  const cost = distances.get(end)!;
  if (!Number.isFinite(cost)) return { path: [] as string[], cost, visited };
  const path = [end];
  while (path[0] !== start) path.unshift(previous.get(path[0])!);
  return { path, cost, visited };
}
