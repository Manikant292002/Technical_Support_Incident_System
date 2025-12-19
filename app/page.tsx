import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ticket, Wrench, ClipboardList, Mail, Linkedin } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full text-center space-y-12">
          {/* Hero Header */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Ticket className="w-4 h-4" />
              <span>Technical Support System</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Streamline Your
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Support Workflow
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Efficient ticket management system for users and support engineers. Submit issues, track progress, and
              resolve problems faster.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {/* User Card */}
            <Link href="/issues" className="block group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-200 hover:border-blue-300 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                    <ClipboardList className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Submit a Ticket</h3>
                    <p className="text-slate-600">
                      Report issues, request features, and track the status of your support tickets
                    </p>
                  </div>
                  <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">View All Tickets</Button>
                </div>
              </div>
            </Link>

            {/* Engineer Card */}
            <Link href="/engineer" className="block group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-200 hover:border-cyan-300 h-full">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-cyan-100 rounded-full group-hover:bg-cyan-200 transition-colors">
                    <Wrench className="w-8 h-8 text-cyan-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Engineer Dashboard</h3>
                    <p className="text-slate-600">
                      Manage tickets, update status, and communicate with users efficiently
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-cyan-600 text-cyan-600 hover:bg-cyan-50 bg-transparent"
                  >
                    Open Dashboard
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-200">
            <div className="text-center p-4">
              <p className="font-semibold text-slate-900 mb-1">Easy Submission</p>
              <p className="text-sm text-slate-600">Quick ticket creation with AI-powered categorization</p>
            </div>
            <div className="text-center p-4">
              <p className="font-semibold text-slate-900 mb-1">Real-Time Tracking</p>
              <p className="text-sm text-slate-600">Monitor ticket status and progress updates</p>
            </div>
            <div className="text-center p-4">
              <p className="font-semibold text-slate-900 mb-1">Issue Management</p>
              <p className="text-sm text-slate-600">Centralized list for efficient resolution</p>
            </div>
          </div>

          {/* Contact Support footer to landing page */}
          <div className="mt-12 pt-8 border-t border-slate-200 text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Need further information?</h3>
            <div className="flex justify-center gap-8">
              <a
                href="mailto:manikanthooli20@gmail.com"
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                <Mail className="w-5 h-5" />
                <span>manikanthooli20@gmail.com</span>
              </a>
              <a
                href="https://www.linkedin.com/in/manikanthooli"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
