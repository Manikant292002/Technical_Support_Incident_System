import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface IssueDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function IssueDetailPage({ params }: IssueDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // <CHANGE> Removed auth check and user_id filtering
  const { data: issue } = await supabase.from("issues").select("*").eq("id", id).single()

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
      {/* <CHANGE> Simplified header without auth */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Ticket Details</h1>
          <Link href="/issues">
            <Button variant="outline">Back to Tickets</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{issue.title}</CardTitle>
                <p className="text-sm text-gray-600">
                  Submitted by: {issue.submitter_name || "Anonymous User"}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Badge className={statusColors[issue.status] || statusColors.open}>
                  {issue.status.replace("_", " ")}
                </Badge>
                <Badge className={priorityColors[issue.priority] || priorityColors.medium}>{issue.priority}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Category</h3>
              <p className="text-gray-700">{issue.category}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
            </div>

            {issue.assigned_engineer && (
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">Assigned Engineer</h3>
                <p className="text-gray-700">{issue.assigned_engineer}</p>
              </div>
            )}

            <div className="pt-4 border-t text-sm text-gray-600 space-y-1">
              <p>Created: {new Date(issue.created_at).toLocaleString()}</p>
              <p>Last Updated: {new Date(issue.updated_at).toLocaleString()}</p>
              {issue.resolved_at && <p>Resolved: {new Date(issue.resolved_at).toLocaleString()}</p>}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
