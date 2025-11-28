// src/utils/riskEngine.js

export function getMockWeatherForecast(division) {
  const divisionConfig = {
    "Chattogram Division": {
      temp: [28, 33],
      humidity: [70, 93],
      rain: [40, 80],
    },
    "Dhaka Division": { temp: [27, 32], humidity: [60, 85], rain: [30, 60] },
    "Rajshahi Division": { temp: [26, 34], humidity: [45, 70], rain: [10, 40] },
    "Rangpur Division": { temp: [25, 32], humidity: [65, 90], rain: [30, 70] },
  };

  const cfg = divisionConfig[division] || divisionConfig["Dhaka Division"];
  const rand = (min, max) => (Math.random() * (max - min) + min).toFixed(1);

  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push({
      day: `Day ${i + 1}`,
      temp: Number(rand(cfg.temp[0], cfg.temp[1])),
      humidity: Number(rand(cfg.humidity[0], cfg.humidity[1])),
      rainProb: Number(rand(cfg.rain[0], cfg.rain[1])),
    });
  }
  return days;
}

export function calculateETCL(moisture, temperature, weather) {
  const riskFactor = (moisture - 14) * 2 + (temperature - 28) * 1.5;

  let etcl = 120 - riskFactor * 6;
  etcl = Math.min(Math.max(etcl, 12), 120);

  const avgHumidity =
    weather.reduce((a, b) => a + b.humidity, 0) / weather.length;
  const avgRain = weather.reduce((a, b) => a + b.rainProb, 0) / weather.length;
  const avgTemp = weather.reduce((a, b) => a + b.temp, 0) / weather.length;

  if (avgHumidity > 80) etcl -= 12;
  if (avgRain > 60) etcl -= 18;
  if (avgTemp > 32) etcl -= 6;

  etcl = Math.max(12, etcl);

  return {
    etcl: Math.round(etcl),
    avgHumidity: avgHumidity.toFixed(1),
    avgRain: avgRain.toFixed(1),
    avgTemp: avgTemp.toFixed(1),
  };
}

// Generate human-readable, dynamic message
export function generateRiskSummaryFromRow(row) {
  const forecast = getMockWeatherForecast(row["Location (Division)"]);
  const result = calculateETCL(row["Moisture (%)"], row["Temp (C)"], forecast);

  let riskLevel;
  let advice = "";

  if (result.etcl <= 24) {
    riskLevel = "Critical";
    advice =
      "Immediate action required: dry indoors, aerate, and monitor closely.";
  } else if (result.etcl <= 48) {
    riskLevel = "High";
    advice =
      "High risk: check storage conditions, consider aeration and moisture control.";
  } else if (result.etcl <= 72) {
    riskLevel = "Moderate";
    advice = "Moderate risk: monitor moisture and temperature regularly.";
  } else {
    riskLevel = "Low";
    advice = "Low risk: maintain standard storage procedures.";
  }

  const message =
    `${row["Batch_ID"]} in ${row["Location (District)"]}, ${row["Location (Division)"]} is at ${riskLevel} risk. ` +
    `Estimated Time to Critical Loss (ETCL): ${result.etcl} hours. ` +
    `Average humidity: ${result.avgHumidity}%, rainfall probability: ${result.avgRain}%. ${advice}`;

  return {
    batchId: row["Batch_ID"],
    division: row["Location (Division)"],
    district: row["Location (District)"],
    riskLevel,
    etcl: result.etcl,
    avgHumidity: result.avgHumidity,
    avgRain: result.avgRain,
    forecast,
    message,
  };
}
