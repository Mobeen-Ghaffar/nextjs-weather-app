/** @format */

module.exports = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
      }
    ]
  }
};