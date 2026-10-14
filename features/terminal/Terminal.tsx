"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X, TerminalSquare } from "lucide-react";
import { useLaboratory } from "@/stores/laboratory";
import { runCommand, completeCommand } from "./commands";
export function Terminal() {
  const dialog = useRef<HTMLDialogElement>(null),
    log = useRef<HTMLDivElement>(null),
    input = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(""),
    [lines, setLines] = useState<{ cmd: string; out: string }[]>([]),
    [history, setHistory] = useState<string[]>([]),
    [cursor, setCursor] = useState(-1);
  const setTerminal = useLaboratory((s) => s.setTerminal),
    setTheme = useLaboratory((s) => s.setTheme),
    router = useRouter();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    input.current?.focus();
    return () => previous?.focus();
  }, []);
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight;
  }, [lines]);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const result = runCommand(value);
    if (value.trim().toLowerCase() === "diagnostics") {
      const canvas = document.querySelector("canvas");
      result.text +=
        "\n\nRENDERER / " + (canvas ? "WebGL2" : "Static / no active canvas");
      if (canvas?.dataset.fps)
        result.text +=
          "\nMeasured FPS: " +
          canvas.dataset.fps +
          " · Draw calls: " +
          canvas.dataset.drawCalls +
          " · Triangles: " +
          canvas.dataset.triangles;
    }
    if (result.clear) setLines([]);
    else setLines((l) => [...l.slice(-79), { cmd: value, out: result.text }]);
    setHistory((h) => [...h.slice(-49), value]);
    setCursor(-1);
    setValue("");
    if (result.theme) setTheme(result.theme);
    if (result.route) {
      setTerminal(false);
      router.push(result.route);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="terminal-dialog"
      aria-labelledby="terminal-title"
      onCancel={() => setTerminal(false)}
      onClick={(e) => {
        if (e.target === dialog.current) setTerminal(false);
      }}
    >
      <div className="terminal-head">
        <TerminalSquare size={17} />
        <h2 id="terminal-title">PAU.OS / Terminal</h2>
        <span className="mono">LOCAL SESSION</span>
        <button
          className="icon-button"
          aria-label="Close terminal"
          onClick={() => setTerminal(false)}
        >
          <X size={19} />
        </button>
      </div>
      <div className="terminal-log" ref={log} role="log" aria-live="polite">
        <p className="terminal-welcome">
          Welcome to the laboratory.
          <br />
          <span>
            Type <b>help</b> to explore. Curiosity is encouraged.
          </span>
        </p>
        {lines.map((l, i) => (
          <div key={i} className="terminal-entry">
            <p>
              <span>visitor@pau.os ~ $</span> {l.cmd}
            </p>
            <pre>{l.out}</pre>
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="terminal-form">
        <label htmlFor="terminal-input">visitor@pau.os ~ $</label>
        <input
          id="terminal-input"
          ref={input}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={240}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Terminal command"
          onKeyDown={(e) => {
            if (e.key === "Tab" && !e.shiftKey) {
              const completed = completeCommand(value);
              if (completed !== value) {
                e.preventDefault();
                setValue(completed);
              }
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              const i =
                cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1);
              setCursor(i);
              setValue(history[i] ?? "");
            }
            if (e.key === "ArrowDown") {
              e.preventDefault();
              const i = cursor + 1;
              setCursor(i >= history.length ? -1 : i);
              setValue(history[i] ?? "");
            }
          }}
        />
      </form>
      <div className="terminal-foot mono">
        TAB AUTOCOMPLETE <span>↑ ↓ HISTORY</span>
        <span>ESC CLOSE</span>
      </div>
    </dialog>
  );
}
