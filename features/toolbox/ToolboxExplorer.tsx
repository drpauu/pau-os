"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import {
  Braces,
  Globe2,
  Database,
  Workflow,
  Network,
  ArrowUpRight,
} from "lucide-react";
import toolbox from "@/data/toolbox.json";
import styles from "./ToolboxExplorer.module.css";

const icons = [Braces, Globe2, Database, Workflow, Network];

export function ToolboxExplorer() {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const category = toolbox.categories[selected];

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (["ArrowDown", "ArrowRight"].includes(event.key))
      next = (index + 1) % toolbox.categories.length;
    else if (["ArrowUp", "ArrowLeft"].includes(event.key))
      next =
        (index - 1 + toolbox.categories.length) % toolbox.categories.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = toolbox.categories.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <section
      id="toolbox"
      className={styles.explorer}
      aria-labelledby={`${id}-title`}
    >
      <noscript>
        <style>{`.${styles.panel}[hidden]{display:block!important}.${styles.categories}{display:none!important}`}</style>
      </noscript>
      <div className={styles.intro}>
        <div>
          <p className="eyebrow">TOOLS, SYSTEMS & IDEAS</p>
          <h2 id={`${id}-title`}>My toolbox.</h2>
        </div>
        <p>
          The languages, tools and concepts I work with.
          <br />
          Always learning. Always building.
        </p>
      </div>
      <div className={styles.layout}>
        <div
          role="tablist"
          aria-label="Toolbox categories"
          aria-orientation="vertical"
          className={styles.categories}
        >
          {toolbox.categories.map((group, index) => {
            const Icon = icons[index];
            return (
              <button
                key={group.title}
                ref={(node) => {
                  tabs.current[index] = node;
                }}
                role="tab"
                id={`${id}-tab-${index}`}
                aria-controls={`${id}-panel-${index}`}
                aria-selected={selected === index}
                tabIndex={selected === index ? 0 : -1}
                onClick={() => setSelected(index)}
                onKeyDown={(event) => navigate(event, index)}
                className={styles.category}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{group.title}</span>
                <span className={styles.index} aria-hidden="true">
                  0{index + 1}
                </span>
              </button>
            );
          })}
        </div>
        {toolbox.categories.map((group, index) => (
          <div
            key={group.title}
            role="tabpanel"
            id={`${id}-panel-${index}`}
            aria-labelledby={`${id}-tab-${index}`}
            hidden={selected !== index}
            tabIndex={0}
            className={styles.panel}
          >
            <div className={styles.panelHeading}>
              <h3>{group.title}</h3>
              <span>{group.items.length} entries</span>
            </div>
            <ol className={styles.items}>
              {group.items.map((item, itemIndex) => (
                <li key={item}>
                  <span aria-hidden="true">
                    {String(itemIndex + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <div className={styles.source}>
        <span>From my GitHub Toolbox · same words, same order.</span>
        <a
          href="https://github.com/drpauu/drpauu#toolbox"
          target="_blank"
          rel="noreferrer"
        >
          View source <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
      <span className={styles.screenReader} aria-live="polite">
        {category.title}, {category.items.length} entries
      </span>
    </section>
  );
}
