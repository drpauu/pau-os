import source from "@/data/catalunya-comarques.json";

export type Point2 = [number, number];
type Polygon = Point2[][];
type TopologyGeometry = {
  type: string;
  arcs: number[][] | number[][][];
  properties: { id: string; name: string };
};
type Topology = {
  arcs: number[][][];
  transform: { scale: number[]; translate: number[] };
  objects: Record<string, { geometries: TopologyGeometry[] }>;
};

export type Comarca = {
  id: string;
  name: string;
  /** Projected X / south-facing Z, in scene units. */
  polygons: Polygon[];
  center: Point2;
  neighbors: string[];
};

export const geographySource = {
  url: "https://github.com/drpauu/camicurt.cat/blob/main/public/catalunya-comarques.topojson",
  sourceCommit: "bb23070d84e05d653f297c76c3b682d4311f92e8",
  sha256: "4040f22c4030f45986216bdba32a1a27888933ed821c8114cef098b467892e4d",
  regionCount: 41,
  edgeCount: 95,
  attribution: "Camí Curt map dataset · GeoJSON-Mapas (2014 snapshot)",
  upstreamUrl:
    "https://github.com/aariste/GeoJSON-Mapas/blob/a09b48c3e237dfb22347021a224cc764f0d65189/comarques-compressed.geojson",
  upstreamSha256:
    "86a3a4bc3c68acf2f61bf05e4870b752680b96a20305ecdc6d85da2593335cae",
  sourceNotes:
    "Both source GeoJSON files are byte-identical to GeoJSON-Mapas. The comarques_icgc filename does not establish ICGC ownership or licensing. Upstream redistribution terms require review before public launch; see docs/GEOGRAPHY.md.",
} as const;

/** Decode the small committed TopoJSON directly; no runtime network or GIS bundle. */
function readGeography(topology: Topology): Comarca[] {
  const geometries = Object.values(topology.objects)[0].geometries;
  const { scale, translate } = topology.transform;
  const arcs: Point2[][] = topology.arcs.map((arc) => {
    let x = 0;
    let y = 0;
    return arc.map((point) => {
      x += point[0];
      y += point[1];
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });

  const coordinates = arcs.flat();
  const longitude = coordinates.map(([x]) => x);
  const latitude = coordinates.map(([, y]) => y);
  const west = Math.min(...longitude);
  const east = Math.max(...longitude);
  const south = Math.min(...latitude);
  const north = Math.max(...latitude);
  const latitudeCorrection = Math.cos((((north + south) / 2) * Math.PI) / 180);
  const unit = 5.8 / ((east - west) * latitudeCorrection);
  const project = ([x, y]: Point2): Point2 => [
    (x - (west + east) / 2) * latitudeCorrection * unit,
    ((north + south) / 2 - y) * unit,
  ];

  // Adjacency comes from exact shared TopoJSON arcs, never centroid proximity.
  const owners = new Map<number, Set<number>>();
  const arcSets = geometries.map((geometry, region) => {
    const indices = new Set(
      (geometry.arcs.flat(Infinity) as number[]).map((arc) =>
        arc < 0 ? ~arc : arc,
      ),
    );
    indices.forEach((arc) => {
      const existing = owners.get(arc) ?? new Set<number>();
      existing.add(region);
      owners.set(arc, existing);
    });
    return indices;
  });

  function stitch(indices: number[]): Point2[] {
    const ring: Point2[] = [];
    indices.forEach((index, i) => {
      const arc = index < 0 ? [...arcs[~index]].reverse() : arcs[index];
      ring.push(...(i === 0 ? arc : arc.slice(1)).map(project));
    });
    return ring;
  }

  return geometries.map((geometry, index) => {
    const parts =
      geometry.type === "Polygon"
        ? [geometry.arcs as number[][]]
        : (geometry.arcs as number[][][]);
    const polygons = parts.map((rings) => rings.map(stitch));
    const adjacent = new Set<number>();
    arcSets[index].forEach((arc) =>
      owners.get(arc)?.forEach((owner) => {
        if (owner !== index) adjacent.add(owner);
      }),
    );
    // Pick the largest outer polygon for an interior route label anchor.
    const ring = [...polygons].sort(
      (a, b) => Math.abs(signedArea(b[0])) - Math.abs(signedArea(a[0])),
    )[0][0];
    return {
      ...geometry.properties,
      polygons,
      center: polygonCenter(ring),
      neighbors: [...adjacent]
        .sort((a, b) => a - b)
        .map((neighbor) => geometries[neighbor].properties.id),
    };
  });
}

function signedArea(ring: Point2[]): number {
  return (
    ring.reduce((sum, [x, y], index) => {
      const next = ring[(index + 1) % ring.length];
      return sum + x * next[1] - next[0] * y;
    }, 0) / 2
  );
}

function polygonCenter(ring: Point2[]): Point2 {
  const area = signedArea(ring);
  if (Math.abs(area) < 1e-9) return ring[0];
  let x = 0;
  let y = 0;
  ring.forEach((point, index) => {
    const next = ring[(index + 1) % ring.length];
    const cross = point[0] * next[1] - next[0] * point[1];
    x += (point[0] + next[0]) * cross;
    y += (point[1] + next[1]) * cross;
  });
  return [x / (6 * area), y / (6 * area)];
}

export const comarques = readGeography(source as Topology);
export const comarcaById = new Map(
  comarques.map((comarca) => [comarca.id, comarca]),
);

/** Isolated shortest-hop illustration of the project's undirected map graph. */
export function findComarcaRoute(start: string, target: string): string[] {
  if (!comarcaById.has(start) || !comarcaById.has(target)) return [];
  const queue = [start];
  const previous = new Map<string, string | null>([[start, null]]);
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const current = queue[cursor];
    if (current === target) {
      const route: string[] = [];
      let node: string | null = current;
      while (node !== null) {
        route.unshift(node);
        node = previous.get(node) ?? null;
      }
      return route;
    }
    comarcaById.get(current)?.neighbors.forEach((neighbor) => {
      if (!previous.has(neighbor)) {
        previous.set(neighbor, current);
        queue.push(neighbor);
      }
    });
  }
  return [];
}

export function isContinuousComarcaRoute(route: string[]): boolean {
  return (
    route.length > 0 &&
    route.every(
      (id, index) =>
        comarcaById.has(id) &&
        (index === 0 ||
          comarcaById.get(route[index - 1])?.neighbors.includes(id)),
    )
  );
}

export const initialComarcaRoute = findComarcaRoute("montsia", "alt-emporda");
