/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production"
const nextConfig = {
  // reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: isProd ? false : true,
    domains: ["res.cloudinary.com"],
  },
  experimental: {
    //   swcMinify: true,
    serverComponentsExternalPackages: ["@node-rs/argon2"],
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Sec-WebSocket-Accept, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
