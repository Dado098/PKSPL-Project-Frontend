import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LandCoverPolygon, MapLayer } from '../../types/spatial';
import { formatNumber } from '../../utils/formatter';
import { MapLegend } from './MapLegend';
import { MapLayerControl } from './MapLayerControl';
import { PolygonDetailDrawer } from './PolygonDetailDrawer';
import { useProject } from '../../context/ProjectContext';
import { MAP_CONFIG, TileProvider } from '../../config/mapConfig';
import { AlertTriangle, Info } from 'lucide-react';
import { isValidPoint, isValidPolygonCoordinates, filterValidPolygons } from '../../utils/geoValidation';

interface MapViewProps {
  selectedPolygonId?: string | null;
  onPolygonSelect?: (poly: LandCoverPolygon | null) => void;
  landCovers?: LandCoverPolygon[];
  layers?: MapLayer[];
}

// Color map for Land Cover types
const COLOR_SCHEME: Record<string, { fill: string; stroke: string }> = {
  mangrove: { fill: '#10b981', stroke: '#047857' },
  lamun: { fill: '#14b8a6', stroke: '#0f766e' },
  terumbu_karang: { fill: '#f97316', stroke: '#c2410c' },
  perairan: { fill: '#38bdf8', stroke: '#0284c7' },
  lainnya: { fill: '#facc15', stroke: '#ca8a04' },
};

