/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '**',
      },
      // {
      //   protocol: 'https',
      //   hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      //   port: '',
      //   pathname: '**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'outggvemqdylkseydkof.supabase.co',
      //   port: '',
      //   pathname: '**',
      // },
    ],
  },
}

export default nextConfig
