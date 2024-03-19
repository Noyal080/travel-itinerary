import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { decode } from "@mapbox/polyline";
import "leaflet/dist/leaflet.css";
import "./style.css";
import { Icon } from "leaflet";

const ViewMap = ({ data, mapConfig, mapStyle }) => {
  const {
    showElevation,
    url,
    attribution,
    markerIcon,
    markerSize,
    polylineColor,
    loader,
    zoom,
    mapPosition,
  } = mapConfig;
  const mapRef = useRef(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [decodedGeometry, setDecodedGeometry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const decodeGeometry = (encodedGeometry) => {
    return decode(encodedGeometry);
  };

  const handleMapInit = () => {
    setMapInitialized(true);
  };

  let bounds = [];
  useEffect(() => {
    let timeout;
    if (mapInitialized && data?.encoded_polyline) {
      setIsLoading(true);
      const decoded = decodeGeometry(data?.encoded_polyline);
      setDecodedGeometry(decoded);
      bounds = bounds.concat(decoded);
      mapRef?.current.fitBounds(bounds);
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else if (
      mapInitialized &&
      data?.origin_coordinates &&
      data?.destination_coordinates
    ) {
      setIsLoading(true);
      const origin = data?.origin_coordinates;
      const destination = data?.destination_coordinates;
      const points = [origin, destination];
      setDecodedGeometry(points);
      bounds = bounds.concat(points);
      mapRef?.current.fitBounds(bounds);
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }

    return () => clearTimeout(timeout);
  }, [mapInitialized, data]);

  return (
    <MapContainer
      ref={mapRef}
      style={{
        ...mapStyle,
        height: mapStyle.height || "500px",
        width: mapStyle.width || "100%",
      }}
      zoom={mapRef?.current?._zoom ? mapRef.current._zoom : zoom}
      center={
        mapRef?.current?._lastCenter
          ? mapRef?.current?._lastCenter
          : mapPosition
      }
      scrollWheelZoom={true}
      whenReady={handleMapInit}
    >
      <TileLayer attribution={attribution} url={url} />
      {isLoading ? (
        <div className="loader">{loader}</div>
      ) : (
        <div>
          {decodedGeometry && (
            <div>
              {data?.origin_coordinates && (
                <Marker
                  position={data?.origin_coordinates}
                  icon={
                    new Icon({
                      iconUrl: markerIcon,
                      iconSize: markerSize,
                    })
                  }
                >
                  <Popup>
                    Origin: {data?.origin}
                    <br />
                    Elevation: {parseInt(data.origin_elevation)} m
                  </Popup>
                </Marker>
              )}
              {data?.destination_coordinates && (
                <Marker
                  position={data?.destination_coordinates}
                  icon={
                    new Icon({
                      iconUrl: markerIcon,
                      iconSize: markerSize,
                    })
                  }
                >
                  <Popup>
                    Destination: {data?.destination}
                    <br />
                    Elevation:{parseInt(data?.destination_elevation)} m
                  </Popup>
                </Marker>
              )}

              <Polyline
                positions={decodedGeometry}
                color={polylineColor ? polylineColor : "green"}
              />
            </div>
          )}
        </div>
      )}
      {showElevation &&
        data?.origin_elevation &&
        data?.destination_elevation && (
          <div
            style={{
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
              {data.origin}: {parseInt(data.origin_elevation)} m
            </div>
            <div>
              {data.destination}: {parseInt(data.destination_elevation)} m
            </div>
          </div>
        )}
    </MapContainer>
  );
};

export default ViewMap;
