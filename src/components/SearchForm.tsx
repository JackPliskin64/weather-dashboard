import { useState, useEffect } from "react";

const SearchForm = ({ onSearch }: { onSearch: (city: string) => void }) => {
  const [city, setCity] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("weather_search_history");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      const newHistory = [
        city,
        ...history.filter((item) => item !== city),
      ].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem(
        "weather_search_history",
        JSON.stringify(newHistory)
      );
    }
    setCity("");
  };

  const handleHistoryClick = (item: string) => {
    onSearch(item);
    setCity("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-sm"
    >
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city"
        className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
      >
        Search
      </button>

      {history.length > 0 && (
        <div className="mt-4 w-full flex flex-col items-start space-y-2">
          <div className="flex w-full justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Recent Searches
            </h3>
            <button
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("weather_search_history");
              }}
              className="text-red-500 text-sm hover:underline cursor-pointer"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {history.map((item) => (
              <button
                key={item}
                onClick={() => handleHistoryClick(item)}
                className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full hover:bg-blue-200 transition text-sm"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchForm;
