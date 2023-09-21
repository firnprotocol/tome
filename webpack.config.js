const HtmlWebpackPlugin = require("html-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

let webpackModeOptions;
if (process.env.NODE_ENV === "production") {
  webpackModeOptions = {
    mode: "production"
  };
} else {
  webpackModeOptions = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
      static: "./dist",
    },
  };
}

module.exports = {
  entry: "/src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "[name][ext]",
  },
  ...webpackModeOptions,
  resolve: {
    alias: {
      hooks: path.resolve(__dirname, "src/hooks"),
      ui: path.resolve(__dirname, "src/ui"),
      utils: path.resolve(__dirname, "src/utils"),
      assets: path.resolve(__dirname, "src/assets"),
      constants: path.resolve(__dirname, "src/constants"),
      components: path.resolve(__dirname, "src/components"),
      tw: path.resolve(__dirname, "src/components/tailwind"),
      layouts: path.resolve(__dirname, "src/components/layouts"),
      icons: path.resolve(__dirname, "src/components/icons"),
    },
    fallback: {
      crypto: false,
      process: "process/browser",
      buffer: require.resolve("buffer"),
      zlib: false,
      assert: require.resolve("assert"),
      stream: require.resolve("stream-browserify"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new FaviconsWebpackPlugin({
      logo: "./src/assets/tome.svg",
    }),
    new webpack.ProvidePlugin({
      React: "react",
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(png|svg|ico)$/i,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
      {
        test: /\.(woff2)$/i,
        type: "asset/resource",
      },
    ],
  },
};
