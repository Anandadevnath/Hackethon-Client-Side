import { useState } from 'react';

export const useWeather = (upazila) => {
  const [weather, setWeather] = useState({ temp: "...", humidity: "...", rainfall: "...", location: "...", fetched: false });
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadWeatherForUpazila = async (name) => {
    if (!name) return;
    setLoading(true);
    try {
      const q = encodeURIComponent(name + ", Bangladesh");
      const resGeo = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`);
      const arr = await resGeo.json();
      const geo = arr[0];
      const lat = geo?.lat ?? 23.8103;
      const lon = geo?.lon ?? 90.4125;

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=relativehumidity_2m&current_weather=true&timezone=Asia%2FDhaka`;
      const res = await fetch(url);
      const d = await res.json();

      if (d.daily) {
        const days = d.daily.time.slice(0, 5).map((t, i) => ({
          date: t,
          temp_max: d.daily.temperature_2m_max[i],
          temp_min: d.daily.temperature_2m_min[i],
          precip_prob: d.daily.precipitation_probability_max[i] ?? 0,
        }));

        setWeather({
          temp: `${Math.round(d.current_weather?.temperature ?? days[0].temp_max)}°C`,
          humidity: `${Math.round(d.hourly.relativehumidity_2m[0])}%`,
          rainfall: `${days[0].precip_prob}%`,
          location: geo?.display_name || name,
          fetched: true,
        });
        setForecast(days);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { weather, forecast, loading, loadWeatherForUpazila };
};
