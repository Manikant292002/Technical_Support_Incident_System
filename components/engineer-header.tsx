"use client"

export default function EngineerHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Support Portal</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm text-gray-600">Support Engineer</span>
            <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">Generic Engineer</span>
          </div>
        </div>
      </div>
    </header>
  )
}
