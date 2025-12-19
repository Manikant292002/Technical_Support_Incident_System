import { createClient } from "./supabase/server"

export async function getUserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return {
    user,
    profile,
  }
}

export async function isEngineer(userId: string) {
  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single()

  return profile?.role === "engineer" || profile?.role === "admin"
}
