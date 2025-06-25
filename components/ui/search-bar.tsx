'use client'

import * as React from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface SearchBarProps extends React.HTMLAttributes<HTMLFormElement> {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBar({ 
  onSearch, 
  placeholder = "Rechercher un établissement ou une ville...", 
  className,
  ...props 
}: SearchBarProps) {
  const [query, setQuery] = React.useState("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn("flex w-full max-w-lg gap-2", className)}
      {...props}
    >
      <div className="relative flex-1">
        <Input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      </div>
      <Button type="submit" variant="default">
        Rechercher
      </Button>
    </form>
  )
} 