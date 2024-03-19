import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

const EditForm = ({ data, setData, formStyle }) => {
  const [searchResults, setSearchResults] = useState({
    origin: [],
    destination: [],
  });

  const handleInputChange = (name, value) => {
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = async (inputValue, location) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${inputValue}&format=json&addressdetails=1`
      );
      const places = response.data;
      setSearchResults((prevSearchResults) => ({
        ...prevSearchResults,
        [location]: places,
      }));
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const debouncedHandleSearch = useMemo(
    () =>
      debounce((inputValue, location) => {
        handleSearch(inputValue, location);
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  const handleResultClick = (selectedPlace, place) => {
    handleInputChange(`${place}_coordinate`, [
      selectedPlace.lat,
      selectedPlace.lon,
    ]);
    handleInputChange(place, selectedPlace.display_name);
  };

  return (
    <div
      className="form-container"
      style={{
        ...formStyle,
        position: absolute,
        zIndex: "1000",
        margin: "10px",
        padding: "10px",
        border: "1px solid #aaa",
        boxShadow: " 0px 0px 1px black",
        backgroundColor: "white",
      }}
    >
      <div>
        <label className="form-label"> Origin : </label>
        <input
          type="text"
          className="form-control"
          placeholder="Origin"
          name="origin"
          value={data?.origin || ""}
          onBlur={() =>
            setTimeout(
              () => setSearchResults({ origin: [], destination: [] }),
              300
            )
          }
          onChange={(e) => {
            const inputValue = e.target.value;
            debouncedHandleSearch(inputValue, "origin");
            handleInputChange("origin", inputValue);
          }}
          required
        />
      </div>
      {searchResults["origin"].length > 0 && (
        <ul className="list" style={{ position: "absolute", zIndex: 100 }}>
          {searchResults["origin"].map((result) => (
            <li
              key={result.place_id}
              className="list-item"
              style={{
                border: "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: "white",
              }}
              onClick={() => handleResultClick(result, "origin")}
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
      <div>
        <label className="form-label"> Destination : </label>
        <input
          type="text"
          className="form-control"
          placeholder="Destination"
          name="destination"
          value={data?.destination || ""}
          onBlur={() =>
            setTimeout(
              () => setSearchResults({ origin: [], destination: [] }),
              300
            )
          }
          onChange={(e) => {
            const inputValue = e.target.value;
            debouncedHandleSearch(inputValue, "destination");
            handleInputChange("destination", inputValue);
          }}
          required
        />
      </div>
      {searchResults["destination"].length > 0 && (
        <ul className="list" style={{ position: "absolute", zIndex: 100 }}>
          {searchResults["destination"].map((result) => (
            <li
              key={result.place_id}
              className="list-item"
              style={{
                border: "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: "white",
              }}
              onClick={() => handleResultClick(result, "destination")}
            >
              {result.display_name}
            </li>
          ))}
        </ul>
      )}
      <div>
        <label className="form-label"> Mode of Transport : </label>
        <select
          className="form-select"
          name="travel_mode"
          value={data?.travel_mode || ""}
          onChange={(e) => handleInputChange(e.target.name, e.target.value)}
          required
        >
          <option value="">Select Mode Of Transport</option>
          <option value="car">Car</option>
          <option value="foot">Foot</option>
          <option value="bike">Bike</option>
          <option value="air">Air (Plane / Helicopter) </option>
        </select>
      </div>
    </div>
  );
};

export default EditForm;
