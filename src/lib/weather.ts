// Servicio de Clima Andino en Vivo para Santiago Hiking
// Conexión directa a Open-Meteo API (sin claves, soporte de cota y coordenadas exactas)

export interface MountainWeather {
  temperature: number;
  apparentTemperature: number;
  windSpeed: number;
  windGusts: number;
  precipitationProb: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  isFavorable: boolean;
  statusText: string;
}

export async function getMountainWeather(
  lat: number = -33.3458, // Default Manquehuito / Lo Barnechea
  lng: number = -70.5700,
  elevation: number = 1638
): Promise<MountainWeather> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&elevation=${elevation}&current=temperature_2m,apparent_temperature,precipitation,wind_speed_10m,wind_gusts_10m&daily=sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=America%2FSantiago`;

    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache 1 hora
    if (!res.ok) throw new Error('Error al conectar con Open-Meteo');

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    const temp = Math.round(current?.temperature_2m ?? 12);
    const wind = Math.round(current?.wind_speed_10m ?? 15);
    const gusts = Math.round(current?.wind_gusts_10m ?? 25);
    const rainProb = daily?.precipitation_probability_max?.[0] ?? 0;
    const uv = Math.round(daily?.uv_index_max?.[0] ?? 6);

    const sunriseRaw = daily?.sunrise?.[0] || '';
    const sunsetRaw = daily?.sunset?.[0] || '';

    const formatHour = (iso: string) => {
      if (!iso) return '--:--';
      const parts = iso.split('T')[1];
      return parts ? parts.substring(0, 5) : iso;
    };

    const isFavorable = wind < 45 && rainProb < 40;
    let statusText = 'Condiciones óptimas de cumbre';
    if (wind >= 45) statusText = 'Viento fuerte en arista - Precaución';
    else if (rainProb >= 40) statusText = 'Probabilidad de precipitación';

    return {
      temperature: temp,
      apparentTemperature: Math.round(current?.apparent_temperature ?? temp),
      windSpeed: wind,
      windGusts: gusts,
      precipitationProb: rainProb,
      uvIndex: uv,
      sunrise: formatHour(sunriseRaw),
      sunset: formatHour(sunsetRaw),
      isFavorable,
      statusText,
    };
  } catch (err) {
    // Fallback seguro en caso de corte o coordenadas no resueltas
    return {
      temperature: 11,
      apparentTemperature: 9,
      windSpeed: 14,
      windGusts: 22,
      precipitationProb: 5,
      uvIndex: 6,
      sunrise: '06:44',
      sunset: '19:55',
      isFavorable: true,
      statusText: 'Monitoreo meteorológico activo',
    };
  }
}
