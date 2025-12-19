"use client"

export default function UserHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Support System</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">User</span>
        </div>
      </div>
    </header>
  )
}
