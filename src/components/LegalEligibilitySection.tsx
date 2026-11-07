import React, { useState } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Info,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  DollarSign,
} from "lucide-react";
import {
  HomeownerProfile,
  evaluateDcLegalCompliance,
  LEGAL_REVIEW_DATE,
  LEGAL_SOURCE,
  LEGAL_CODE_SOURCE,
  TAX_SOURCE,
} from "../utils/calculator";

interface LegalCheckerProps {
  profile: HomeownerProfile;
  onChangeProfile: (updates: Partial<HomeownerProfile>) => void;
}

export const LegalEligibilitySection: React.FC<LegalCheckerProps> = ({
  profile,
  onChangeProfile,
}) => {
  const [showFaq, setShowFaq] = useState(false);
  const legal = evaluateDcLegalCompliance(profile);

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-lg md:text-xl font-bold text-white">
              DC Short-Term Rental Compliance & Eligibility
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Decision-support screening from user declarations; not a verified
            license or legal authorization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {legal.isEligible ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Screening: {legal.licenseCategory}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30">
              <XCircle className="w-3.5 h-3.5" />
              Ineligible Under DC Law
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-4">
        Legal sources reviewed {LEGAL_REVIEW_DATE}:{" "}
        <a
          className="text-indigo-300 underline"
          href={LEGAL_SOURCE}
          target="_blank"
          rel="noreferrer"
        >
          DLCP requirements
        </a>{" "}
        ·{" "}
        <a
          className="text-indigo-300 underline"
          href={LEGAL_CODE_SOURCE}
          target="_blank"
          rel="noreferrer"
        >
          DC Code § 30-201.06
        </a>{" "}
        ·{" "}
        <a
          className="text-indigo-300 underline"
          href={TAX_SOURCE}
          target="_blank"
          rel="noreferrer"
        >
          OTR tax notice
        </a>
        . Exemptions require independent review of approved dates and nights; no
        180-night assumption is used.
      </p>
      {/* Interactive Compliance Profile Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
        <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800">
          <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center justify-between">
            <span>Primary Residence Status</span>
            <span className="text-[10px] text-amber-400 font-mono">
              DC Homestead
            </span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onChangeProfile({ isPrimaryResidence: true })}
              className={`flex-1 py-1.5 text-xs rounded font-medium transition ${
                profile.isPrimaryResidence
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Primary (Homestead)
            </button>
            <button
              onClick={() => onChangeProfile({ isPrimaryResidence: false })}
              className={`flex-1 py-1.5 text-xs rounded font-medium transition ${
                !profile.isPrimaryResidence
                  ? "bg-red-600 text-white font-semibold"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Investment / 2nd Home
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            DC strictly prohibits short-term rentals on non-primary residences.
          </p>
        </div>

        <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800">
          <label className="text-xs font-medium text-slate-300 block mb-1.5 flex items-center justify-between">
            <span>Hosting Arrangement</span>
            <span className="text-[10px] text-indigo-400 font-mono">
              Presence
            </span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={() =>
                onChangeProfile({
                  hostPresentDuringStays: true,
                  rentalScope: "spare_room",
                })
              }
              className={`flex-1 py-1.5 text-xs rounded font-medium transition ${
                profile.hostPresentDuringStays
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Hosted (On-Site)
            </button>
            <button
              onClick={() =>
                onChangeProfile({
                  hostPresentDuringStays: false,
                  rentalScope: "entire_home",
                })
              }
              className={`flex-1 py-1.5 text-xs rounded font-medium transition ${
                !profile.hostPresentDuringStays
                  ? "bg-amber-600 text-white font-semibold"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Unhosted (Vacation)
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {profile.hostPresentDuringStays
              ? "Owner present on premises: exempt from 90-night limit."
              : "Host absent: subject to strict 90 cumulative nights/calendar year limit."}
          </p>
        </div>

        <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800 flex flex-col justify-between">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1 flex items-center justify-between">
              <span>Annual Statutory Night Cap</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </label>
            <div className="text-xl font-black text-amber-300 font-mono mt-1">
              {legal.annualNightCap === "Unlimited"
                ? "Unlimited"
                : `${legal.annualNightCap} Nights / Yr`}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{legal.capReason}</p>
          </div>

          {!profile.hostPresentDuringStays && profile.isPrimaryResidence && (
            <div className="pt-2 border-t border-slate-800 mt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={!!profile.hasExemptionFor90NightLimit}
                  onChange={(e) =>
                    onChangeProfile({
                      hasExemptionFor90NightLimit: e.target.checked,
                    })
                  }
                  className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                />
                <span>
                  I declare an exemption (unverified; standard cap retained)
                </span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Warnings & Enforced Limits */}
      {legal.warnings.length > 0 && (
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-lg p-3.5 mb-4 text-xs text-amber-200 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            {legal.warnings.map((w, idx) => (
              <p key={idx} className="leading-relaxed">
                <strong>Legal Alert:</strong> {w}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Requirements vs Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
          <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            Mandatory DC Regulatory Requirements
          </h3>
          <ul className="space-y-1.5 text-slate-300">
            {legal.mandatoryRequirements.map((req, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
          <h3 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Unresolved Verification Items Before Listing
          </h3>
          <ul className="space-y-1.5 text-slate-300">
            {legal.unresolvedVerificationItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">⚠</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Collapsible DC STR Law Summary */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <button
          onClick={() => setShowFaq(!showFaq)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition"
        >
          {showFaq ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
          {showFaq
            ? "Hide DC Short-Term Rental Act Key Facts"
            : "View DC Short-Term Rental Act (DC Law 22-307) Key Facts & Fines"}
        </button>

        {showFaq && (
          <div className="mt-3 p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-2">
            <p>
              <strong>Enactment:</strong> DC Law 22-307 (effective 2019,
              enforced January 2022) established a comprehensive licensing
              regime administered by the Department of Licensing and Consumer
              Protection (DLCP).
            </p>
            <p>
              <strong>Penalties:</strong> Unlicensed operation or violation of
              the unhosted cap can lead to enforcement, fines and license
              suspension or revocation. Consult DLCP for applicable penalties.
            </p>
            <p>
              <strong>Homestead Deduction:</strong> Only homeowners who claim
              the property as their primary residence under DC Tax Code § 47-850
              are eligible to apply.
            </p>
            <p>
              <strong>Guest Lodging Tax:</strong> OTR publishes a 15.95%
              transient accommodations rate through September 30, 2027. Confirm
              collection responsibilities with the booking platform; the
              calculator exposes an editable guest-tax assumption.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
