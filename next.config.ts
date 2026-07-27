import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Adding allowedDevOrigins to address the cross-origin warning during development
  allowedDevOrigins: [
      '*.cluster-axf5tvtfjjfekvhwxwkkkzsk2y.cloudworkstations.dev',
  ],
};

export default nextConfig;
