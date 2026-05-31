import React from 'react';
import { motion } from 'framer-motion';
import { Database, Lock, ShieldCheck, KeyRound, FileLock2, EyeOff } from 'lucide-react';
import { LegalPageShell } from './LegalPageShell';

const sections = [
  { id: 'principles', label: 'Privacy principles' },
  { id: 'collected', label: 'Data we collect' },
  { id: 'usage', label: 'How we use data' },
  { id: 'sharing', label: 'Sharing and subprocessors' },
  { id: 'retention', label: 'Retention and security' },
  { id: 'rights', label: 'Your rights' },
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

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <LegalPageShell
      badge="Privacy policy"
      title="Privacy built around minimum access"
      subtitle="We keep the policy focused on the essentials: what data is collected, why it is processed, and how we keep your documents and conversations isolated from unrelated use."
      updatedLabel="May 2026"
      summary="Quro processes the data you intentionally provide to deliver workspace, search, and analysis features. We avoid unnecessary collection and do not sell personal data."
      stats={[
        { label: 'Collection', value: 'Only what is needed for authentication and processing' },
        { label: 'Training', value: 'Your private content is not used to train public models' },
        { label: 'Sharing', value: 'Only with essential infrastructure subprocessors' },
      ]}
      sections={sections}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Document-first', copy: 'Files are processed to deliver the requested analysis and retrieval experience.' },
          { title: 'Least privilege', copy: 'We retain only the operational data needed to run the account and session.' },
          { title: 'No selling', copy: 'We do not sell, rent, or trade your personal information.' },
          { title: 'Controlled sharing', copy: 'Only essential service providers are involved, under confidentiality obligations.' },
        ].map((item) => (
          <div key={item.title} className="glass-card p-5 bg-[#0e0f15]/80 border-white/10">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-400 font-semibold">{item.title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.copy}</p>
          </div>
        ))}
      </div>

      <SectionCard id="principles" title="1. Privacy principles" icon={<ShieldCheck className="w-5 h-5" />}>
        <p>
          We design the platform so that document content, chat interactions, and session outputs are only used to provide your active workspace.
        </p>
        <p>
          The goal is to keep your analysis environment useful without requiring broad access to unrelated personal data.
        </p>
      </SectionCard>

      <SectionCard id="collected" title="2. Data we collect" icon={<Database className="w-5 h-5" />}>
        <ul className="space-y-3 list-disc pl-5">
          <li>Account details such as email address and authentication metadata.</li>
          <li>Documents, images, or other files you explicitly upload for processing.</li>
          <li>Workspace and session information needed to restore your analysis context.</li>
          <li>Minimal operational telemetry required to keep the service stable and secure.</li>
        </ul>
      </SectionCard>

      <SectionCard id="usage" title="3. How we use data" icon={<KeyRound className="w-5 h-5" />}>
        <p>
          We use your data to authenticate sessions, analyze uploaded documents, generate summaries, answer questions, and maintain the continuity of the workspace.
        </p>
        <p>
          We do not use your private documents or chat history to train public foundation models outside your active experience.
        </p>
      </SectionCard>

      <SectionCard id="sharing" title="4. Sharing and subprocessors" icon={<FileLock2 className="w-5 h-5" />}>
        <p>
          We do not sell or lease your information. Limited data may be shared with subprocessors that provide core infrastructure, such as database, storage, vector search, or transactional messaging services.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          Those providers are selected for reliability and are expected to follow appropriate confidentiality and security commitments.
        </div>
      </SectionCard>

      <SectionCard id="retention" title="5. Retention and security" icon={<Lock className="w-5 h-5" />}>
        <p>
          We keep data only for as long as it is needed to provide your workspace, satisfy legal obligations, or maintain the service.
        </p>
        <p>
          Access is protected with transport encryption, access controls, and service-level safeguards intended to reduce unauthorized exposure.
        </p>
      </SectionCard>

      <SectionCard id="rights" title="6. Your rights" icon={<EyeOff className="w-5 h-5" />}>
        <p>
          Depending on your location, you may have rights to access, correct, delete, or export personal data. You can also ask questions about the information linked to your account.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-400">
          Last updated: May 2026
        </div>
      </SectionCard>
    </LegalPageShell>
  );
};
