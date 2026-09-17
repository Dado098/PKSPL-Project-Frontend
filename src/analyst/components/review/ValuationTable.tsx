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

export const ValuationTable: React.FC<ValuationTableProps> = ({ category, rows }) => {
  const formatIDR = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  if (category === 'provisioning') {
    const provRows = rows as ProvisioningRow[];
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
            {provRows.map((row) => (
              <tr key={row.no} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-semibold">
                  {row.no}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  {row.commodity}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {row.productivity}
                </td>
                <td className="py-2.5 px-3 text-slate-500">
                  {row.unit}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {formatIDR(row.unitPrice)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {row.quantityVolume}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {row.areaHa}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                  {formatIDR(row.totalValue)}
                </td>
                <td className="py-2.5 px-3 text-[11px] text-slate-500">
                  {row.referenceSource}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (category === 'regulating') {
    const regRows = rows as RegulatingRow[];
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
            {regRows.map((row) => (
              <tr key={row.no} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-semibold">
                  {row.no}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  {row.functionAsset}
                </td>
                <td className="py-2.5 px-3 text-slate-700 font-mono">
                  {row.parameterUnit}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {formatIDR(row.unitPrice)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                  {formatIDR(row.totalValue)}
                </td>
                <td className="py-2.5 px-3 text-[11px] text-slate-500">
                  {row.referenceSource}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (category === 'supporting') {
    const suppRows = rows as SupportingRow[];
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
            {suppRows.map((row) => (
              <tr key={row.no} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-semibold">
                  {row.no}
                </td>
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  {row.habitatFunction}
                </td>
                <td className="py-2.5 px-3 text-slate-700 font-mono">
                  {row.parameter}
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                  {formatIDR(row.unitPrice)}
                </td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                  {formatIDR(row.totalValue)}
                </td>
                <td className="py-2.5 px-3 text-[11px] text-slate-500">
                  {row.referenceSource}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // category === 'cultural'
  const cultRows = rows as CulturalRow[];
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
          {cultRows.map((row) => (
            <tr key={row.no} className="hover:bg-slate-50/70 transition-colors">
              <td className="py-2.5 px-3 text-center font-mono text-slate-400 font-semibold">
                {row.no}
              </td>
              <td className="py-2.5 px-3 font-semibold text-slate-900">
                {row.attraction}
              </td>
              <td className="py-2.5 px-3 text-slate-700 font-mono">
                {row.parameter}
              </td>
              <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                {formatIDR(row.travelCostWtp)}
              </td>
              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                {formatIDR(row.totalValue)}
              </td>
              <td className="py-2.5 px-3 text-[11px] text-slate-500">
                {row.referenceSource}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
