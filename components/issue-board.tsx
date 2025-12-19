"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import IssueCard from "./issue-card"
import IssueFilters from "./issue-filters"

interface Issue {
  id: string
  title: string
  status: string
  priority: string
  category: string
  submitter_name: string
  assigned_engineer: string | null
  created_at: string
  updated_at: string
}

interface IssueBoardProps {
  issues: Issue[]
}

export default function IssueBoard({ issues }: IssueBoardProps) {
  const [filter, setFilter] = useState<"all" | "assigned" | "unassigned" | "resolved">("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filter === "all" ||
      (filter === "assigned" && issue.assigned_engineer) ||
      (filter === "unassigned" && !issue.assigned_engineer) ||
      (filter === "resolved" && issue.status === "resolved")

    return matchesSearch && matchesFilter
  })

  const columns = {
    open: filteredIssues.filter((i) => i.status === "open"),
    in_progress: filteredIssues.filter((i) => i.status === "in_progress"),
    resolved: filteredIssues.filter((i) => i.status === "resolved"),
  }

  return (
    <div className="space-y-6">
      <IssueFilters filter={filter} onFilterChange={setFilter} searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Object.entries(columns).map(([status, statusIssues]) => (
          <Card key={status} className="bg-gray-100 p-4">
            <h3 className="font-semibold mb-4 capitalize text-gray-900">
              {status.replace("_", " ")} ({statusIssues.length})
            </h3>
            <div className="space-y-3">
              {statusIssues.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No issues</p>
              ) : (
                statusIssues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
