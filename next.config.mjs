/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/christmas',
      },
    ];
  },
};

export default nextConfig;