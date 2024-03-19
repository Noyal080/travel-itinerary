import React, { useRef, useState, useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { decode, encode } from "@mapbox/polyline";
const InteractiveMap = ({ children, data, setData, mapConfig, mapStyle }) => {
  const {
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
  const [mapIsReady, setMapIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const mergePolylines = (polylines) => {
    const mergedPoints = polylines?.reduce((acc, encoded_polyline) => {
      const decodedPoints = decode(encoded_polyline);
      acc.push(...decodedPoints);
      return acc;
    }, []);
    const mergedEncodedPolyline = encode(mergedPoints);
    return mergedEncodedPolyline;
  };

  const createStraightPolyline = (startLatLng, endLatLng) => {
    return encode([startLatLng, endLatLng]);
  };

  const fetchEncodedPolyline = async (override_mode_of_transportation) => {
    setLoading(true);
    const originLatitude =
      data?.origin_coordinate && data?.origin_coordinate[0];
    const originLongitude =
      data?.origin_coordinate && data?.origin_coordinate[1];
    const destLatitude =
      data?.destination_coordinate && data?.destination_coordinate[0];
    const destLongitude =
      data?.destination_coordinate && data?.destination_coordinate[1];

    const mode_of_transportation =
      override_mode_of_transportation || data?.travel_mode;

    if (mode_of_transportation === "air") {
      const encoded_polyline = createStraightPolyline(
        [originLatitude, originLongitude],
        [destLatitude, destLongitude]
      );
      setData((prevData) => ({
        ...prevData,
        encoded_polyline: encoded_polyline,
      }));
    } else {
      if (originLatitude && originLongitude && destLongitude && destLatitude) {
        const osrmElevationUrl = `https://routing.openstreetmap.de/routed-${mode_of_transportation}/route/v1/driving/`;
        const lngLatOrigin = `${originLongitude},${originLatitude}`;
        const lngLatDestination = `${destLongitude},${destLatitude}`;
        const queryParams = "overview=false&alternatives=true&steps=true";
        const reqUrl = `${osrmElevationUrl}${lngLatOrigin};${lngLatDestination}?${queryParams}`;
        try {
          const response = await axios.post(reqUrl);
          if (response.status === 200) {
            const array_of_objects = response.data.routes[0].legs[0].steps;
            const encoded_polyline = mergePolylines(
              array_of_objects.map((obj) => obj.geometry)
            );
            setData((prevData) => ({
              ...prevData,
              encoded_polyline: encoded_polyline,
            }));
          }
        } catch (error) {
          console.error("Error fetching encoded polyline:", error);
        }
      }
    }
    setLoading(false);
  };

  const generateRouteInfo = (override_mode_of_transportation) => {
    fetchEncodedPolyline(override_mode_of_transportation);
  };

  useEffect(() => {
    if (
      (mapIsReady,
      mapRef.current && data?.origin_coordinate && data?.destination_coordinate)
    ) {
      const bounds = L.latLngBounds([
        [data?.origin_coordinate[0], data?.origin_coordinate[1]],
        [data?.destination_coordinate[0], data?.destination_coordinate[1]],
      ]);
      mapRef.current.fitBounds(bounds);
      generateRouteInfo();
    } else if (
      mapRef.current &&
      (data?.origin_coordinate || data?.destination_coordinate)
    ) {
      const coordinates =
        data?.origin_coordinate || data?.destination_coordinate;
      const bounds = L.latLngBounds([
        [coordinates[0], coordinates[1]],
        [coordinates[0], coordinates[1]],
      ]);
      mapRef.current.fitBounds(bounds);
      generateRouteInfo();
    }
  }, [
    data?.origin_coordinate,
    data?.destination_coordinate,
    data?.travel_mode,
    mapIsReady,
  ]);

  const getValidCoordinate = (coordinate) => {
    if (coordinate && coordinate?.length === 2) {
      return [parseFloat(coordinate[0]), parseFloat(coordinate[1])];
    }
    return null;
  };

  const updateCoordinate = (coordinate, key) => {
    setData((prevData) => ({
      ...prevData,
      [key]: coordinate,
    }));
  };

  const originCoordinate = getValidCoordinate(data?.origin_coordinate);
  const destinationCoordinate = getValidCoordinate(
    data?.destination_coordinate
  );

  const center = originCoordinate || destinationCoordinate || [0, 0];

  const handleMarkerDragEnd = (event, key) => {
    updateCoordinate(
      [event.target.getLatLng().lat, event.target.getLatLng().lng],
      key
    );
  };

  const decodeGeometry = (encodedGeometry) => {
    return decode(encodedGeometry);
  };

  const render_manual_option =
    (data?.origin && !data?.origin_coordinate) ||
    (data?.destination && !data?.destination_coordinate);
  const handleMapClick = (e) => {
    mapRef?.current?.off("click", handleMapClick);
    if (render_manual_option) {
      const key = data?.origin_coordinate
        ? "destination_coordinate"
        : "origin_coordinate";
      updateCoordinate([e.latlng.lat, e.latlng.lng], key);
    }
  };
  mapRef?.current?.on("click", handleMapClick);

  return (
    <div>
      <MapContainer
        center={
          (mapRef?.current?._lastCenter
            ? mapRef?.current?._lastCenter
            : mapPosition) || center
        }
        zoom={mapRef?.current?._zoom ? mapRef.current._zoom : zoom}
        style={{
          ...mapStyle,
          height: mapStyle.height || "500px",
          width: mapStyle.width || "100%",
        }}
        ref={mapRef}
        whenReady={() => setMapIsReady(true)}
      >
        {render_manual_option && (
          <div
            style={{
              backgroundColor: "white",
              width: 200,
              position: "absolute",
              zIndex: 1000,
              top: 10,
              left: 60,
              border: "1px solid #aaa",
              boxShadow: "0px 0px 1px black",
              padding: 5,
            }}
          >
            <b>
              Location of "
              {
                data[
                  data?.origin && !data?.origin_coordinate
                    ? "origin"
                    : "destination"
                ]
              }
              "
            </b>
            <br />
            <div>Click on the map to set location manually</div>
          </div>
        )}
        <TileLayer attribution={attribution} url={url} />
        {loading ? (
          <div className="loader">{loader}</div>
        ) : (
          <>
            {data?.encoded_polyline && (
              <Polyline
                positions={decodeGeometry(data?.encoded_polyline)}
                color={polylineColor ? polylineColor : "green"}
                weight={6}
              />
            )}

            {originCoordinate && (
              <Marker
                // draggable={true}
                position={originCoordinate}
                icon={L.icon({ iconUrl: markerIcon, iconSize: markerSize })}
                // eventHandlers={{
                //   dragend: (e) => {
                //     if (
                //       data?.origin_coordinate &&
                //       data?.destination_coordinate
                //     ) {
                //       generateRouteInfo();
                //     }
                //     handleMarkerDragEnd(e, "origin_coordinate");
                //   },
                // }}
              >
                <Popup>
                  Origin: {data?.origin}
                  <br />
                  Elevation: {data?.origin_elevation} m
                </Popup>
              </Marker>
            )}

            {destinationCoordinate && (
              <Marker
                // draggable={true}
                position={destinationCoordinate}
                icon={L.icon({ iconUrl: markerIcon, iconSize: markerSize })}
                // eventHandlers={{
                //   dragend: (e) => {
                //     if (
                //       data?.origin_coordinate &&
                //       data?.destination_coordinate
                //     ) {
                //       generateRouteInfo();
                //     }
                //     handleMarkerDragEnd(e, "destination_coordinate");
                //   },
                // }}
              >
                <Popup>
                  Destination: {data?.destination} <br />
                  Elevation: {data?.destination_elevation} m
                </Popup>
              </Marker>
            )}
          </>
        )}

        <div>{children}</div>
      </MapContainer>
    </div>
  );
};
export default InteractiveMap;
