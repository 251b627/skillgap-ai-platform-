import React from 'react';
import { CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { APPLICATION_STATUS } from '../../constants/statusTypes';

const STAGES = [
  APPLICATION_STATUS.APPLIED,
  APPLICATION_STATUS.SHORTLISTED,
  APPLICATION_STATUS.ASSESSMENT,
  APPLICATION_STATUS.INTERVIEW,
  APPLICATION_STATUS.SELECTED,
];

export const ApplicationTimeline = ({ currentStatus, history = [] }) => {
  const isRejected = currentStatus === APPLICATION_STATUS.REJECTED;

  return (
    <div className="py-4">
      {/* Horizontal progress stages */}
      <div className="flex items-center justify-between relative mb-8">
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />

        {STAGES.map((stage, idx) => {
          const histItem = history.find((h) => h.status === stage);
          const isPassed = !!histItem;
          const isCurrent = currentStatus === stage;

          return (
            <div key={stage} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                  isPassed
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-brand-600 border-brand-600 text-white shadow-md'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
              </div>
              <span className={`text-xs mt-2 font-medium hidden sm:block ${
                isPassed || isCurrent ? 'text-slate-900 font-semibold' : 'text-slate-400'
              }`}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      {isRejected && (
        <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Application was marked as <strong>Rejected</strong> by the talent evaluation committee.</span>
        </div>
      )}

      {/* History Log Timeline */}
      <div className="border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity Log & Remarks</h4>
        {history.map((h, i) => (
          <div key={h.history_id || i} className="relative group">
            <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-brand-500 ring-4 ring-white" />
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-800">{h.status}</span>
                <span className="text-slate-400">{formatDateTime(h.changed_at)}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{h.remarks}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
