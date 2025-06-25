'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">
        Recherche invalide
      </h2>
      <p className="text-muted-foreground mb-8">
        Veuillez saisir un terme de recherche valide.
      </p>
      <Button asChild>
        <Link href="/">
          Retour à l&apos;accueil
        </Link>
      </Button>
    </div>
  )
} 