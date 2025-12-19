"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronLeft, Edit2, Save, X } from "lucide-react"
import Link from "next/link"
import { use } from "react"

interface IssueDetailPageProps {
  params: Promise<{ id: string }>
}

const statusOptions = ["open", "in_progress", "resolved", "closed"]
const priorityOptions = ["low", "medium", "high"]
const categoryOptions = ["Technical Issue", "Billing", "Account", "Feature Request", "General Inquiry"]

export default function IssueDetailPage({ params }: IssueDetailPageProps) {
  const { id } = use(params)
  const [issue, setIssue] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedIssue, setEditedIssue] = useState<any>({})
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function loadIssue() {
      const { data, error } = await supabase.from("issues").select("*").eq("id", id).single()

      if (error || !data) {
        setIsLoading(false)
        return
      }

      setIssue(data)
      setEditedIssue(data)
      setIsLoading(false)
    }

    loadIssue()
  }, [id, supabase])

  const handleSave = async () => {
    setError(null)
    try {
      const { error } = await supabase
        .from("issues")
        .update({
          title: editedIssue.title,
          description: editedIssue.description,
          category: editedIssue.category,
          priority: editedIssue.priority,
          status: editedIssue.status,
          submitter_name: editedIssue.submitter_name,
        })
        .eq("id", id)

      if (error) throw error

      setIssue(editedIssue)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update issue")
    }
  }

  const handleCancel = () => {
    setEditedIssue(issue)
    setIsEditing(false)
    setError(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Support Hub</span>
          </div>
          <Link
            href="/issues"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Active Incidents
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="rounded-2xl border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-100 p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editedIssue.title}
                      onChange={(e) => setEditedIssue({ ...editedIssue, title: e.target.value })}
                      className="text-2xl font-bold"
                    />
                  </div>
                ) : (
                  <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">{issue.title}</CardTitle>
                )}
                {isEditing ? (
                  <div className="space-y-2">
                    <Label>Submitted by</Label>
                    <Input
                      value={editedIssue.submitter_name || ""}
                      onChange={(e) => setEditedIssue({ ...editedIssue, submitter_name: e.target.value })}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500">
                    <span className="text-sm font-medium">
                      Submitted by: {issue.submitter_name || "Anonymous User"}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 items-start">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} size="sm" variant="outline">
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} size="sm" variant="outline">
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}
                {isEditing ? (
                  <div className="flex gap-2">
                    <Select
                      value={editedIssue.status}
                      onValueChange={(value) => setEditedIssue({ ...editedIssue, status: value })}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={editedIssue.priority}
                      onValueChange={(value) => setEditedIssue({ ...editedIssue, priority: value })}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <Badge
                      className={`${statusColors[issue.status] || statusColors.open} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-none shadow-sm`}
                    >
                      {issue.status.replace("_", " ")}
                    </Badge>
                    <Badge
                      className={`${priorityColors[issue.priority] || priorityColors.medium} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border-none shadow-sm`}
                    >
                      {issue.priority} Priority
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-10 bg-white">
            {error && <p className="text-sm text-red-500 bg-red-50 p-3 rounded">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4 p-6 rounded-2xl bg-slate-50/50 border border-slate-100">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Category</h3>
                {isEditing ? (
                  <Select
                    value={editedIssue.category}
                    onValueChange={(value) => setEditedIssue({ ...editedIssue, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-lg font-semibold text-slate-700">{issue.category}</p>
                )}
              </div>

              {issue.assigned_engineer && (
                <div className="space-y-4 p-6 rounded-2xl bg-blue-50/30 border border-blue-100">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-blue-400">Assigned Engineer</h3>
                  <p className="text-lg font-semibold text-blue-700">{issue.assigned_engineer}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Problem Description</h3>
              {isEditing ? (
                <Textarea
                  value={editedIssue.description}
                  onChange={(e) => setEditedIssue({ ...editedIssue, description: e.target.value })}
                  rows={6}
                  className="text-lg"
                />
              ) : (
                <div className="p-8 rounded-2xl bg-white border border-slate-100 text-slate-700 leading-relaxed text-lg shadow-inner">
                  {issue.description}
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                Created: {new Date(issue.created_at).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                Last Updated: {new Date(issue.updated_at).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
