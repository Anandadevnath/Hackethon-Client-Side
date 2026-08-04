import { useState, useEffect, useRef } from 'react';
import districtCenters from '../data/district-centers';

export const useRiskMap = (user) => {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const L = window.L;
    if (!L) return;

    let center = { lat: 23.8103, lng: 90.4125 };
    try {
      const loc = user?.location;
      if (loc && (loc.district || loc.division)) {
        const key = loc.district || loc.division;
        if (districtCenters[key]) center = districtCenters[key];
      }
    } catch (e) { /* ignore */ }

    const mapContainer = L.DomUtil.get('local-risk-map');
    if (mapContainer != null) {
      mapContainer._leaflet_id = null;
    }
    const map = L.map('local-risk-map', {
      zoomControl: true,
      dragging: true,
      attributionControl: false
    }).setView([center.lat, center.lng], 12);

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [user]);

  return { mapRef, mapContainerRef, alerts, setAlerts };
};
