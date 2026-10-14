import { describe, expect, it } from "vitest";
import {
  comarcaById,
  comarques,
  findComarcaRoute,
  geographySource,
  initialComarcaRoute,
  isContinuousComarcaRoute,
} from "../lib/geography";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

describe("Camí Curt source geography", () => {
  it("preserves the exact inspected source snapshot", () => {
    const source = readFileSync(
      new URL("../data/catalunya-comarques.json", import.meta.url),
    );
    expect(createHash("sha256").update(source).digest("hex")).toBe(
      geographySource.sha256,
    );
    expect(comarques).toHaveLength(41);
    expect(new Set(comarques.map(({ id }) => id)).size).toBe(41);
    expect(
      comarques.reduce((sum, region) => sum + region.neighbors.length, 0) / 2,
    ).toBe(95);
  });

  it("keeps the source graph symmetric, with no self-loops or invented nodes", () => {
    for (const region of comarques) {
      expect(region.neighbors).not.toContain(region.id);
      for (const neighbor of region.neighbors) {
        expect(comarcaById.get(neighbor)?.neighbors).toContain(region.id);
      }
    }
    // Independently verified against Camí Curt's topojson-client.neighbors output.
    expect(comarcaById.get("barcelones")?.neighbors).toEqual([
      "baix-llobregat",
      "maresme",
      "valles-occidental",
      "valles-oriental",
    ]);
  });

  it("preserves closed finite geographic rings and north-up orientation", () => {
    const points = comarques.flatMap(({ polygons }) =>
      polygons.flat(1).flat(1),
    );
    expect(
      Math.max(...points.map(([x]) => x)) - Math.min(...points.map(([x]) => x)),
    ).toBeCloseTo(5.8);
    for (const region of comarques) {
      for (const polygon of region.polygons)
        for (const ring of polygon) {
          expect(ring.length).toBeGreaterThan(3);
          expect(ring[0]).toEqual(ring.at(-1));
          expect(ring.flat().every(Number.isFinite)).toBe(true);
        }
    }
    expect(comarcaById.get("val-d-aran")!.center[1]).toBeLessThan(
      comarcaById.get("montsia")!.center[1],
    );
    expect(comarcaById.get("segria")!.center[0]).toBeLessThan(
      comarcaById.get("alt-emporda")!.center[0],
    );
  });

  it("only illustrates routes across actual shared boundaries", () => {
    expect(initialComarcaRoute[0]).toBe("montsia");
    expect(initialComarcaRoute.at(-1)).toBe("alt-emporda");
    expect(isContinuousComarcaRoute(initialComarcaRoute)).toBe(true);
    for (const region of comarques) {
      const route = findComarcaRoute("montsia", region.id);
      expect(route.at(-1)).toBe(region.id);
      expect(isContinuousComarcaRoute(route)).toBe(true);
    }
    expect(findComarcaRoute("barcelones", "maresme")).toEqual([
      "barcelones",
      "maresme",
    ]);
    expect(findComarcaRoute("montsia", "montsia")).toEqual(["montsia"]);
    expect(findComarcaRoute("unknown", "barcelones")).toEqual([]);
    expect(isContinuousComarcaRoute(["montsia", "alt-emporda"])).toBe(false);
  });
});
