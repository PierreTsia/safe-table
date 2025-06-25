'use client'

import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'
import Link from 'next/link'

interface SearchLayoutProps {
  children: React.ReactNode
}

export default function SearchLayout({ children }: SearchLayoutProps) {
  return (
    <main className="container mx-auto p-8">
      <div className="mb-8">
        {/* Back button and breadcrumb navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">
                    <Home className="w-4 h-4" />
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Recherche</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {children}
    </main>
  )
} 