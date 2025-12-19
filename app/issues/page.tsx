import { createClient } from "@/lib/supabase/server"
import IssueList from "@/components/issue-list"
import IssueSubmitButton from "@/components/issue-submit-button"
import { Search, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default async function IssuesPage() {
  const supabase = await createClient()
  const { data: issues } = await supabase.from("issues").select("*").order("created_at", { ascending: false })

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
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back Home
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900">Active Incidents</h2>
            <p className="text-slate-600 text-lg">Track and manage your technical support requests.</p>
          </div>
          <IssueSubmitButton />
        </div>

        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <IssueList issues={issues || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
