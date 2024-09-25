// Importing necessary modules
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

// Getting the filename and dirname for ESM modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  mode: isDevelopment ? 'development' : 'production',  // Mode switch
  entry: './src/index.js',  // Entry point for frontend JavaScript
  output: {
    filename: isDevelopment ? 'bundle.js' : 'bundle.[contenthash].js',  // Naming the bundled file
    path: path.resolve(__dirname, 'dist'),  // Output directory
    clean: true,  // Clean the dist folder before each build
  },
  module: {
    rules: [
      {
        test: /\.js$/,  // Transpile JS files using Babel
        exclude: /node_modules|src\/backend/,  // Exclude node_modules and backend files
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,  // Handle CSS files
        use: [
          'style-loader',  // Inject CSS into DOM
          'css-loader',  // Turn CSS into CommonJS
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,  // Handle image files
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/PAGES/home.html',  // Template for the HTML file
      filename: 'index.html',
    }),
    new CssMinimizerPlugin(),  // Minimize CSS files
  ],
  devtool: isDevelopment ? 'inline-source-map' : 'source-map',  // Source maps in development
  devServer: {
    static: './dist',  // Use static files from 'dist' directory
    hot: true,  // Enable Hot Module Replacement
    port: 3000,  // Dev server port
    compress: true,  // Gzip compression
    open: true,  // Automatically open the browser
  },
};
