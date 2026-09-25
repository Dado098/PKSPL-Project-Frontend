import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { valuationService } from '../../services/valuationService';
import { ValuationAreaSelector } from './ValuationAreaSelector';
import { ValuationAccordion } from './ValuationAccordion';
import { ProjectResearchFullData } from '../../types/researchData';

interface ValuationSectionProps {
  onOpenSectionComment: (sectionName: string) => void;
  initialAreaId?: string;
  data?: ProjectResearchFullData;
}

export const ValuationSection: React.FC<ValuationSectionProps> = ({
  onOpenSectionComment,
  initialAreaId = 'poly-1',
  data
}) => {
  const dynamicAreas = data?.landCovers && data.landCovers.length > 0
    ? data.landCovers.map((lc) => ({
        id: lc.id,
        code: lc.code,
        name: lc.name,
        areaHa: lc.areaHa,
        indexCode: lc.indexCode || 'IDX'
      }))
    : valuationService.getAvailableAreas();

  const [selectedAreaId, setSelectedAreaId] = useState<string>(() => {
    return dynamicAreas[0]?.id || initialAreaId;
  });

  useEffect(() => {
    if (dynamicAreas.length > 0 && !dynamicAreas.some((a) => a.id === selectedAreaId)) {
      setSelectedAreaId(dynamicAreas[0].id);
    }
  }, [data?.projectId, dynamicAreas, selectedAreaId]);

  const areas = dynamicAreas;
  const areaValuationData = valuationService.getValuationByArea(selectedAreaId, data);

  // Default state sesuai instruksi:
  // - Provisioning OPEN
  // - Regulating OPEN
  // - Supporting CLOSED
  // - Cultural CLOSED
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({
    provisioning: true,
    regulating: true,
    supporting: false,
    cultural: false
  });

  const toggleAccordion = (category: string) => {
    setOpenStates((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const { provisioning, regulating, supporting, cultural } = areaValuationData.categories;

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-5">
      {/* 1. Header Section 05 */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Title & Subtitle */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                05
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
                05. DATA VALUASI — SELURUH TABEL PENELITIAN
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Tabel lengkap variabel penelitian dari seluruh seksi jasa ekosistem aktif. Seluruh sel bersifat Read-Only.
            </p>
          </div>

          {/* Right: Area Tutupan Dropdown & Beri Catatan */}
          <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
            <ValuationAreaSelector
              areas={areas}
              selectedAreaId={selectedAreaId}
              onSelectArea={setSelectedAreaId}
            />

            <button
              type="button"
              onClick={() => onOpenSectionComment('05. DATA VALUASI')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Beri Catatan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Empat Kelompok Jasa Ekosistem (A -> B -> C -> D) */}
      <div className="space-y-4">
        {/* A. Provisioning Services */}
        <ValuationAccordion
          data={provisioning}
          isOpen={openStates.provisioning}
          onToggle={() => toggleAccordion('provisioning')}
        />

        {/* B. Regulating Services */}
        <ValuationAccordion
          data={regulating}
          isOpen={openStates.regulating}
          onToggle={() => toggleAccordion('regulating')}
        />

        {/* C. Supporting Services */}
        <ValuationAccordion
          data={supporting}
          isOpen={openStates.supporting}
          onToggle={() => toggleAccordion('supporting')}
        />

        {/* D. Cultural Services */}
        <ValuationAccordion
          data={cultural}
          isOpen={openStates.cultural}
          onToggle={() => toggleAccordion('cultural')}
        />
      </div>
    </section>
  );
};
