"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IssueFiltersProps {
  filter: "all" | "assigned" | "unassigned" | "resolved"
  onFilterChange: (filter: "all" | "assigned" | "unassigned" | "resolved") => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export default function IssueFilters({ filter, onFilterChange, searchTerm, onSearchChange }: IssueFiltersProps) {
  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-700 block mb-2">Search</label>
        <Input placeholder="Search issues..." value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} />
      </div>
      <div className="w-40">
        <label className="text-sm font-medium text-gray-700 block mb-2">Filter</label>
        <Select value={filter} onValueChange={(value: any) => onFilterChange(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Issues</SelectItem>
            <SelectItem value="assigned">My Assignments</SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
