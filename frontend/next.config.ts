/** @type {import('next').NextConfig} */

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['images.stockx.com', 'stockx-assets.imgix.net'],
  },
};

module.exports = nextConfig;
