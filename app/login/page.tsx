"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<"user" | "engineer" | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (selectedRole: "user" | "engineer") => {
    setIsLoading(true)
    // Store the role in localStorage for client-side awareness (optional)
    localStorage.setItem("userRole", selectedRole)

    // Redirect based on role
    if (selectedRole === "user") {
      router.push("/dashboard")
    } else {
      router.push("/engineer")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Support System</h1>
            <p className="text-blue-100">Sign in to continue</p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => handleLogin("user")}
              disabled={isLoading}
              className="w-full h-12 bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg"
            >
              Login as User
            </Button>

            <Button
              onClick={() => handleLogin("engineer")}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 border-white/30 text-white hover:bg-white/10 font-semibold text-lg"
            >
              Login as Support Engineer
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/20 space-y-2 text-center text-sm text-blue-100">
            <p>
              <strong>Users:</strong> Submit and track support tickets
            </p>
            <p>
              <strong>Engineers:</strong> Manage and resolve issues
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
