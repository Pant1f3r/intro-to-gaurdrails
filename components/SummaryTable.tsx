import React from 'react';
import { Faction } from '../types';

interface SummaryTableProps {
  factions: Faction[];
}

const SummaryTable: React.FC<SummaryTableProps> = ({ factions }) => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
      <div className="p-6 border-b border-slate-800">
        <h3 className="text-xl font-bold text-slate-200">Content Visibility Decision-Makers</h3>
        <p className="text-slate-400 text-sm mt-1">Hierarchical breakdown of responsibility across the ecosystem</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-mono text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Layer</th>
              <th className="px-6 py-4 font-semibold">Responsible Faction</th>
              <th className="px-6 py-4 font-semibold">Basis for Decision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {factions.map((faction) => (
              <tr key={faction.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-300">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs border border-${faction.color}-500/20 bg-${faction.color}-500/10 text-${faction.color}-400`}>
                        {faction.layer}
                    </span>
                </td>
                <td className="px-6 py-4 text-slate-300">
                    {faction.role}
                </td>
                <td className="px-6 py-4 text-slate-400">
                    {/* Simplified mapping based on prompt table */}
                    {faction.layer === 'Foundation' && 'Core safety and ethical principles.'}
                    {faction.layer === 'Deployment' && 'Industry regulations and brand guidelines.'}
                    {faction.layer === 'Oversight' && 'National and international laws.'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;