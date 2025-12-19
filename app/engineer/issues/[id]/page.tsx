"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Issue {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  submitter_name: string
  assigned_engineer: string | null
  created_at: string
  updated_at: string
  resolved_at: string | null
}

const statusOptions = ["open", "in_progress", "resolved", "closed"]
const priorityOptions = ["low", "medium", "high"]

export default function EngineerIssueDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [issue, setIssue] = useState<Issue | null>(null)
  const [status, setStatus] = useState("")
  const [priority, setPriority] = useState("")
  const [assignedEngineer, setAssignedEngineer] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [submitterName, setSubmitterName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadIssue() {
      const { data, error } = await supabase.from("issues").select("*").eq("id", id).single()

      if (error || !data) {
        setIsLoading(false)
        return
      }

      setIssue(data)
      setStatus(data.status)
      setPriority(data.priority)
      setAssignedEngineer(data.assigned_engineer || "")
      setTitle(data.title)
      setDescription(data.description)
      setSubmitterName(data.submitter_name || "")
      setIsLoading(false)
    }

    loadIssue()
  }, [id, supabase])

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    setError(null)

    try {
      const { error } = await supabase
        .from("issues")
        .update({
          status: newStatus,
          resolved_at: newStatus === "resolved" ? new Date().toISOString() : null,
        })
        .eq("id", id)

      if (error) throw error
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    }
  }

  const handlePriorityChange = async (newPriority: string) => {
    setPriority(newPriority)
    setError(null)

    try {
      const { error } = await supabase.from("issues").update({ priority: newPriority }).eq("id", id)

      if (error) throw error
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update priority")
    }
  }

  const handleAssignEngineer = async () => {
    setError(null)

    try {
      const { error } = await supabase.from("issues").update({ assigned_engineer: assignedEngineer }).eq("id", id)

      if (error) throw error
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign engineer")
    }
  }

  const handleManualSave = async () => {
    setIsSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from("issues")
        .update({
          title,
          description,
          submitter_name: submitterName,
          status,
          priority,
          assigned_engineer: assignedEngineer || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!issue) {
    notFound()
  }

  const statusColors: Record<string, string> = {
    open: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
  }

  const priorityColors: Record<string, string> = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-red-100 text-red-800",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Manage Ticket</h1>
          <div className="flex gap-2">
            <Button onClick={handleManualSave} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
            <Link href="/engineer">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Issue Title</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xl font-bold" />
                </div>
                <div className="space-y-2">
                  <Label>Submitter Name</Label>
                  <Input value={submitterName} onChange={(e) => setSubmitterName(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Problem Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} />
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-gray-900">Category</h3>
                <p className="text-gray-700">{issue.category}</p>
              </div>

              <div className="pt-4 border-t text-sm text-gray-600 space-y-1">
                <p>Created: {new Date(issue.created_at).toLocaleString()}</p>
                <p>Last Updated: {new Date(issue.updated_at).toLocaleString()}</p>
                {issue.resolved_at && <p>Resolved: {new Date(issue.resolved_at).toLocaleString()}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ticket Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Status</Label>
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Priority</Label>
                  <Select value={priority} onValueChange={handlePriorityChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
