import { useEffect, useState } from "react";

const iconMapping: { [key: string]: string } = {
  "clear-day": "sun",
  "clear-night": "moon",
  "partly-cloudy-day": "cloud-sun",
  cloudy: "cloud",
  rain: "cloud-showers-heavy",
  snow: "snowflake",
  fog: "smog",
  thunderstorm: "bolt",
};

const WeatherDisplay = ({ city }: { city: string }) => {
  interface WeatherData {
    city: string;
    temperature: string;
    condition: string;
    icon: string;
    forecast: { date: string; temp: string; condition: string; icon: string }[];
  }

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${process.env.NEXT_PUBLIC_VISUALCROSSING_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("City not found or API error");
        }

        const data = await response.json();

        console.log("Icon returned by API:", data.currentConditions.icon); // Agregar aquí

        setWeather({
          city: data.address,
          temperature: data.currentConditions.temp,
          condition: data.currentConditions.conditions,
          icon: data.currentConditions.icon,
          forecast: data.days.slice(1, 4).map((day: any) => ({
            date: day.datetime,
            temp: day.temp,
            condition: day.conditions,
            icon: day.icon,
          })),
        });
      } catch (err) {
        setError((err as Error).message || "Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]);

  const getIcon = (iconName: string) => {
    const iconClass = iconMapping[iconName] || "question-circle"; // Si no hay coincidencia, muestra un icono genérico
    return <i className={`fas fa-${iconClass} text-4xl`} />;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100"
        role="alert"
      >
        {error}
      </div>
    );
  }

  if (weather) {
    return (
      <div className="p-4 border rounded-md shadow-md">
        <h2 className="text-xl font-bold">{weather.city}</h2>
        <div className="flex items-center">
          <div className="ml-4">
            <p className="text-lg">{weather.temperature}°C</p>
            <p>{weather.condition}</p>
            {getIcon(weather.icon)}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">3-Day Forecast</h3>
          <div className="flex gap-4">
            {weather.forecast.map((day, index) => (
              <div key={index} className="p-2 border rounded-md text-center">
                <p>{day.date}</p>
                {getIcon(day.icon)}
                <p>{day.temp}°C</p>
                <p>{day.condition}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WeatherDisplay;
