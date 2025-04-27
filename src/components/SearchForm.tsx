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
    if (city) {
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
  };

  const handleHistoryClick = (item: string) => {
    onSearch(item);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4"
    >
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter a city"
        className="p-2 border border-gray-300 rounded-lg w-full max-w-sm"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
      >
        Search
      </button>

      {history.length > 0 && (
        <div className="mt-4 w-full max-w-sm flex flex-col items-start space-y-2">
          <div className="flex w-full justify-between items-center">
            <h3 className="text-md font-semibold text-gray-700">
              Recent Searches
            </h3>
            <button
              onClick={() => {
                setHistory([]);
                localStorage.removeItem("weather_search_history");
              }}
              className="text-red-500 text-sm hover:underline"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {history.map((item) => (
              <button
                key={item}
                onClick={() => handleHistoryClick(item)}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition text-sm"
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
