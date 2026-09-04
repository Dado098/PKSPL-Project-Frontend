import { useRef, useState } from 'react'
import shp from 'shpjs'
import ProjectLocationMap from './ProjectLocationMap'
import {
  boundaryCentroid,
  countFeatures,
  countCoordinates,
  findInvalidCoordinate,
  simplifyGeoJson,
} from '../../lib/geo'

const HARD_MAX_COORDINATES = 300000

function normalizeToFeatureCollection(parsed) {
  const layers = Array.isArray(parsed) ? parsed : [parsed]
  return {
    type: 'FeatureCollection',
    features: layers.flatMap((layer) => layer?.features ?? []),
  }
}

/**
 * Drop/click zone that reads a zipped ArcGIS shapefile (.shp/.dbf/.shx/.prj
 * bundled as .zip) entirely client-side via shpjs, converts it to GeoJSON
 * (reprojected to WGS84 when a .prj is present), applies automatic geometry
 * simplification for high-density polygons, and reports the polygon plus its
 * bounding-box center back to the parent form.
 */
export default function ShpUploader({ value = null, onParsed, onClear, height = 220 }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)

  async function handleFile(file) {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.zip')) {
      setError('File harus berupa arsip .zip berisi .shp, .dbf, .shx, dan .prj')
      return
    }

    setLoading(true)
    setError(null)
    setStats(null)
    try {
      const buffer = await file.arrayBuffer()
      const parsed = await shp(buffer)
      const rawGeojson = normalizeToFeatureCollection(parsed)

      if (!rawGeojson.features?.length) {
        throw new Error('Tidak ada fitur geometri yang ditemukan di dalam file SHP/ZIP.')
      }

      const invalid = findInvalidCoordinate(rawGeojson)
      if (invalid) {
        throw new Error(
          'Koordinat pada file tidak valid (di luar jangkauan lat/long WGS 1984). Pastikan file menyertakan file .prj yang benar.'
        )
      }

      const pointCount = countCoordinates(rawGeojson)
      if (pointCount > HARD_MAX_COORDINATES) {
        throw new Error(
          `File sangat besar (${pointCount.toLocaleString('id-ID')} titik koordinat, batas maksimum ${HARD_MAX_COORDINATES.toLocaleString('id-ID')}).`
        )
      }

      // Automatically simplify geometry if > 15,000 points
      const { geojson: finalGeoJson, originalCount, simplifiedCount, isSimplified } = simplifyGeoJson(rawGeojson, 15000)

      const centroid = boundaryCentroid(finalGeoJson)
      if (!centroid) {
        throw new Error('Gagal membaca titik pusat (centroid) koordinat dari file SHP.')
      }

      setFileName(file.name)
      setStats({ originalCount, simplifiedCount, isSimplified })
      onParsed?.(finalGeoJson, centroid, file)
    } catch (err) {
      setError(err.message || 'Gagal membaca dan mengekstrak file SHP')
    } finally {
      setLoading(false)
    }
  }

  function clear() {
    setFileName(null)
    setError(null)
    setStats(null)
    if (inputRef.current) inputRef.current.value = ''
    onClear?.()
  }

  if (value) {
    const featureNum = countFeatures(value)
    const currentPoints = countCoordinates(value)

    return (
      <div>
        <ProjectLocationMap boundary={value} height={height} className="shadow-sm" />
        <div className="mt-2.5 px-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 font-semibold">
              {fileName ? `${fileName} — ` : ''}{featureNum} fitur polygon ({currentPoints.toLocaleString('id-ID')} titik koordinat)
            </span>
            <button
              type="button"
              className="text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors cursor-pointer"
              onClick={clear}
            >
              Hapus / Ganti file
            </button>
          </div>

          {stats?.isSimplified && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Polygon berhasil diproses dan dioptimalkan untuk tampilan peta ({stats.originalCount.toLocaleString('id-ID')} titik → {stats.simplifiedCount.toLocaleString('id-ID')} titik).
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
          dragOver ? 'border-[#5046e5] bg-indigo-50/50' : 'border-gray-300 hover:border-indigo-400 bg-gray-50/50'
        }`}
        style={{ minHeight: height }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div className="w-12 h-12 rounded-full bg-indigo-50 text-[#5046e5] flex items-center justify-center mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <div className="text-sm font-semibold text-gray-800">
          {loading ? (
            <span className="text-[#5046e5] animate-pulse">Memproses & mengoptimalkan file SHP...</span>
          ) : (
            <>
              <span className="text-[#5046e5] hover:underline">Klik atau Drag</span> file .ZIP Shapefile di sini
            </>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-1.5 max-w-sm">
          Arsip .zip berisi .shp, .dbf, .shx, dan .prj (WGS 1984). Poligon detail (mis. &gt;20.000 titik) akan otomatis dioptimalkan.
        </div>
      </div>
      {error && (
        <p className="mt-2 text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
          {error}
        </p>
      )}
    </div>
  )
}
