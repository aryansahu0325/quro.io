import React from 'react';
import { Activity, CheckCircle2 } from 'lucide-react';
import { LegalPageShell } from './LegalPageShell';

const services = [
  { name: 'API Gateway', status: 'Operational', ping: '12ms' },
  { name: 'Database', status: 'Operational', ping: '45ms' },
  { name: 'Vector Store', status: 'Operational', ping: '38ms' },
  { name: 'LLM Inference', status: 'Operational', ping: '65ms' },
  { name: 'Redis Cache', status: 'Operational', ping: '1ms' },
  { name: 'Transactional Email', status: 'Operational', ping: '24ms' },
];

export const SystemStatusPage: React.FC = () => {
  return (
    <LegalPageShell
      badge="System status"
      title="Live operational snapshot"
      subtitle="A compact view of the current system health across core platform services."
      updatedLabel="Live view"
      summary="This page mirrors the status card exposed in the footer and gives users a clean, dedicated overview of platform availability."
      stats={[
        { label: 'Overall', value: 'All systems operational' },
        { label: 'Latency', value: '~42ms globally' },
        { label: 'Uptime', value: 'Targeting 99.9% availability' },
      ]}
      sections={[
        { id: 'snapshot', label: 'Current snapshot' },
        { id: 'services', label: 'Service health' },
      ]}
    >
      <section id="snapshot" className="panel p-6 sm:p-7 scroll-mt-24 space-y-4 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.45)] animate-pulse" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">All systems operational</h2>
        <p className="text-sm text-emerald-400/90">Latency remains within the normal operating range.</p>
      </section>

      <section id="services" className="panel p-6 sm:p-7 scroll-mt-24 space-y-3">
        {services.map((service) => (
          <div key={service.name} className="flex items-center justify-between rounded-2xl border border-white/[0.05] bg-black/30 px-4 py-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-slate-200">{service.name}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="text-emerald-400">{service.status}</span>
              <span className="text-slate-500 w-12 text-right">{service.ping}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="panel p-6 sm:p-7 flex items-start gap-3">
        <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-semibold text-white">Status updates</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            If an incident occurs, the status page is the first place we surface operational changes and service recovery notes.
          </p>
        </div>
      </section>
    </LegalPageShell>
  );
};
