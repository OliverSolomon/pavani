"use client";

import { useEffect, useState, useId } from "react";
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { DistrictGuide } from "@/lib/neighborhoods";

export interface DistrictMapProperty {
  _id: string;
  title: string;
  price?: string;
  coords?: { lat: number; lng: number } | null;
  districtSlug: string;
}

interface DistrictMapProps {
  districts: DistrictGuide[];
  properties?: DistrictMapProperty[];
  activeSlug?: string | null;
  /** Highlight a single pin (e.g. hovered listing) without filtering others. */
  activePropertyId?: string | null;
  /** Frame the view to the property pins rather than the district rings. */
  fitTo?: "districts" | "properties";
  onSelect?: (slug: string) => void;
}

const CRIMSON = "#82000D";
const PIN_RING = "#FFFFFF";

function Layers({ districts, properties = [], activeSlug, activePropertyId, fitTo = "districts", onSelect }: DistrictMapProps) {
  const map = useMap();
  const [ready, setReady] = useState(false);

  /* Wait for Leaflet panes to exist before drawing (Next 16 strictness). */
  useEffect(() => {
    if (!map) return;
    let t: ReturnType<typeof setTimeout>;
    const verify = () => {
      try {
        const panes = (map as unknown as { _panes?: Record<string, unknown> })._panes;
        const c = map.getContainer();
        if (panes?.tilePane && panes?.overlayPane && c && document.body.contains(c)) {
          map.invalidateSize();
          setReady(true);
        } else t = setTimeout(verify, 80);
      } catch {
        t = setTimeout(verify, 80);
      }
    };
    verify();
    return () => clearTimeout(t);
  }, [map]);

  /* Frame the view: active district → that ring; property mode → the pins;
     otherwise → all district rings. */
  useEffect(() => {
    if (!ready || !map) return;
    const active = activeSlug ? districts.find((d) => d.slug === activeSlug) : null;
    let pts: [number, number][] = [];
    if (active) {
      pts = active.boundary.map((p) => [p.lat, p.lng]);
    } else if (fitTo === "properties" && properties.some((p) => p.coords)) {
      pts = properties.filter((p) => p.coords).map((p) => [p.coords!.lat, p.coords!.lng]);
    } else {
      pts = districts.flatMap((d) => d.boundary.map((p) => [p.lat, p.lng] as [number, number]));
    }
    if (pts.length) {
      map.flyToBounds(L.latLngBounds(pts), {
        padding: [60, 60],
        duration: 0.9,
        maxZoom: active ? 14 : 13,
      });
    }
  }, [ready, activeSlug, districts, properties, fitTo, map]);

  const pin = (active: boolean) =>
    L.divIcon({
      className: "pavani-pin",
      html: `<span style="
        display:block;width:${active ? 16 : 11}px;height:${active ? 16 : 11}px;
        background:${CRIMSON};border:2px solid ${PIN_RING};
        border-radius:50%;box-shadow:0 0 0 ${active ? 6 : 0}px rgba(130,0,13,.18),0 4px 12px rgba(33,10,11,.35);
        transition:all .3s cubic-bezier(.23,1,.32,1);"></span>`,
      iconSize: [active ? 16 : 11, active ? 16 : 11],
      iconAnchor: [active ? 8 : 5.5, active ? 8 : 5.5],
    });

  if (!ready) return null;

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {districts.map((d) => {
        const active = activeSlug === d.slug;
        const dimmed = !!activeSlug && !active;
        return (
          <Polygon
            key={d.slug}
            positions={d.boundary.map((p) => [p.lat, p.lng] as [number, number])}
            eventHandlers={{ click: () => onSelect?.(d.slug) }}
            pathOptions={{
              color: active ? CRIMSON : "rgba(130,0,13,0.5)",
              weight: active ? 2.5 : 1.25,
              fillColor: CRIMSON,
              fillOpacity: dimmed ? 0.03 : active ? 0.16 : 0.07,
              dashArray: active ? undefined : "4 8",
            }}
          >
            <Popup>
              <div style={{ fontFamily: "var(--font-cormorant), serif", padding: "2px 4px" }}>
                <p style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "#631C20", margin: 0 }}>District</p>
                <h4 style={{ fontSize: 18, margin: "2px 0 4px", letterSpacing: "-0.01em" }}>{d.name}</h4>
                <p style={{ fontSize: 11, color: "#82000D", fontWeight: 700, margin: 0 }}>{d.priceBand}</p>
              </div>
            </Popup>
          </Polygon>
        );
      })}

      {properties.map((p) => {
        if (!p.coords) return null;
        const inActiveDistrict = activeSlug === p.districtSlug;
        if (activeSlug && !inActiveDistrict) return null;
        const active = inActiveDistrict || activePropertyId === p._id;
        return (
          <Marker key={p._id} position={[p.coords.lat, p.coords.lng]} icon={pin(active)}>
            <Popup>
              <div style={{ fontFamily: "var(--font-montserrat), sans-serif", padding: "2px 4px", minWidth: 140 }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em", margin: "0 0 4px" }}>{p.title}</h3>
                {p.price && <p style={{ fontSize: 12, color: "#82000D", fontWeight: 700, margin: 0 }}>{p.price}</p>}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default function DistrictMap(props: DistrictMapProps) {
  const id = useId();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted)
    return <div className="w-full h-full bg-[#F3EFE9] animate-pulse" />;

  return (
    <div className="w-full h-full relative" id={`district-map-${id}`}>
      <MapContainer
        center={[-1.2721, 36.79]}
        zoom={12}
        style={{ height: "100%", width: "100%", background: "#FAF8F4" }}
        zoomControl={false}
        scrollWheelZoom={false}
        attributionControl={false}
      >
        <Layers {...props} />
      </MapContainer>

      <style jsx global>{`
        .pavani-pin { background: transparent !important; border: none !important; }
        .leaflet-container { font-family: var(--font-montserrat), sans-serif; }
        .leaflet-popup-content-wrapper {
          border-radius: 0 !important;
          box-shadow: 0 18px 50px rgba(33, 10, 11, 0.22) !important;
          border: 1px solid rgba(130, 0, 13, 0.2);
        }
        .leaflet-popup-content { margin: 12px 14px !important; }
        .leaflet-popup-tip { border: 1px solid rgba(130, 0, 13, 0.2); }
      `}</style>
    </div>
  );
}
