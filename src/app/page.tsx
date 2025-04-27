"use client";
import { useState } from "react";
import SearchForm from "../components/SearchForm";
import WeatherDisplay from "../components/WeatherDisplay";

const Home = () => {
  const [city, setCity] = useState("");
  const handleSearch = (newCity: string) => {
    setCity(newCity);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-6">
        <SearchForm onSearch={handleSearch} />
        {city && <WeatherDisplay city={city} />}
      </div>
    </div>
  );
};

export default Home;
