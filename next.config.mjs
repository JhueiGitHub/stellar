const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    });
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  images: {
    domains: ["uploadthing.com", "utfs.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "liveblocks.io",
        port: "",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "ucarecdn.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
