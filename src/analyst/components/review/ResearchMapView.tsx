import React, { useState } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from 'react-leaflet';
import { LandCoverItem, SpatialMetadata } from '../../types/researchData';
import { MapPin, Layers, Info, Map as MapIcon, Maximize2, Compass } from 'lucide-react';

interface ResearchMapViewProps {
  spatial: SpatialMetadata;
  landCovers: LandCoverItem[];
  locationText: string;
}

const COLOR_MAP: Record<string, { fill: string; stroke: string }> = {
  mangrove: { fill: '#10b981', stroke: '#047857' },
  lamun: { fill: '#14b8a6', stroke: '#0f766e' },
  terumbu_karang: { fill: '#f97316', stroke: '#c2410c' },
  perairan: { fill: '#38bdf8', stroke: '#0284c7' },
  lainnya: { fill: '#eab308', stroke: '#a16207' },
};

// Helper to recenter map when polygons change
const MapAutoCenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 13 }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const ResearchMapView: React.FC<ResearchMapViewProps> = ({
  spatial,
  landCovers,
  locationText
}) => {
  const [activePolygon, setActivePolygon] = useState<LandCoverItem | null>(null);

  // Jika proyek tidak memiliki data spasial / SHP
  if (!spatial.hasShp || landCovers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapIcon className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Peta Spasial Lokasi Penelitian
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">{locationText}</span>
        </div>

        {/* Empty state sesuai instruksi: "Data spasial belum tersedia" */}
        <div className="p-10 text-center flex flex-col items-center justify-center bg-slate-50/60">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Compass className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">
            Data Spasial Belum Tersedia
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Proyek ini belum memiliki data shapefile spasial (SHP/GeoJSON) yang dapat ditampilkan.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Lokasi Administratif: <strong>{locationText}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // Jika SHP tersedia: Tampilkan Leaflet Map interaktif
  const defaultCenter: [number, number] = landCovers[0]?.center || [-8.745, 115.215];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col">
      {/* Header Section */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Peta Spasial & Batas Area Tutupan Lahan
            </h3>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              SHP Terverifikasi
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {locationText} • CRS: <strong className="font-mono text-slate-700">{spatial.crs}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-mono font-semibold">
            {landCovers.length} Polygon Tutupan
          </span>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-mono font-semibold">
            Total {spatial.totalAreaHa} ha
          </span>
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[360px] sm:h-[440px] bg-slate-100">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            referrerPolicy="strict-origin-when-cross-origin"
          />

          <MapAutoCenter center={activePolygon?.center || defaultCenter} />

          {/* Render Polygons */}
          {landCovers.map((poly) => {
            const isSelected = activePolygon?.id === poly.id;
            const colors = COLOR_MAP[poly.type] || COLOR_MAP.mangrove;

            return (
              <Polygon
                key={poly.id}
                positions={poly.coordinates}
                pathOptions={{
                  color: isSelected ? '#1d4ed8' : colors.stroke,
                  fillColor: colors.fill,
                  fillOpacity: isSelected ? 0.75 : 0.45,
                  weight: isSelected ? 3 : 2,
                }}
                eventHandlers={{
                  click: () => setActivePolygon(poly)
                }}
              >
                <Tooltip direction="center" permanent={true} opacity={0.95}>
                  <div className="text-center font-sans text-xs">
                    <div className="font-bold text-slate-900">{poly.name}</div>
                    <div className="text-[10px] font-mono text-blue-700 font-semibold mt-0.5">
                      {poly.code} • {poly.areaHa} ha
                    </div>
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}
        </MapContainer>

        {/* Floating Legend Bottom-Left */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-2.5 shadow-md text-xs pointer-events-auto">
          <div className="font-bold text-slate-800 text-[11px] mb-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-blue-600" />
            <span>Legenda Tutupan Lahan:</span>
          </div>
          <div className="space-y-1 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500 border border-emerald-600"></span>
              <span className="text-slate-700 font-medium">Hutan Mangrove ({spatial.totalAreaHa} ha)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-sky-400 border border-sky-600"></span>
              <span className="text-slate-700 font-medium">Badan Air & Estuari</span>
            </div>
          </div>
        </div>

        {/* Selected Polygon Inspector Drawer / Card */}
        {activePolygon && (
          <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl p-3.5 shadow-lg text-xs max-w-xs pointer-events-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <span className="font-mono font-bold text-blue-700">{activePolygon.code}</span>
              <button
                onClick={() => setActivePolygon(null)}
                className="text-slate-400 hover:text-slate-700 text-xs px-1"
              >
                ✕
              </button>
            </div>
            <h4 className="font-bold text-slate-900 leading-tight mb-1">{activePolygon.name}</h4>
            <div className="space-y-1 text-[11px] text-slate-600">
              <div>Luas: <strong className="text-slate-900">{activePolygon.areaHa} ha</strong></div>
              <div>Estimasi Nilai Valuasi: <strong className="text-emerald-700 font-mono">Rp {(Number(activePolygon.totalValue) || 0).toLocaleString('id-ID')}</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
