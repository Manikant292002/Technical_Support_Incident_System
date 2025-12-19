"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

interface Comment {
  id: string
  comment: string
  created_at: string
  user_name: string
}

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

interface IssueDetailProps {
  issue: Issue
  comments: Comment[]
  isEngineer: boolean
}

const statusOptions = ["open", "in_progress", "resolved", "closed"]
const priorityOptions = ["low", "medium", "high"]

export default function IssueDetail({ issue, comments, isEngineer }: IssueDetailProps) {
  const [newComment, setNewComment] = useState("")
  const [commenterName, setCommenterName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(issue.status)
  const [priority, setPriority] = useState(issue.priority)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newComment.trim()) {
      setError("Comment cannot be empty")
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("issue_comments").insert({
        issue_id: issue.id,
        user_name: commenterName || (isEngineer ? "Support Engineer" : "User"),
        comment: newComment,
      })

      if (error) throw error

      setNewComment("")
      setCommenterName("")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus)
    try {
      const { error } = await supabase
        .from("issues")
        .update({
          status: newStatus,
          resolved_at: newStatus === "resolved" ? new Date().toISOString() : null,
        })
        .eq("id", issue.id)
      if (error) throw error
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status")
    }
  }

  const handlePriorityChange = async (newPriority: string) => {
    setPriority(newPriority)
    try {
      const { error } = await supabase.from("issues").update({ priority: newPriority }).eq("id", issue.id)
      if (error) throw error
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update priority")
    }
  }

  return (
    <div className="space-y-6">
      <Link href={isEngineer ? "/engineer" : "/dashboard"}>
        <Button variant="outline">Back</Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl">{issue.title}</CardTitle>
              <p className="text-gray-600 mt-2">{issue.category}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <Badge className="bg-blue-100 text-blue-800">{issue.status}</Badge>
              <Badge className="bg-red-100 text-red-800">{issue.priority}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
          </div>

          {isEngineer && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
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
                <label className="text-sm font-medium text-gray-700 block mb-2">Priority</label>
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
          )}

          <p className="text-sm text-gray-600 pt-4 border-t">
            Created {new Date(issue.created_at).toLocaleDateString()}
            {issue.resolved_at && <> • Resolved {new Date(issue.resolved_at).toLocaleDateString()}</>}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments ({comments.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAddComment} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commenter-name">Your Name</Label>
              <Input
                id="commenter-name"
                placeholder={isEngineer ? "Support Engineer" : "Your name"}
                value={commenterName}
                onChange={(e) => setCommenterName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment-text">Comment</Label>
              <Textarea
                id="comment-text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>

          <div className="space-y-4 pt-4 border-t">
            {comments.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-900">{comment.user_name}</p>
                    <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
