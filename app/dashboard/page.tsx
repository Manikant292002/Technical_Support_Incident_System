import { createClient } from "@/lib/supabase/server"
import IssueList from "@/components/issue-list"
import IssueSubmitButton from "@/components/issue-submit-button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: issues } = await supabase.from("issues").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">My Support Tickets</h1>
          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Support Overview</h1>
            <p className="text-slate-600 mt-2 text-lg">Submit and track your recent support requests.</p>
          </div>
          <IssueSubmitButton />
        </div>
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <IssueList issues={issues || []} />
        </div>
      </main>
    </div>
  )
}
