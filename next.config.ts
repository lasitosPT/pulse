import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Emit a minimal, self-contained server for Docker/Node deployments.
  output: 'standalone',
}

export default nextConfig
