const DEPTH_BY_TYPE = {
  Point: 0,
  MultiPoint: 1,
  LineString: 1,
  MultiLineString: 2,
  Polygon: 2,
  MultiPolygon: 3,
}

/**
 * Calls fn(lng, lat) for every coordinate pair in any GeoJSON
 * geometry/Feature/FeatureCollection, regardless of nesting depth.
 */
export function forEachCoordinate(geojson, fn) {
  function visit(coords, depth) {
    if (depth === 0) {
      const [lng, lat] = coords
      fn(lng, lat)
      return
    }
    coords.forEach((c) => visit(c, depth - 1))
  }

  function visitGeometry(geometry) {
    if (!geometry) return
    const depth = DEPTH_BY_TYPE[geometry.type]
    if (depth === undefined) return
    visit(geometry.type === 'Point' ? [geometry.coordinates] : geometry.coordinates, depth)
  }

  if (!geojson) return
  if (geojson.type === 'FeatureCollection') {
    geojson.features?.forEach((f) => visitGeometry(f.geometry))
  } else if (geojson.type === 'Feature') {
    visitGeometry(geojson.geometry)
  } else {
    visitGeometry(geojson)
  }
}

function isValidLatLng(lng, lat) {
  return Number.isFinite(lng) && Number.isFinite(lat) && Math.abs(lng) <= 180 && Math.abs(lat) <= 90
}

/**
 * Returns the first coordinate pair that is missing, non-finite (NaN, Infinity),
 * or outside valid lat/lng range (WGS 1984). Returns null if valid.
 */
export function findInvalidCoordinate(geojson) {
  let bad = null
  forEachCoordinate(geojson, (lng, lat) => {
    if (bad) return
    if (!isValidLatLng(lng, lat)) bad = { lng, lat }
  })
  return bad
}

/**
 * Bounding-box center { lat, lng } - representative coordinate for boundary polygon.
 */
export function boundaryCentroid(geojson) {
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity

  forEachCoordinate(geojson, (lng, lat) => {
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
  })

  if (!Number.isFinite(minLng) || !Number.isFinite(minLat)) return null

  return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 }
}

export function countFeatures(geojson) {
  if (!geojson) return 0
  if (geojson.type === 'FeatureCollection') return geojson.features?.length || 0
  if (geojson.type === 'Feature') return 1
  return 1
}

export function countCoordinates(geojson) {
  let count = 0
  forEachCoordinate(geojson, () => { count++ })
  return count
}

/**
 * Douglas-Peucker polygon & line simplification
 */
function perpendicularDistanceSq(p, a, b) {
  let x = a[0], y = a[1]
  let dx = b[0] - x, dy = b[1] - y

  if (dx !== 0 || dy !== 0) {
    const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy)
    if (t > 1) {
      x = b[0]
      y = b[1]
    } else if (t > 0) {
      x += dx * t
      y += dy * t
    }
  }

  dx = p[0] - x
  dy = p[1] - y

  return dx * dx + dy * dy
}

function douglasPeucker(points, sqTolerance) {
  if (!points || points.length <= 2) return points

  let dmax = 0
  let index = 0
  const end = points.length - 1

  for (let i = 1; i < end; i++) {
    const d = perpendicularDistanceSq(points[i], points[0], points[end])
    if (d > dmax) {
      index = i
      dmax = d
    }
  }

  if (dmax > sqTolerance) {
    const recResults1 = douglasPeucker(points.slice(0, index + 1), sqTolerance)
    const recResults2 = douglasPeucker(points.slice(index), sqTolerance)
    return recResults1.slice(0, recResults1.length - 1).concat(recResults2)
  }

  return [points[0], points[end]]
}

function simplifyRing(ring, sqTolerance) {
  if (!ring || ring.length < 4) return ring
  const simplified = douglasPeucker(ring, sqTolerance)
  if (simplified.length < 4) {
    return ring // Preserve original ring if simplification collapsed it
  }
  const first = simplified[0]
  const last = simplified[simplified.length - 1]
  if (first[0] !== last[0] || first[1] !== last[1]) {
    simplified.push([first[0], first[1]])
  }
  return simplified
}

function simplifyGeometry(geometry, sqTolerance) {
  if (!geometry) return geometry

  if (geometry.type === 'Polygon') {
    const simplifiedRings = geometry.coordinates.map((ring) => simplifyRing(ring, sqTolerance))
    return { ...geometry, coordinates: simplifiedRings }
  }

  if (geometry.type === 'MultiPolygon') {
    const simplifiedPolygons = geometry.coordinates.map((poly) =>
      poly.map((ring) => simplifyRing(ring, sqTolerance))
    )
    return { ...geometry, coordinates: simplifiedPolygons }
  }

  if (geometry.type === 'LineString') {
    return { ...geometry, coordinates: douglasPeucker(geometry.coordinates, sqTolerance) }
  }

  if (geometry.type === 'MultiLineString') {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map((line) => douglasPeucker(line, sqTolerance)),
    }
  }

  return geometry
}

/**
 * Automatically simplifies GeoJSON polygons iteratively if coordinate count exceeds maxTargetPoints.
 */
export function simplifyGeoJson(geojson, maxTargetPoints = 15000) {
  if (!geojson) return { geojson, originalCount: 0, simplifiedCount: 0, isSimplified: false }

  const originalCount = countCoordinates(geojson)
  if (originalCount <= maxTargetPoints) {
    return { geojson, originalCount, simplifiedCount: originalCount, isSimplified: false }
  }

  const tolerances = [0.00002, 0.00005, 0.0001, 0.0002, 0.0005, 0.001, 0.002, 0.005]
  let currentGeojson = geojson
  let currentCount = originalCount

  for (const tol of tolerances) {
    const sqTol = tol * tol
    let simplifiedCandidate = null

    if (currentGeojson.type === 'FeatureCollection') {
      simplifiedCandidate = {
        ...currentGeojson,
        features: currentGeojson.features.map((f) => ({
          ...f,
          geometry: simplifyGeometry(f.geometry, sqTol),
        })),
      }
    } else if (currentGeojson.type === 'Feature') {
      simplifiedCandidate = {
        ...currentGeojson,
        geometry: simplifyGeometry(currentGeojson.geometry, sqTol),
      }
    } else {
      simplifiedCandidate = simplifyGeometry(currentGeojson, sqTol)
    }

    const newCount = countCoordinates(simplifiedCandidate)
    if (newCount > 0 && !findInvalidCoordinate(simplifiedCandidate)) {
      currentGeojson = simplifiedCandidate
      currentCount = newCount
      if (currentCount <= maxTargetPoints) break
    }
  }

  return {
    geojson: currentGeojson,
    originalCount,
    simplifiedCount: currentCount,
    isSimplified: currentCount < originalCount,
  }
}
