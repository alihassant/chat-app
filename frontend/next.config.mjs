/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Match any image on the domain
        hostname: "res.cloudinary.com",
      },
      {
        // Match any image on the hostname
        hostname: "images.unsplash.com",
      },
      {
        // Match any image on the hostname
        hostname: "github.com",
      },
      {
        // Match any image on the hostname
        hostname: "t4.ftcdn.net",
      },
    ],
  },
};

export default nextConfig;
