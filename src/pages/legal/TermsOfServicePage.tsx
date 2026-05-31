import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, Shield, Users, AlertTriangle, Scale } from 'lucide-react';
import { LegalPageShell } from './LegalPageShell';

const sections = [
  { id: 'acceptance', label: 'Acceptance of terms' },
  { id: 'service', label: 'Service description' },
  { id: 'responsibilities', label: 'User responsibilities' },
  { id: 'content', label: 'Content & ownership' },
  { id: 'limits', label: 'Limits of liability' },
  { id: 'contact', label: 'Contact' },
];

const SectionCard: React.FC<{ id: string; title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ id, title, icon, children }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.35 }}
    className="panel p-6 sm:p-7 scroll-mt-24"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
        {icon}
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">{title}</h2>
    </div>
    <div className="space-y-4 text-sm leading-7 text-slate-300">{children}</div>
  </motion.section>
);

export const TermsOfServicePage: React.FC = () => {
  return (
    <LegalPageShell
      badge="Terms of service"
      title="Clear rules for using the Quro platform"
      subtitle="These terms explain how the platform works, what you may do with it, and the responsibilities that apply when you upload documents or use the AI workspace."
      updatedLabel="May 2026"
      summary="We keep this policy direct and operational: the platform is for lawful document intelligence workflows, and access is conditioned on respecting user credentials, document rights, and system integrity."
      stats={[
        { label: 'Scope', value: 'All users and authenticated sessions' },
        { label: 'Enforcement', value: 'Access may be suspended for abuse or misuse' },
        { label: 'Questions', value: 'Reach support through the platform portal' },
      ]}
      sections={sections}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Use lawfully', value: 'Upload and process only content you have the right to use.' },
          { label: 'Protect access', value: 'Keep credentials private and avoid account sharing.' },
          { label: 'Respect limits', value: 'Do not attempt abuse, scraping, or infrastructure probing.' },
        ].map((item) => (
          <div key={item.label} className="glass-card p-5 bg-[#0e0f15]/80 border-white/10">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-400 font-semibold">{item.label}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.value}</p>
          </div>
        ))}
      </div>

      <SectionCard id="acceptance" title="1. Acceptance of terms" icon={<CheckCircle2 className="w-5 h-5" />}>
        <p>
          By accessing or using Quro, you agree to these terms and any supplemental policies that may apply to a specific feature, integration, or enterprise agreement.
        </p>
        <p>
          If you do not agree with the terms, you should not use the platform or upload documents for processing.
        </p>
      </SectionCard>

      <SectionCard id="service" title="2. Service description" icon={<FileText className="w-5 h-5" />}>
        <p>
          Quro provides document ingestion, retrieval, and AI-assisted analysis tools designed for research and knowledge workflows. Features may change over time as the platform evolves.
        </p>
        <p>
          We may update, suspend, or discontinue portions of the service when necessary for security, reliability, or product changes.
        </p>
      </SectionCard>

      <SectionCard id="responsibilities" title="3. User responsibilities" icon={<Users className="w-5 h-5" />}>
        <ul className="space-y-3 list-disc pl-5">
          <li>Keep your login credentials, API keys, and account access private.</li>
          <li>Only upload documents, files, and metadata you are authorized to process.</li>
          <li>Do not introduce malware, attempt unauthorized access, or interfere with the platform’s infrastructure.</li>
          <li>Use the service in compliance with all applicable laws, contracts, and internal policies.</li>
        </ul>
      </SectionCard>

      <SectionCard id="content" title="4. Content and ownership" icon={<Shield className="w-5 h-5" />}>
        <p>
          You retain ownership of the content you submit. We process that content only to provide the requested analysis, retrieval, and workspace features.
        </p>
        <p>
          Where the platform generates summaries or derived outputs, those outputs are intended for your internal use within the service context unless a separate agreement says otherwise.
        </p>
      </SectionCard>

      <SectionCard id="limits" title="5. Limits of liability" icon={<Scale className="w-5 h-5" />}>
        <p>
          The service is provided on an as-available basis. While we design for reliability, we do not guarantee uninterrupted access, error-free results, or suitability for every use case.
        </p>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-amber-100">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <p className="text-sm leading-6 m-0">
              You are responsible for verifying outputs before relying on them for compliance, legal, operational, or safety-critical decisions.
            </p>
          </div>
        </div>
      </SectionCard>

      <SectionCard id="contact" title="6. Contact" icon={<FileText className="w-5 h-5" />}>
        <p>
          For questions about these terms, use the support portal or the contact path provided in your account workspace.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-400">
          Last updated: May 2026
        </div>
      </SectionCard>
    </LegalPageShell>
  );
};
