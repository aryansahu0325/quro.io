import React from 'react';
import { ShieldCheck, Settings2, Fingerprint, BarChart3 } from 'lucide-react';
import { LegalPageShell } from './LegalPageShell';

export const CookiePreferencesPage: React.FC = () => {
  return (
    <LegalPageShell
      badge="Cookie preferences"
      title="Control the cookies used by the platform"
      subtitle="This page explains the categories of cookies and similar technologies used to keep the platform secure and useful."
      updatedLabel="May 2026"
      summary="We keep cookie use limited to what is needed for session continuity, security, and basic analytics where enabled."
      stats={[
        { label: 'Essential', value: 'Required for sign-in and session stability' },
        { label: 'Analytics', value: 'Only used if enabled for product insight' },
        { label: 'Control', value: 'Manage through browser and account settings' },
      ]}
      sections={[
        { id: 'categories', label: 'Cookie categories' },
        { id: 'controls', label: 'Preference controls' },
      ]}
    >
      <section id="categories" className="panel p-6 sm:p-7 scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <Fingerprint className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">Cookie categories</h2>
        </div>
        <ul className="space-y-3 list-disc pl-5 text-sm leading-7 text-slate-300">
          <li>Essential cookies for authentication, session continuity, and security checks.</li>
          <li>Preference cookies to remember interface choices when that feature is available.</li>
          <li>Analytics cookies or equivalents used only for improving the product experience.</li>
        </ul>
      </section>

      <section id="controls" className="panel p-6 sm:p-7 scroll-mt-24 space-y-4">
        <div className="flex items-center gap-3">
          <Settings2 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">Preference controls</h2>
        </div>
        <p className="text-sm leading-7 text-slate-300">
          You can manage cookies through your browser settings. Where the platform offers preference controls, those settings will override non-essential categories when possible.
        </p>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
          Blocking essential cookies may prevent sign-in or other core features from working correctly.
        </div>
      </section>

      <section className="panel p-6 sm:p-7 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-semibold text-white">Security and analytics</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            Any analytics usage is kept narrow and product-focused. We do not use cookie data to build behavioral profiles for unrelated third parties.
          </p>
        </div>
      </section>

      <section className="panel p-6 sm:p-7 flex items-start gap-3">
        <BarChart3 className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
        <div>
          <h2 className="text-lg font-semibold text-white">Questions</h2>
          <p className="mt-2 text-sm leading-7 text-slate-300">
            If you need a cookie-specific change for your organization, contact support through your account workspace.
          </p>
        </div>
      </section>
    </LegalPageShell>
  );
};
