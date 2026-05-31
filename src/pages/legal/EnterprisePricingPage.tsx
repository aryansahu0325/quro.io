import React from 'react';
import { CreditCard, Sparkles, Building2, MessageCircleQuestion } from 'lucide-react';
import { LegalPageShell } from './LegalPageShell';

export const EnterprisePricingPage: React.FC = () => {
  return (
    <LegalPageShell
      badge="Enterprise pricing"
      title="Pricing for teams that need control and scale"
      subtitle="This page gives a simple overview of how the platform is packaged for teams, departments, and enterprise deployments."
      updatedLabel="May 2026"
      summary="Contact sales for deployment-specific requirements, volume pricing, and security review materials."
      stats={[
        { label: 'Teams', value: 'Shared workspaces and central billing' },
        { label: 'Enterprise', value: 'Security review and custom onboarding' },
        { label: 'Support', value: 'Priority response available by agreement' },
      ]}
      sections={[
        { id: 'tiers', label: 'Suggested tiers' },
        { id: 'contact', label: 'Contact sales' },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'Starter', price: 'For individual researchers', detail: 'Core workspace tools, standard support, and limited usage.' },
          { name: 'Team', price: 'For collaborative groups', detail: 'Shared workflows, higher usage limits, and admin controls.' },
          { name: 'Enterprise', price: 'For regulated environments', detail: 'Custom deployment planning, procurement support, and tailored onboarding.' },
        ].map((plan) => (
          <div key={plan.name} className="glass-card p-5 bg-[#0e0f15]/80 border-white/10">
            <p className="text-xs uppercase tracking-[0.22em] text-emerald-400 font-semibold">{plan.name}</p>
            <p className="mt-2 text-lg font-semibold text-white">{plan.price}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{plan.detail}</p>
          </div>
        ))}
      </div>

      <section id="tiers" className="panel p-6 sm:p-7 scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">How packages are usually structured</h2>
        </div>
        <p className="text-sm leading-7 text-slate-300">
          Most customers start with a simple workspace plan and then move to team or enterprise packaging when they need shared governance, custom limits, or procurement support.
        </p>
      </section>

      <section id="contact" className="panel p-6 sm:p-7 scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">Contact sales</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <p className="mt-3 text-sm leading-6 text-slate-300">Need a procurement packet, security overview, or a walkthrough for your team? Start here.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <MessageCircleQuestion className="w-5 h-5 text-emerald-400" />
            <p className="mt-3 text-sm leading-6 text-slate-300">Enterprise conversations can be handled through the platform support channel or your account contact path.</p>
          </div>
        </div>
      </section>
    </LegalPageShell>
  );
};
