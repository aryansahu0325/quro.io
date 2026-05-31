import React from 'react';
import { BookOpen, LifeBuoy, MessageSquareMore, FileQuestion } from 'lucide-react';
import { LegalPageShell } from './LegalPageShell';

export const HelpCenterPage: React.FC = () => {
  return (
    <LegalPageShell
      badge="Help center"
      title="Guides and support for the Quro workspace"
      subtitle="A simple hub for getting started, troubleshooting the workspace, and finding the right support path."
      updatedLabel="May 2026"
      summary="Use this page as the first stop for product guidance and support routing."
      stats={[
        { label: 'Getting started', value: 'Upload a document and begin in the workspace' },
        { label: 'Troubleshooting', value: 'Check session state and browser support' },
        { label: 'Support', value: 'Use the account contact path for assistance' },
      ]}
      sections={[
        { id: 'start', label: 'Getting started' },
        { id: 'support', label: 'Support options' },
      ]}
    >
      <section id="start" className="panel p-6 sm:p-7 scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">Getting started</h2>
        </div>
        <ol className="space-y-3 list-decimal pl-5 text-sm leading-7 text-slate-300">
          <li>Sign in or continue as a guest.</li>
          <li>Upload a document into the workspace.</li>
          <li>Review the generated summary and use chat for follow-up analysis.</li>
        </ol>
      </section>

      <section id="support" className="panel p-6 sm:p-7 scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <LifeBuoy className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">Support options</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <MessageSquareMore className="w-5 h-5 text-emerald-400" />
            <p className="mt-3 text-sm leading-6 text-slate-300">Use the platform contact path for account and product questions.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <FileQuestion className="w-5 h-5 text-emerald-400" />
            <p className="mt-3 text-sm leading-6 text-slate-300">For workflow issues, share the document context and the step where the problem occurred.</p>
          </div>
        </div>
      </section>
    </LegalPageShell>
  );
};