// Map center adjuster component with memoized distance check to avoid redundant setView calls
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom }) => {
  const map = useMap();
  const lastCenterRef = useRef<[number, number]>(center);

  useEffect(() => {
    if (!center || !Array.isArray(center) || center.length < 2) return;
    const [lat, lng] = center;
    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return;
    const [lastLat, lastLng] = lastCenterRef.current;
    if (Math.abs(lat - lastLat) > 0.0001 || Math.abs(lng - lastLng) > 0.0001) {
      lastCenterRef.current = center;
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({
  selectedPolygonId,
  onPolygonSelect,
  landCovers: propLandCovers,
  layers: propLayers,
}) => {
  const context = useProject();
  const landCovers = propLandCovers || context.landCovers;
  const layers = propLayers || context.layers;
  const [internalSelected, setInternalSelected] = useState<LandCoverPolygon | null>(null);

  // Filter only valid polygons to protect Leaflet from invalid latlngs
  const validLandCovers = React.useMemo(() => filterValidPolygons(landCovers), [landCovers]);

  // Basemap tile provider state with automatic fallback chain
  const [tileProvider, setTileProvider] = useState<TileProvider>(MAP_CONFIG.primaryTileProvider);
  const [tileErrorCount, setTileErrorCount] = useState(0);
  const [isBasemapOffline, setIsBasemapOffline] = useState(false);

  // Handle tile errors with smooth fallback switching
  const handleTileError = useCallback(() => {
    setTileErrorCount(prev => {
      const nextCount = prev + 1;
      // After consecutive failures, attempt fallback providers
      if (nextCount === 4 && tileProvider.id === MAP_CONFIG.primaryTileProvider.id) {
        console.warn(`[MapView] Primary basemap (${tileProvider.name}) failed. Switching to fallback: ${MAP_CONFIG.fallbackTileProvider.name}`);
        setTileProvider(MAP_CONFIG.fallbackTileProvider);
        return 0;
      }
      if (nextCount === 4 && tileProvider.id === MAP_CONFIG.fallbackTileProvider.id) {
        console.warn(`[MapView] Fallback basemap (${tileProvider.name}) failed. Switching to tertiary: ${MAP_CONFIG.tertiaryTileProvider.name}`);
        setTileProvider(MAP_CONFIG.tertiaryTileProvider);
        return 0;
      }
      if (nextCount >= 8) {
        setIsBasemapOffline(true);
      }
      return nextCount;
    });
  }, [tileProvider]);

  // Check if tutupan lahan layer is visible
  const isTutupanVisible = layers.find(l => l.name.includes('Tutupan'))?.visible ?? true;
  const isIndexVisible = layers.find(l => l.name.includes('Index'))?.visible ?? true;

  const currentPolygon = selectedPolygonId
    ? landCovers.find(p => p.id === selectedPolygonId) || internalSelected
    : internalSelected;

  const handlePolygonClick = (poly: LandCoverPolygon) => {
    setInternalSelected(poly);
    if (onPolygonSelect) onPolygonSelect(poly);
  };

  const handleCloseDrawer = () => {
    setInternalSelected(null);
    if (onPolygonSelect) onPolygonSelect(null);
  };

  // Center of project features or fallback to default coordinates
  const defaultCenter: [number, number] = landCovers[0]?.center || MAP_CONFIG.defaultCenter;

  return (
    <div className="relative w-full h-full min-h-[520px] rounded-lg overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      {/* Offline / Tile Fallback Notice (non-intrusive banner) */}
      {isBasemapOffline && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-amber-500/90 text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1.5 pointer-events-none">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Basemap offline. Seluruh layer polygon spasial tetap aktif dan dapat diakses.</span>
        </div>
      )}

      {/* Interactive Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={MAP_CONFIG.defaultZoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={tileProvider.maxZoom || MAP_CONFIG.maxZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        style={{ height: '100%', width: '100%', minHeight: '520px', backgroundColor: '#e2e8f0' }}
      >
        <TileLayer
          attribution={tileProvider.attribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
          url={tileProvider.url}
          maxZoom={tileProvider.maxZoom}
          referrerPolicy="strict-origin-when-cross-origin"
          eventHandlers={{
            tileerror: handleTileError,
          }}
        />

        <MapRecenter center={currentPolygon?.center || defaultCenter} />

        {/* Render Land Cover Polygons ONLY when coordinates are valid */}
        {isTutupanVisible &&
          validLandCovers.map((poly) => {
            const isSelected = currentPolygon?.id === poly.id;
            const colors = COLOR_SCHEME[poly.type] || COLOR_SCHEME.lainnya;

            return (
              <Polygon
                key={poly.id}
                positions={poly.coordinates}
                pathOptions={{
                  color: isSelected ? '#1e40af' : colors.stroke,
                  fillColor: colors.fill,
                  fillOpacity: isSelected ? 0.75 : 0.45,
                  weight: isSelected ? 3.5 : 2,
                  dashArray: isSelected ? '4, 4' : undefined,
                }}
                eventHandlers={{
                  click: () => handlePolygonClick(poly),
                }}
              >
                <Tooltip direction="center" permanent={isIndexVisible} opacity={0.95}>
                  <div className="text-center font-sans">
                    <div className="text-[11px] font-bold text-slate-900 leading-tight">
                      {poly.name}
                    </div>
                    {isIndexVisible && (
                      <div className={`text-[9px] font-mono font-semibold mt-0.5 px-1.5 py-0.5 rounded border ${
                        poly.indexCode ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}>
                        {poly.indexCode ? `${poly.indexCode} • ` : '⚠ Belum Ada Index • '}{formatNumber(poly.areaHa)} ha
                      </div>
                    )}
                  </div>
                </Tooltip>
              </Polygon>
            );
          })}
      </MapContainer>

      {/* Notice if tutupan exists but no polygon coordinates */}
      {isTutupanVisible && landCovers.length > 0 && validLandCovers.length === 0 && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-white/95 text-slate-700 text-xs px-3.5 py-1.5 rounded-full shadow-md border border-slate-200 backdrop-blur-xs flex items-center gap-1.5 pointer-events-none">
          <Info className="w-3.5 h-3.5 text-blue-600" />
          <span>Data batas spasial polygon belum tersedia untuk proyek ini.</span>
        </div>
      )}

      {/* Floating GIS Overlay: Legend (Bottom-Left) */}
      <div className="absolute bottom-5 left-4 z-20 pointer-events-auto">
        <MapLegend />
      </div>

      {/* Floating GIS Overlay: Layer Switcher (Top-Right) */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <MapLayerControl />
      </div>

      {/* Slide-in Detail Drawer on Polygon Click */}
      <PolygonDetailDrawer
        polygon={currentPolygon}
        onClose={handleCloseDrawer}
      />
    </div>
  );
};
