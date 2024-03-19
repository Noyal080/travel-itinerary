import React, { useEffect, useState } from "react";
import c3 from "c3";
import "c3/c3.css";
import "./style.css";
const ElevationChart = ({
  chartData,
  backgroundImage,
  title,
  chartColor,
  loader,
  chartStyle,
}) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const elevationData = chartData.map((item) => item.elevation);
    const elevationLabels = chartData.map((item) => `Day ${item.day}`);
    const labels = chartData.map((item) => ` ${item.label} `);
    c3.generate({
      bindto: "#elevation-chart",
      data: {
        x: "x",
        columns: [
          ["x", ...elevationLabels],
          ["Elevation", ...elevationData],
        ],
        type: "area-spline",
        labels: {
          format: function (v, id, i, j) {
            // Custom label formatting function
            // v: Value of the data point
            // id: ID of the data point
            // i: Index of the x-axis
            // j: Index of the data point
            // Return formatted label
            return `${v}(m)`;
          },
        },
      },
      color: {
        pattern: chartColor ? [chartColor] : ["green"],
      },
      area: {
        zerobased: true, // Fills the area below the line
      },
      axis: {
        x: {
          type: "category",
          tick: {
            // rotate: 75,
            multiline: false,
            centered: true,
          },
        },
        y: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      title: {
        text: title,
      },
      point: {
        show: true,
      },
      tooltip: {
        // horizontal: false,
        format: {
          title: function (d) {
            return labels[d];
          },
        },
      },
      onrendered: () => {
        setLoading(false);
      },
    });
  }, [loading, chartData]);
  return (
    <>
      {loading ? (
        loader
      ) : (
        <div>
          <div
            className="chartContainer"
            id="elevation-chart-container"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div
              className="elevationChart"
              id="elevation-chart"
              style={{ ...chartStyle }}
            ></div>
          </div>
        </div>
      )}
    </>
  );
};
export default ElevationChart;
