import React from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { AreaOption } from '../../types/valuation';

interface ValuationAreaSelectorProps {
  areas: AreaOption[];
  selectedAreaId: string;
  onSelectArea: (areaId: string) => void;
}

export const ValuationAreaSelector: React.FC<ValuationAreaSelectorProps> = ({
  areas,
  selectedAreaId,
  onSelectArea
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
      <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">
        Area Tutupan:
      </span>
      <div className="relative inline-block w-full sm:w-auto">
        <select
          value={selectedAreaId}
          onChange={(e) => onSelectArea(e.target.value)}
          className="w-full sm:w-auto appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-300 hover:border-slate-400 focus:border-blue-500 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-2xs transition-colors cursor-pointer"
        >
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name} ({area.areaHa} ha) — {area.indexCode}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};
