"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Issue {
  id: string
  title: string
  status: string
  priority: string
  category: string
  created_at: string
  description?: string
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

interface IssueListProps {
  issues: Issue[]
}

export default function IssueList({ issues }: IssueListProps) {
  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600">No issues yet. Submit one to get started!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <Dialog key={issue.id}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{issue.title}</CardTitle>
                    <CardDescription className="mt-2">{issue.category}</CardDescription>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Badge className={statusColors[issue.status]}>{issue.status}</Badge>
                    <Badge className={priorityColors[issue.priority]}>{issue.priority}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Created {new Date(issue.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <DialogTitle className="text-xl">Incident Resolved</DialogTitle>
              <DialogDescription className="text-base pt-2">
                This issue has been processed. The support team has verified the resolution and finalized the ticket.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-slate-50 p-4 rounded-lg mt-4 border border-slate-100">
              <h4 className="font-semibold text-slate-900 mb-1">{issue.title}</h4>
              <p className="text-sm text-slate-600 line-clamp-2">{issue.description || "No description provided."}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {issue.status.replace("_", " ")}
                </Badge>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">ID: {issue.id.slice(0, 8)}</span>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={() => window.location.reload()} className="bg-slate-900 text-white hover:bg-slate-800">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}
