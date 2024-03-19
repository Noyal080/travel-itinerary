const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    libraryTarget: "umd",
    library: "travel-itinerary",
    umdNamedDefine: true,
  },
  mode: "production",
  externals: {
    react: "react",
    "react-dom": "react-dom",
    "react-leaflet": "react-leaflet",
    leaflet: "leaflet",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.css$/,
        include: /node_modules\/leaflet/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.css$/,
        include: /node_modules\/c3/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  devtool: "source-map",
};
