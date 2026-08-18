import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      // Retired generator financing / empty blog surfaces → researched guides
      {
        source: '/financing',
        destination: '/guides/sewer-line-repair-cost',
        permanent: true,
      },
      {
        source: '/financing/:path*',
        destination: '/guides/insurance-and-sewer-backup',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/guides',
        permanent: true,
      },
      {
        source: '/blog/:path*',
        destination: '/guides',
        permanent: true,
      },
      // Legacy generator list paths
      {
        source: '/installers',
        destination: '/contractors',
        permanent: true,
      },
      {
        source: '/installers/:path*',
        destination: '/contractors/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
