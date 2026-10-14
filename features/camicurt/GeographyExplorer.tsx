"use client";

import { useId, useMemo, useState } from "react";
import {
  comarcaById,
  comarques,
  findComarcaRoute,
  geographySource,
} from "@/lib/geography";
import styles from "./GeographyExplorer.module.css";

const mapPaths = comarques.map((region) => ({
  id: region.id,
  path: region.polygons
    .map((polygon) =>
      polygon
        .map(
          (ring) =>
            ring
              .map(
                ([x, z], index) =>
                  `${index === 0 ? "M" : "L"}${x.toFixed(4)},${z.toFixed(4)}`,
              )
              .join(" ") + " Z",
        )
        .join(" "),
    )
    .join(" "),
}));

/** Standalone local graph illustration; this never touches Camí Curt sessions. */
export function GeographyExplorer() {
  const id = useId();
  const [start, setStart] = useState("montsia");
  const [end, setEnd] = useState("alt-emporda");
  const route = useMemo(() => findComarcaRoute(start, end), [start, end]);
  const routePoints = route
    .map((region) => comarcaById.get(region)!.center.join(","))
    .join(" ");

  return (
    <section className={styles.explorer} aria-labelledby={`${id}-title`}>
      <div className={styles.map}>
        <svg
          viewBox="-3.15 -3.15 6.3 6.3"
          role="img"
          aria-labelledby={`${id}-map`}
        >
          <title
            id={`${id}-map`}
          >{`Catalonia: a route from ${comarcaById.get(start)!.name} to ${comarcaById.get(end)!.name}`}</title>
          {mapPaths.map(({ id: region, path }) => (
            <path
              key={region}
              d={path}
              fill={route.includes(region) ? "#acd4bd" : "#344b47"}
              stroke="#0f2420"
              strokeWidth="0.018"
              fillRule="evenodd"
            />
          ))}
          <polyline
            points={routePoints}
            fill="none"
            stroke="#eff9c5"
            strokeWidth="0.022"
            strokeLinejoin="round"
          />
          {route.map((region) => {
            const [x, z] = comarcaById.get(region)!.center;
            return (
              <circle
                key={region}
                cx={x}
                cy={z}
                r="0.045"
                fill="#f3ffd5"
                stroke="#3c6957"
                strokeWidth="0.012"
              />
            );
          })}
        </svg>
        <span className={styles.mapLabel}>
          41 REGIONS · SHARED-BOUNDARY GRAPH
        </span>
      </div>
      <div className={styles.controls}>
        <span className={styles.eyebrow}>
          A little geography. A little graph theory.
        </span>
        <h2 id={`${id}-title`}>Every border is a connection.</h2>
        <p>
          Choose two comarques to find a route with the fewest border crossings.
          Each step must share a boundary with the next region.
        </p>
        <div className={styles.fields}>
          <div>
            <label htmlFor={`${id}-start`}>Start</label>
            <select
              id={`${id}-start`}
              value={start}
              onChange={(event) => setStart(event.target.value)}
            >
              {comarques.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-end`}>Destination</label>
            <select
              id={`${id}-end`}
              value={end}
              onChange={(event) => setEnd(event.target.value)}
            >
              {comarques.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className={styles.result}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <strong>
            {route.length - 1} border{" "}
            {route.length === 2 ? "crossing" : "crossings"}
          </strong>
          <p>
            {route.map((region) => comarcaById.get(region)!.name).join(" → ")}
          </p>
        </div>
        <p className={styles.note}>
          An isolated explorer using Camí Curt’s map dataset. The full game adds
          its own levels and route rules.
          <br />
          <a href={geographySource.url} target="_blank" rel="noreferrer">
            Map source: {geographySource.attribution} ↗
          </a>
        </p>
      </div>
    </section>
  );
}
