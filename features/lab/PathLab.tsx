"use client";
import { useMemo, useState } from "react";
import { nodes, edges, shortestPath } from "./pathfinding";
export function PathLab() {
  const [start, setStart] = useState("A"),
    [end, setEnd] = useState("F"),
    [show, setShow] = useState(true);
  const result = useMemo(() => shortestPath(edges, start, end), [start, end]);
  return (
    <div className="lab-layout">
      <div className="graph-panel">
        <svg
          viewBox="0 0 590 370"
          role="group"
          aria-label="Interactive weighted graph. Select a node to change the destination."
        >
          {edges.map((e, i) => {
            const a = nodes.find((n) => n.id === e.a)!,
              b = nodes.find((n) => n.id === e.b)!;
            const active =
              show &&
              result.path.some(
                (n, i, p) =>
                  (n === e.a && p[i + 1] === e.b) ||
                  (n === e.b && p[i + 1] === e.a),
              );
            return (
              <g key={i}>
                <line
                  className={"graph-edge " + (active ? "active" : "")}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                />
                <rect
                  x={(a.x + b.x) / 2 - 10}
                  y={(a.y + b.y) / 2 - 17}
                  width="20"
                  height="20"
                  fill="#10232e"
                />
                <text
                  textAnchor="middle"
                  x={(a.x + b.x) / 2}
                  y={(a.y + b.y) / 2 - 3}
                >
                  {e.weight}
                </text>
              </g>
            );
          })}
          {nodes.map((n) => (
            <g
              key={n.id}
              className={
                "graph-node " +
                (show && result.path.includes(n.id) ? "active" : "")
              }
              transform={`translate(${n.x},${n.y})`}
              tabIndex={0}
              role="button"
              aria-label={"Set destination " + n.id}
              aria-pressed={end === n.id}
              onClick={() => {
                setEnd(n.id);
                setShow(true);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setEnd(n.id);
                  setShow(true);
                }
              }}
            >
              <circle r="23" />
              <text textAnchor="middle" y="4">
                {n.id}
              </text>
            </g>
          ))}
        </svg>
        <div className="graph-legend mono">
          <span>EXPERIMENT 001 / DIJKSTRA</span>
          <span>ILLUSTRATIVE GRAPH</span>
        </div>
      </div>
      <div className="lab-options">
        <h2>
          The shortest way
          <br />
          isn’t always obvious.
        </h2>
        <p>
          A small, working graph experiment. Change the endpoints and watch
          Dijkstra’s algorithm choose the lowest-cost route. Edge labels are
          weights, not physical distances.
        </p>
        <div className="lab-inputs">
          <label>
            START
            <select
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                setShow(true);
              }}
            >
              {nodes.map((n) => (
                <option key={n.id}>{n.id}</option>
              ))}
            </select>
          </label>
          <label>
            DESTINATION
            <select
              value={end}
              onChange={(e) => {
                setEnd(e.target.value);
                setShow(true);
              }}
            >
              {nodes.map((n) => (
                <option key={n.id}>{n.id}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="path-output" aria-live="polite">
          {show ? (
            <>
              {result.path.join(" → ")}
              <small>
                Cost: {result.cost} · Nodes examined: {result.visited.length}
                <br />
                Visit order: {result.visited.join(" · ")}
              </small>
            </>
          ) : (
            "Path hidden. Trace your own route first."
          )}
        </div>
        <button className="button secondary" onClick={() => setShow(!show)}>
          {show ? "Hide solution" : "Reveal shortest path"} <span>↗</span>
        </button>
      </div>
    </div>
  );
}
