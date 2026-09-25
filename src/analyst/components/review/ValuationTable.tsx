import React from 'react';
import {
  ServiceCategoryKey,
  ProvisioningRow,
  RegulatingRow,
  SupportingRow,
  CulturalRow
} from '../../types/valuation';

interface ValuationTableProps {
  category: ServiceCategoryKey;
  rows: any[];
}

export const ValuationTable: React.FC<ValuationTableProps> = ({ category, rows = [] }) => {
  const formatIDR = (val?: number | string | null) => {
    if (val === undefined || val === null || val === '') return 'Rp 0';
    const num = typeof val === 'number' ? val : Number(val);
    if (isNaN(num)) return 'Rp 0';
    return `Rp ${num.toLocaleString('id-ID')}`;
  };

  const safeRows = Array.isArray(rows) ? rows : [];

  if (category === 'provisioning') {
    const provRows = safeRows as (ProvisioningRow & any)[];
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 w-12 text-center">NO</th>
              <th className="py-2.5 px-3 min-w-[220px]">JENIS KOMODITAS / BIOTA</th>
              <th className="py-2.5 px-3 text-right">PRODUKTIVITAS</th>
              <th className="py-2.5 px-3">SATUAN</th>
              <th className="py-2.5 px-3 text-right">HARGA / UNIT</th>
              <th className="py-2.5 px-3 text-right">JUMLAH / VOLUME</th>
              <th className="py-2.5 px-3 text-right">LUAS (HA)</th>
              <th className="py-2.5 px-3 text-right min-w-[140px]">TOTAL NILAI</th>
              <th className="py-2.5 px-3 min-w-[180px]">SUMBER DATA</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {provRows.map((row, idx) => (
              <tr key={row.id || row.no || idx} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-semibold">
                  {row.no ?? (idx + 1)}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  {row.commodity || row.item || row.namaKomoditas || '-'}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {row.productivity ?? row.produktivitas ?? '-'}
                </td>
                <td className="py-2.5 px-3 text-slate-500">
                  {row.unit || row.satuan || '-'}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {formatIDR(row.unitPrice ?? row.pricePerUnit ?? row.hargaUnit ?? row.hargaKomoditas)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {row.quantityVolume ?? row.volumeOutput ?? row.jumlah ?? '-'}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {row.areaHa ?? row.luasHa ?? '-'}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                  {formatIDR(row.totalValue ?? row.totalNilai)}
                </td>
                <td className="py-2.5 px-3 text-[11px] text-slate-500">
                  {row.referenceSource || row.source || 'Survei Lapangan Peneliti'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (category === 'regulating') {
    const regRows = safeRows as (RegulatingRow & any)[];
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 w-12 text-center">NO</th>
              <th className="py-2.5 px-3 min-w-[260px]">FUNGSI / ASET PENGATURAN</th>
              <th className="py-2.5 px-3">SATUAN / PARAMETER</th>
              <th className="py-2.5 px-3 text-right">BIAYA / HARGA UNIT</th>
              <th className="py-2.5 px-3 text-right min-w-[150px]">TOTAL NILAI</th>
              <th className="py-2.5 px-3 min-w-[200px]">SUMBER RUJUKAN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {regRows.map((row, idx) => (
              <tr key={row.id || row.no || idx} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-semibold">
                  {row.no ?? (idx + 1)}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  {row.functionAsset || row.assetFunction || row.item || row.fungsi || '-'}
                </td>
                <td className="py-2.5 px-3 text-slate-700 font-mono">
                  {row.parameterUnit || row.lengthParameter || row.param || '-'}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {formatIDR(row.unitPrice ?? row.unitCost ?? row.biayaUnit ?? row.hargaKarbon)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                  {formatIDR(row.totalValue ?? row.totalNilai)}
                </td>
                <td className="py-2.5 px-3 text-[11px] text-slate-500">
                  {row.referenceSource || row.source || 'Dinas PU & IPCC'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (category === 'supporting') {
    const suppRows = safeRows as (SupportingRow & any)[];
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 w-12 text-center">NO</th>
              <th className="py-2.5 px-3 min-w-[260px]">FUNGSI / JENIS HABITAT PENDUKUNG</th>
              <th className="py-2.5 px-3">PARAMETER INDEKS / BIOMASSA</th>
              <th className="py-2.5 px-3 text-right">BIAYA / NILAI UNIT</th>
              <th className="py-2.5 px-3 text-right min-w-[150px]">TOTAL NILAI</th>
              <th className="py-2.5 px-3 min-w-[200px]">SUMBER RUJUKAN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {suppRows.map((row, idx) => (
              <tr key={row.id || row.no || idx} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-semibold">
                  {row.no ?? (idx + 1)}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  {row.habitatFunction || row.item || row.fungsi || '-'}
                </td>
                <td className="py-2.5 px-3 text-slate-700 font-mono">
                  {row.parameter || (row.ecosystemAreaHa ? `${row.ecosystemAreaHa} ha` : (row.luasHa ? `${row.luasHa} ha` : '-'))}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {formatIDR(row.unitPrice ?? row.recruitmentContribution ?? row.unitVal ?? row.nilaiKontribusiHa)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                  {formatIDR(row.totalValue ?? row.totalNilai)}
                </td>
                <td className="py-2.5 px-3 text-[11px] text-slate-500">
                  {row.referenceSource || row.source || 'Studi Ekologi PKSPL IPB'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // category === 'cultural'
  const cultRows = safeRows as (CulturalRow & any)[];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
            <th className="py-2.5 px-3 w-12 text-center">NO</th>
            <th className="py-2.5 px-3 min-w-[260px]">ATRAKSI / OBJEK REKREASI PESISIR</th>
            <th className="py-2.5 px-3">PARAMETER / PENGUNJUNG</th>
            <th className="py-2.5 px-3 text-right">BIAYA PERJALANAN / WTP</th>
            <th className="py-2.5 px-3 text-right min-w-[150px]">TOTAL NILAI</th>
            <th className="py-2.5 px-3 min-w-[200px]">SUMBER RUJUKAN</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {cultRows.map((row, idx) => (
            <tr key={row.id || row.no || idx} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-semibold">
                {row.no ?? (idx + 1)}
              </td>
              <td className="py-2.5 px-3 font-semibold text-slate-900">
                {row.attraction || row.tourismProgram || row.item || row.program || '-'}
              </td>
              <td className="py-2.5 px-3 text-slate-700 font-mono">
                {row.parameter || (row.respondentCount ? `${Number(row.respondentCount).toLocaleString('id-ID')} org/th` : (row.visit ? `${Number(row.visit).toLocaleString('id-ID')} org/th` : '-'))}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                {formatIDR(row.travelCostWtp ?? row.costPerUnit ?? row.cost ?? row.biayaTrip ?? row.wtp)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                {formatIDR(row.totalValue ?? row.totalNilai)}
              </td>
              <td className="py-2.5 px-3 text-[11px] text-slate-500">
                {row.referenceSource || row.source || 'Kuesioner Pengunjung & Pengelola'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
