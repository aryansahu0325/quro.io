import React from 'react';
import { Shield, Lock, Cpu, Globe } from 'lucide-react';
import { LegalPageShell } from './LegalPageShell';

export const SecurityArchitecturePage: React.FC = () => {
  return (
    <LegalPageShell
      badge="Security architecture"
      title="Security designed for document workloads"
      subtitle="The platform combines transport encryption, isolated storage, and strict service boundaries to protect documents and session data during processing."
      updatedLabel="May 2026"
      summary="This page summarizes the security model used across the workspace, APIs, and supporting services."
      stats={[
        { label: 'Transport', value: 'TLS-encrypted connections' },
        { label: 'Storage', value: 'Encrypted at rest' },
        { label: 'Access', value: 'Restricted by authenticated sessions' },
      ]}
      sections={[
        { id: 'encryption', label: 'Encryption' },
        { id: 'isolation', label: 'Isolation' },
        { id: 'abuse', label: 'Abuse prevention' },
      ]}
    >
      <section id="encryption" className="panel p-6 sm:p-7 scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">Encryption at rest and in transit</h2>
        </div>
        <p className="text-sm leading-7 text-slate-300">
          Service traffic is protected in transit, and stored assets are designed to remain encrypted at rest across the core operational layers.
        </p>
      </section>

      <section id="isolation" className="panel p-6 sm:p-7 scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">Workspace isolation</h2>
        </div>
        <p className="text-sm leading-7 text-slate-300">
          Document vectors, sessions, and account data are logically separated so that one user’s content is not exposed to another user’s workspace.
        </p>
      </section>

      <section id="abuse" className="panel p-6 sm:p-7 scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">Abuse prevention and rate limiting</h2>
        </div>
        <p className="text-sm leading-7 text-slate-300">
          API and workspace boundaries are protected with rate controls and operational checks to reduce abuse and keep the service responsive under load.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          The platform is built to favor reliability, but no internet-facing service can promise zero risk.
        </div>
      </section>

      <section className="panel p-6 sm:p-7 flex items-start gap-3">
        <Globe className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-semibold text-white">Operational visibility</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Monitoring, logging, and service health checks are used to diagnose incidents and maintain operational continuity.
          </p>
        </div>
      </section>
    </LegalPageShell>
  );
};
