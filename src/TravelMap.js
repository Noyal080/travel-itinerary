import React from "react";
import InteractiveMap from "./EditMap";
import ElevationInfo from "./ElevationInfo";
import EditForm from "./EditForm";
const TravelMap = ({ data, setData, mapConfig, mapStyle }) => {
  return (
    <InteractiveMap
      data={data}
      setData={setData}
      mapConfig={mapConfig}
      mapStyle={mapStyle}
    >
      <EditForm data={data} setData={setData} />
      <ElevationInfo data={data} setData={setData} />
    </InteractiveMap>
  );
};

export default TravelMap;
