/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'files.stripe.com',
    ],
  },
  experimental: {
    ewNextLinkBehavior: true,
  }
}

module.exports = nextConfig
