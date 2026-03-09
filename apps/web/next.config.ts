import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@b2b/db', '@b2b/core', '@b2b/tracking'],
};

export default nextConfig;
