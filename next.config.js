/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // images:{
  //   domains: []
  // }
}



// next.config.js
const removeImports = require('next-remove-imports')();
module.exports = removeImports(nextConfig);