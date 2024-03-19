import React, { useEffect } from "react";
import axios from "axios";
const ElevationInfo = ({ data, setData, elevationStyle }) => {
  const fetchElevation = async () => {
    const originLatitude =
      data?.origin_coordinate && data?.origin_coordinate[0];
    const originLongitude =
      data?.origin_coordinate && data?.origin_coordinate[1];
    const destLatitude =
      data?.destination_coordinate && data?.destination_coordinate[0];
    const destLongitude =
      data?.destination_coordinate && data?.destination_coordinate[1];
    let originElevation = null;
    let destinationElevation = null;
    if (originLatitude && originLongitude) {
      const apiUrlOrigin = `https://api.open-elevation.com/api/v1/lookup?locations=${originLatitude},${originLongitude}`;
      try {
        const response = await axios.get(apiUrlOrigin);
        if (response.status === 200) {
          const elevationData = response.data;
          const elevation = elevationData.results[0].elevation;
          originElevation = elevation;
        }
      } catch (error) {
        console.error("Error fetching elevation:", error);
      }
      setData((prevData) => ({
        ...prevData,
        origin_elevation: originElevation,
      }));
    }
    if (destLatitude && destLongitude) {
      const apiUrlDestination = `https://api.open-elevation.com/api/v1/lookup?locations=${destLatitude},${destLongitude}`;
      try {
        const response = await axios.get(apiUrlDestination);
        if (response.status === 200) {
          const elevationData = response.data;
          const elevation = elevationData.results[0].elevation;
          destinationElevation = elevation;
        }
      } catch (error) {
        console.error("Error fetching elevation:", error);
      }
      setData((prevData) => ({
        ...prevData,
        destination_elevation: destinationElevation,
      }));
    }
  };

  useEffect(() => {
    fetchElevation();
  }, [data?.origin_coordinate, data?.destination_coordinate]);

  return (
    <div>
      {data?.origin &&
        data?.destination &&
        data?.origin_elevation &&
        data?.destination_elevation && (
          <div
            style={{
              ...elevationStyle,
              position: "absolute",
              zIndex: 1000,
              bottom: 10,
              right: 10,
              padding: 5,
              border: "1px solid #aaa",
              boxShadow: "0px 0px 1px black",
              backgroundColor: "white",
            }}
          >
            <div>
              <b>Elevation</b>
            </div>
            <div>
              {data?.origin}: {data?.origin_elevation} m
            </div>
            <div>
              {data?.destination}: {data?.destination_elevation} m
            </div>
          </div>
        )}
    </div>
  );
};
export default ElevationInfo;
