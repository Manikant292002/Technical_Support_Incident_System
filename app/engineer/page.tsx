"use client"

import { CardDescription } from "@/components/ui/card"
import type React from "react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import IssueList from "@/components/issue-list"
import { ChevronLeft, Wrench, Plus, Download, Lock, Mail, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import IssueSubmitDialog from "@/components/issue-submit-dialog"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const supabase = createClient()

export default function EngineerPage() {
  const [issues, setIssues] = useState<any[]>([])
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loginError, setLoginError] = useState(false)
  const [passwordMismatch, setPasswordMismatch] = useState(false)

  useEffect(() => {
    // Check session storage for existing auth
    if (sessionStorage.getItem("engineer_authenticated") === "true") {
      setIsAuthenticated(true)
    }

    async function loadIssues() {
      const { data } = await supabase.from("issues").select("*").order("created_at", { ascending: false })
      setIssues(data || [])
      setIsLoading(false)
    }
    loadIssues()
  }, [supabase])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setPasswordMismatch(true)
      setLoginError(false)
      return
    }

    setPasswordMismatch(false)
    if (password === "admin123") {
      setIsAuthenticated(true)
      sessionStorage.setItem("engineer_authenticated", "true")
      setLoginError(false)
    } else {
      setLoginError(true)
    }
  }

  const downloadReport = () => {
    const headers = ["ID", "Title", "Status", "Priority", "Category", "Submitter", "Created At"]
    const csvContent = [
      headers.join(","),
      ...issues.map((i) =>
        [
          i.id,
          `"${i.title}"`,
          i.status,
          i.priority,
          i.category,
          `"${i.submitter_name || "Anonymous"}"`,
          new Date(i.created_at).toLocaleString(),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `incidents_report_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleIssueAdded = async () => {
    const { data } = await supabase.from("issues").select("*").order("created_at", { ascending: false })
    setIssues(data || [])
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-cyan-600" />
            </div>
            <CardTitle className="text-2xl">Engineer Access</CardTitle>
            <CardDescription>Enter and confirm your password to access the console</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={loginError || passwordMismatch ? "border-red-500" : ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={passwordMismatch ? "border-red-500" : ""}
                />
                {passwordMismatch && <p className="text-xs text-red-500">Passwords do not match.</p>}
                {loginError && <p className="text-xs text-red-500">Invalid password. Hint: admin123</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700">
                Unlock Console
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-cyan-600 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Engineer Console</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={downloadReport}
              variant="outline"
              className="border-cyan-200 text-cyan-700 hover:bg-cyan-50 flex items-center gap-2 bg-transparent"
            >
              <Download className="w-4 h-4" />
              Download Report
            </Button>
            <Button
              onClick={() => setIsSubmitOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Manual Add
            </Button>
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-cyan-600 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Back Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Support Operations</h1>
          <p className="text-slate-600 mt-2 text-lg">Manage technical incidents and track resolution progress.</p>
        </div>
        <IssueList issues={issues} />

        <div className="mt-16 pt-8 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Support</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <a
              href="mailto:manikanthooli20@gmail.com"
              className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>manikanthooli20@gmail.com</span>
            </a>
            <a
              href="https://www.linkedin.com/in/manikanthooli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </main>

      {/* Added dialog for manual issue creation */}
      <IssueSubmitDialog
        isOpen={isSubmitOpen}
        onClose={() => {
          setIsSubmitOpen(false)
          handleIssueAdded()
        }}
      />
    </div>
  )
}
