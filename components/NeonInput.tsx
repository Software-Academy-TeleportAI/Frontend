import React from "react";

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const NeonInput = ({ icon, ...props }: NeonInputProps) => {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-500/50 group-focus-within:text-cyan-400 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg py-3 pl-10 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 backdrop-blur-sm"
      />
      {/* Glow Effect */}
      <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-transparent group-focus-within:ring-cyan-500/20 pointer-events-none" />
    </div>
  );
};
