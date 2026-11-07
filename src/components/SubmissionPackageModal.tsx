import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Printer, Copy, X } from "lucide-react";
import { HomeownerProfile } from "../utils/calculator";
import { buildReport } from "../utils/report";
import { buildDemoTimeline } from "./GuidedDemoBar";
import { DATA_SOURCE } from "../data/dcMarketData";
export const SubmissionPackageModal: React.FC<{
  profile: HomeownerProfile;
  isOpen: boolean;
  onClose: () => void;
}> = ({ profile, isOpen, onClose }) => {
  const [tab, setTab] = useState("report"),
    [message, setMessage] = useState("");
  useEffect(() => {
    if (!isOpen) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const report = buildReport(profile),
    steps = buildDemoTimeline(profile);
  const tabs = [
    ["report", "Deliverable C: Two-Page Report"],
    ["script", "Deliverable B: 2:45 Zoom Demo Script"],
    ["error_log", "Development Error Log"],
    ["data_provenance", "Data Methodology"],
    ["checklist", "Submission Checklist"],
  ];
  const print = () => {
    setTab("report");
    requestAnimationFrame(() => requestAnimationFrame(() => window.print()));
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        report.text + "\n\nSources:\n" + report.sources.join("\n"),
      );
      setMessage("Copied Report");
    } catch {
      setMessage("Clipboard unavailable. Select the report text to copy.");
    }
  };
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="StayWise DC submission package"
      className="submission-modal fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
    >
      <div className="submission-shell bg-slate-900 border border-slate-700 rounded-xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        <div className="report-controls px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bold text-lg">
            StayWise DC — Submission Support & 2-Page Report
          </h2>
          <div className="flex gap-2 text-xs">
            <button
              className="bg-slate-800 p-2 rounded flex gap-1"
              onClick={print}
            >
              <Printer size={15} />
              Print PDF
            </button>
            <button
              className="bg-indigo-600 p-2 rounded flex gap-1"
              onClick={copy}
            >
              <Copy size={15} />
              Copy Text
            </button>
            <button aria-label="Close report" className="p-2" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
          <p role="status" className="text-xs w-full">
            {message}
          </p>
        </div>
        <nav className="report-controls flex gap-2 overflow-auto text-xs border-b border-slate-800 px-4">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`py-3 px-2 whitespace-nowrap ${tab === id ? "text-amber-300 border-b-2 border-amber-400" : "text-slate-400"}`}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="submission-content p-5 overflow-y-auto flex-1 text-sm">
          {tab === "report" && (
            <article className="report-document text-slate-900 bg-white rounded-lg p-6 max-w-4xl mx-auto">
              {[report.sections.slice(0, 4), report.sections.slice(4)].map(
                (sections, i) => (
                  <div className="report-page" key={i}>
                    <header className="border-b-2 border-slate-700 pb-3 mb-4">
                      <h1 className="text-xl font-bold">
                        StayWise DC: Should a DC Homeowner Host?
                      </h1>
                      <p className="text-xs mt-1">
                        Current homeowner decision report · Page {i + 1} of 2 ·
                        Snapshot {DATA_SOURCE.snapshotDate}
                      </p>
                    </header>
                    {sections.map((section) => (
                      <section key={section.title} className="mb-4">
                        <h2 className="text-sm font-bold border-b border-slate-300 pb-1 mb-2">
                          {section.title}
                        </h2>
                        {section.paragraphs.map((p, j) => (
                          <p className="text-xs leading-relaxed mb-2" key={j}>
                            {p}
                          </p>
                        ))}
                      </section>
                    ))}
                    {i === 1 && (
                      <div className="text-[9px] break-all space-y-1">
                        <strong>Sources</strong>
                        {report.sources.map((url) => (
                          <p key={url}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              {url}
                            </a>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              )}
            </article>
          )}
          {tab === "script" && (
            <div className="space-y-4">
              {steps.map((s) => (
                <section
                  className="bg-slate-950 p-4 rounded-lg border border-slate-800"
                  key={s.id}
                >
                  <h3 className="text-amber-300 font-bold">
                    {s.timecode} — {s.title}
                  </h3>
                  <p className="text-sm mt-2">{s.presenterScript}</p>
                </section>
              ))}
            </div>
          )}
          {tab === "error_log" && (
            <section className="p-4 bg-slate-950 rounded-lg space-y-3">
              <h3 className="text-amber-300 font-bold">
                Observed source inconsistencies
              </h3>
              {report.sections[5].paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
          )}
          {tab === "data_provenance" && (
            <section className="p-4 bg-slate-950 rounded-lg space-y-3">
              <h3 className="text-amber-300 font-bold">Data provenance</h3>
              {report.sections[1].paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p className="break-all">
                Original CSV SHA-256: {DATA_SOURCE.sha256}
              </p>
              <a
                download
                href={`${import.meta.env.BASE_URL}assets/dc-listings-2026-09-19.csv`}
                className="text-indigo-300 underline"
              >
                Download the original 6,906-record CSV
              </a>
            </section>
          )}
          {tab === "checklist" && (
            <section className="space-y-3">
              <h3 className="font-bold text-amber-300">
                Manual submission checklist (unchecked until reviewed)
              </h3>
              {[
                "Independently verify public app access and add its URL.",
                "Record the walkthrough and verify the Zoom sharing link.",
                "Review current financial inputs, tax assumptions and matching market samples.",
                "Run tests, TypeScript checking and the production build; retain actual results.",
                "Independently confirm residence, licensing, restrictions, exemption documentation and tax obligations.",
                "Preview the printed report and verify two readable pages.",
                "Confirm AI tools disclosure with the team; do not invent earlier model versions.",
              ].map((t) => (
                <label key={t} className="flex gap-3 bg-slate-950 p-3 rounded">
                  <input type="checkbox" />
                  {t}
                </label>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
