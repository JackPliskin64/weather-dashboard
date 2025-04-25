"use client";
import { useState } from "react";
import SearchForm from "../components/SearchForm";
import WeatherDisplay from "../components/WeatherDisplay";

const Home = () => {
  const [city, setCity] = useState("");

  return (
    <div className="container mx-auto p-4">
      <SearchForm onSearch={setCity} />
      {city && <WeatherDisplay city={city} />}
    </div>
  );
};

export default Home;
