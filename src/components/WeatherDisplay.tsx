import { useEffect, useState } from "react";

const iconMapping: { [key: string]: string } = {
  "clear-day": "sun",
  "clear-night": "moon",
  "partly-cloudy-day": "cloud-sun",
  "partly-cloudy-night": "cloud-moon",
  cloudy: "cloud",
  rain: "cloud-showers-heavy",
  snow: "snowflake",
  fog: "smog",
  thunderstorm: "bolt",
};

const WeatherDisplay = ({ city }: { city: string }) => {
  interface ForecastDay {
    date: string;
    temp: number;
    condition: string;
    icon: string;
  }

  interface WeatherData {
    city: string;
    temperature: number;
    condition: string;
    icon: string;
    forecast: ForecastDay[];
  }

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fahrenheitToCelsius = (fahrenheit: number) => {
    return ((fahrenheit - 32) * 5) / 9;
  };

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

        const currentTempInCelsius = fahrenheitToCelsius(
          data.currentConditions.temp
        );
        const forecastInCelsius: ForecastDay[] = data.days
          .slice(1, 4)
          .map(
            (day: {
              datetime: string;
              temp: number;
              conditions: string;
              icon: string;
            }) => ({
              date: day.datetime,
              temp: parseFloat(fahrenheitToCelsius(day.temp).toFixed(1)),
              condition: day.conditions,
              icon: day.icon,
            })
          );

        setWeather({
          city: data.address,
          temperature: parseFloat(currentTempInCelsius.toFixed(1)),
          condition: data.currentConditions.conditions,
          icon: data.currentConditions.icon,
          forecast: forecastInCelsius,
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
    const iconClass = iconMapping[iconName] || "question-circle";
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
        className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-100 dark:bg-red-900 dark:text-red-300"
        role="alert"
      >
        {error}
      </div>
    );
  }

  if (weather) {
    return (
      <div className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
        <h2 className="text-6xl text-center rounded-2xl bg-blue-900 font-bold mb-4 text-gray-700 dark:text-gray-300">
          {weather.city}
        </h2>
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-4 mt-8  flex-col">
            <p className="text-6xl">{weather.temperature}°C</p>
            <p className="text-2xl text-center">{weather.condition}</p>
            <span className="mt-8 scale-175">{getIcon(weather.icon)}</span>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="mt-12 text-3xl text-center font-semibold text-gray-700 dark:text-gray-300">
            3-Day Forecast
          </h3>
          <div className="flex mt-4 gap-4">
            {weather.forecast.map((day, index) => (
              <div
                key={index}
                className="flex flex-col p-4 border rounded-md text-center bg-blue-100 dark:bg-blue-900 hover:scale-105 transition ease-in-out"
              >
                <p className="text-gray-700 dark:text-gray-200">{day.date}</p>
                <span className="scale-105 mt-4 mb-4">{getIcon(day.icon)}</span>
                <p className="text-xl font-bold">{day.temp}°C</p>
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
