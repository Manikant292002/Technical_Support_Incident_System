"use client"

import type React from "react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const CATEGORIES = ["Technical Issue", "Billing", "Account", "Feature Request", "General Inquiry"]
const PRIORITIES = ["low", "medium", "high"]

interface IssueSubmitDialogProps {
  isOpen: boolean
  onClose: () => void
}

export default function IssueSubmitDialog({ isOpen, onClose }: IssueSubmitDialogProps) {
  const [submitterName, setSubmitterName] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("medium")
  const [isLoading, setIsLoading] = useState(false)
  const [isCategorizing, setIsCategorizing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAutoFill = async () => {
    if (!title || !description) {
      setError("Please fill in title and description first")
      return
    }

    setIsCategorizing(true)
    setError(null)

    try {
      const response = await fetch("/api/categorize-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) throw new Error("Failed to categorize")

      const data = await response.json()
      setCategory(data.category || "General Inquiry")
      setPriority(data.priority || "medium")
    } catch (err) {
      setError("Could not auto-suggest category. Please select manually.")
    } finally {
      setIsCategorizing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title || !description || !category) {
      setError("Please fill in all required fields")
      return
    }

    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.from("issues").insert({
        submitter_name: submitterName || "User",
        title,
        description,
        category,
        priority,
        status: "open",
      })

      if (error) throw error

      setSubmitterName("")
      setTitle("")
      setDescription("")
      setCategory("")
      setPriority("medium")
      onClose()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit New Ticket</DialogTitle>
          <DialogDescription>Describe your issue and we'll help you resolve it</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name (optional)</Label>
            <Input
              id="name"
              placeholder="Your name or contact name"
              value={submitterName}
              onChange={(e) => setSubmitterName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Detailed explanation of your issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
            />
          </div>

          {!category && (
            <button
              type="button"
              onClick={handleAutoFill}
              disabled={isCategorizing || !title || !description}
              className="w-full px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCategorizing ? "Analyzing..." : "✨ Auto-categorize"}
            </button>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
