// Nexus: CampusPulse Global Supabase Client
// Connects dynamically to PostgreSQL when keys are provided in .env.local or Vercel environment.
// Falls back seamlessly to offline-first local state when keys are unset.

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id")
  );
};

export const getSupabaseConfig = () => {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    configured: isSupabaseConfigured(),
  };
};
