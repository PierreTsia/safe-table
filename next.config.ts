/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_PROJECT_URL: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
    NEXT_PUBLIC_SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  },
}

export default nextConfig
