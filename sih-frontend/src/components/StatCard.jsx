import React from 'react';

const StatCard = ({ title, value, icon, trend, isRisk }) => {
  // Logic to determine color intensity based on risk percentage
  const getRiskStyles = (val) => {
    const num = parseInt(val);
    if (num < 30) return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 shadow-emerald-500/5';
    if (num < 60) return 'text-orange-400 border-orange-500/20 bg-orange-500/5 hover:border-orange-500/40 shadow-orange-500/5';
    return 'text-red-400 border-red-500/20 bg-red-500/5 hover:border-red-500/40 shadow-red-500/5';
  };

  const cardStyle = isRisk 
    ? getRiskStyles(value) 
    : 'text-slate-100 border-slate-800 bg-slate-800/40 hover:border-slate-700 shadow-black/20';

  return (
    <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${cardStyle}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl text-inherit">
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 bg-white/10 rounded-full border border-white/5">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;