"use client";
import { useState } from "react";
import SearchForm from "../components/SearchForm";
import WeatherDisplay from "../components/WeatherDisplay";

const Home = () => {
  const [city, setCity] = useState("");

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-center mt-8">
        <SearchForm onSearch={setCity} />
      </div>
      {city && <WeatherDisplay city={city} />}
    </div>
  );
};

export default Home;
