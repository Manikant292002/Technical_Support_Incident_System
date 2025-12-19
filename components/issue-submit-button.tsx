"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import IssueSubmitDialog from "./issue-submit-dialog"

export default function IssueSubmitButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Submit New Issue</Button>
      <IssueSubmitDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
