import { Brain } from 'lucide-react';

export const ChallengePanel: React.FC = () => {
  return (
    <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-6">
      <div className="p-4 bg-purple-500/20 rounded-2xl">
        <Brain className="w-12 h-12 text-purple-400" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white">Challenge Mode</h3>
        <p className="text-text-muted max-w-md mx-auto">
          Test your understanding with AI-generated MCQs based on your document. 
          Coming soon in the next update.
        </p>
      </div>
      <button className="btn-primary opacity-50 cursor-not-allowed">
        Generate MCQs
      </button>
    </div>
  );
};
