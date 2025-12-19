"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Issue {
  id: string
  title: string
  status: string
  priority: string
  category: string
  submitter_name?: string
}

interface IssueCardProps {
  issue: Issue
}

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-red-100 text-red-800",
}

export default function IssueCard({ issue }: IssueCardProps) {
  return (
    <Link href={`/engineer/issues/${issue.id}`}>
      <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer bg-white">
        <h4 className="font-semibold text-sm line-clamp-2 text-gray-900">{issue.title}</h4>
        <p className="text-xs text-gray-600 mt-1">{issue.submitter_name || "Anonymous User"}</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge className={priorityColors[issue.priority]} variant="outline">
            {issue.priority}
          </Badge>
          <Badge variant="outline" className="text-xs bg-gray-50">
            {issue.category}
          </Badge>
        </div>
      </Card>
    </Link>
  )
}
