// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// export default nextConfig





/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/',
      },
      {
        source: '/dashboard/:path*',
        destination: '/',
      },
      {
        source: '/login',
        destination: '/',
      },
      {
        source: '/register',
        destination: '/',
      },
    ]
  },
}

export default nextConfig