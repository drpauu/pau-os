"use client";
export function PrintButton() {
  return (
    <button className="button secondary" onClick={() => window.print()}>
      Print resume
    </button>
  );
}
