import { useEffect, useState } from "react";

const WeatherDisplay = ({ city }: { city: string }) => {
  interface WeatherData {
    city: string;
    temperature: string;
    condition: string;
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
        const data = await response.json();
        setWeather({
          city: data.address,
          temperature: data.currentConditions.temp,
          condition: data.currentConditions.conditions,
        });
      } catch (err) {
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    if (city) {
      fetchWeather();
    }
  }, [city]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (weather) {
    return (
      <div className="p-4 border rounded-md shadow-md">
        <h2 className="text-xl font-bold">{weather.city}</h2>
        <div className="flex items-center">
          <div className="ml-4">
            <p className="text-lg">{weather.temperature}°C</p>
            <p>{weather.condition}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default WeatherDisplay;
