import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LandCoverItem, SpatialMetadata } from '../../types/researchData';
import { MapPin, Layers, Info, Map as MapIcon, Maximize2, Compass, AlertCircle } from 'lucide-react';
import { isValidPoint, isValidPolygonCoordinates, filterValidPolygons } from '../../../peneliti/utils/geoValidation';

interface ResearchMapViewProps {
  spatial: SpatialMetadata;
  landCovers: LandCoverItem[];
  locationText: string;
  projectPoint?: [number, number] | null;
  projectName?: string;
}

const COLOR_MAP: Record<string, { fill: string; stroke: string }> = {
  mangrove: { fill: '#10b981', stroke: '#047857' },
  lamun: { fill: '#14b8a6', stroke: '#0f766e' },
  terumbu_karang: { fill: '#f97316', stroke: '#c2410c' },
  perairan: { fill: '#38bdf8', stroke: '#0284c7' },
  lainnya: { fill: '#eab308', stroke: '#a16207' },
};

// SVG pin marker for point location
const pointMarkerIcon = L.divIcon({
  className: 'custom-project-pin',
  html: `<div style="
    background: #2563eb;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    border: 2px solid white;
  ">
    <div style="transform: rotate(45deg); width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
  </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Helper to recenter map safely
const MapAutoCenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 13 }) => {
  const map = useMap();
  React.useEffect(() => {
    if (isValidPoint(center) && (center[0] !== 0 || center[1] !== 0)) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

export const ResearchMapView: React.FC<ResearchMapViewProps> = ({
  spatial,
  landCovers,
  locationText,
  projectPoint,
  projectName
}) => {
  const [activePolygon, setActivePolygon] = useState<LandCoverItem | null>(null);

  // 1. Guard against invalid or empty polygon coordinates
  const validPolygons = useMemo(() => filterValidPolygons(landCovers), [landCovers]);
  const hasPolygons = Boolean(spatial?.hasShp) && validPolygons.length > 0;

  // 2. Resolve point coordinate fallback (if geometry is null/unavailable)
  const resolvedPoint: [number, number] | null = useMemo(() => {
    if (projectPoint && isValidPoint(projectPoint) && (projectPoint[0] !== 0 || projectPoint[1] !== 0)) {
      return [Number(projectPoint[0]), Number(projectPoint[1])];
    }
    const center0 = landCovers?.[0]?.center;
    if (center0 && isValidPoint(center0) && (center0[0] !== 0 || center0[1] !== 0)) {
      return [Number(center0[0]), Number(center0[1])];
    }
    return null;
  }, [projectPoint, landCovers]);

  // Case A: Neither valid polygons nor point coordinates exist -> Clean fallback card
  if (!hasPolygons && !resolvedPoint) {
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

        {/* Empty state fallback */}
        <div className="p-10 text-center flex flex-col items-center justify-center bg-slate-50/60">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Compass className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">
            Data Batas Spasial Proyek Belum Tersedia
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            Proyek ini belum memiliki data batas wilayah spasial (polygon SHP/GeoJSON) yang dapat ditampilkan.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Lokasi Administratif: <strong>{locationText}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // Center calculation
  const defaultCenter: [number, number] = (hasPolygons && validPolygons[0]?.center && isValidPoint(validPolygons[0].center))
    ? validPolygons[0].center
    : (resolvedPoint || [-8.745, 115.215]);

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
              {hasPolygons ? 'Peta Spasial & Batas Area Tutupan Lahan' : 'Peta Lokasi Penelitian'}
            </h3>
            {hasPolygons ? (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                SHP Terverifikasi
              </span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                Titik Koordinat Lokasi
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {locationText} {hasPolygons && spatial?.crs ? `• CRS: ${spatial.crs}` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600">
          {hasPolygons ? (
            <>
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-mono font-semibold">
                {validPolygons.length} Polygon Tutupan
              </span>
              <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg font-mono font-semibold">
                Total {spatial.totalAreaHa || 0} ha
              </span>
            </>
          ) : (
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg font-medium text-[11px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Polygon Belum Tersedia</span>
            </span>
          )}
        </div>
      </div>

      {/* Map Canvas Container */}
      <div className="relative w-full h-[360px] sm:h-[440px] bg-slate-100">
        <MapContainer
          center={defaultCenter}
          zoom={hasPolygons ? 13 : 11}
          scrollWheelZoom={false}
          className="w-full h-full z-10"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            referrerPolicy="strict-origin-when-cross-origin"
          />

          <MapAutoCenter center={activePolygon?.center || defaultCenter} />

          {/* Render Point Marker when project has point coordinates */}
          {!hasPolygons && resolvedPoint && (
            <Marker position={resolvedPoint} icon={pointMarkerIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <div className="font-bold text-slate-900 mb-0.5">{projectName || 'Lokasi Proyek Penelitian'}</div>
                  <div className="text-slate-600 text-[11px] mb-1">{locationText}</div>
                  <div className="text-[10px] font-mono text-blue-700 font-semibold">
                    {resolvedPoint[0].toFixed(5)}, {resolvedPoint[1].toFixed(5)}
                  </div>
                  <div className="mt-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                    Data batas polygon belum tersedia
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Render Polygons ONLY when coordinates are valid */}
          {hasPolygons &&
            validPolygons.map((poly) => {
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

        {/* Fallback Notice Banner inside map canvas when polygon unavailable */}
        {!hasPolygons && resolvedPoint && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-xs border border-amber-200 text-amber-800 text-xs px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 font-medium pointer-events-auto">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Data batas spasial (polygon) belum tersedia. Menampilkan titik lokasi penelitian.</span>
          </div>
        )}

        {/* Floating Legend Bottom-Left - only if polygons exist */}
        {hasPolygons && (
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
        )}

        {/* Selected Polygon Inspector Drawer / Card */}
        {hasPolygons && activePolygon && (
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
