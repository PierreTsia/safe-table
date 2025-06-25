'use client'

import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ChevronUpIcon, ChevronDownIcon, ChevronDownIcon as DropdownIcon, X } from 'lucide-react'

interface SearchControlsProps {
  totalCount: number
  pageSize: number
  sortBy: 'inspectionDate' | 'businessName' | 'evaluationCode'
  sortOrder: 'asc' | 'desc'
  businessType?: string
  onPageSizeChange: (size: number) => void
  onSortChange: (sort: 'inspectionDate' | 'businessName' | 'evaluationCode', order: 'asc' | 'desc') => void
  onBusinessTypeChange: (businessType: string | undefined) => void
}

function BusinessTypeFilter({
  currentBusinessType,
  onBusinessTypeChange
}: {
  currentBusinessType?: string
  onBusinessTypeChange: (businessType: string | undefined) => void
}) {
  const businessTypes = [
    'Restaurants',
    'Boulangerie-Pâtisserie',
    'Restauration collective',
    'Boucherie-Charcuterie',
    'Producteurs fermiers',
    'Libre service',
    'Transformation de lait ou produits laitiers',
    'Traiteur',
    'Rayon pain/viennoiserie/pâtisserie',
    'Alimentation générale'
  ]

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs"
          >
            {currentBusinessType || 'Tous les types'}
            <DropdownIcon className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-[200px]">
          <DropdownMenuItem
            onClick={() => onBusinessTypeChange(undefined)}
            className="cursor-pointer"
          >
            Tous les types
          </DropdownMenuItem>
          {businessTypes.map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => onBusinessTypeChange(type)}
              className="cursor-pointer"
            >
              {type}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {currentBusinessType && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => onBusinessTypeChange(undefined)}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

function PageSizeSelector({ 
  currentPageSize, 
  onPageSizeChange 
}: { 
  currentPageSize: number
  onPageSizeChange: (size: number) => void 
}) {
  const pageSizeOptions = [10, 20, 50]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
        >
          {currentPageSize} / page
          <DropdownIcon className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[120px]">
        {pageSizeOptions.map((size) => (
          <DropdownMenuItem
            key={size}
            onClick={() => onPageSizeChange(size)}
            className="cursor-pointer"
          >
            {size} / page
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SortSelector({
  currentSort,
  currentOrder,
  onSortChange
}: {
  currentSort: 'inspectionDate' | 'businessName' | 'evaluationCode'
  currentOrder: 'asc' | 'desc'
  onSortChange: (sort: 'inspectionDate' | 'businessName' | 'evaluationCode', order: 'asc' | 'desc') => void
}) {
  const sortOptions = [
    { value: 'inspectionDate', label: 'Date', desc: 'Plus récent d\'abord', asc: 'Plus ancien d\'abord' },
    { value: 'businessName', label: 'Nom', desc: 'Z → A', asc: 'A → Z' },
    { value: 'evaluationCode', label: 'Évaluation', desc: 'Pire → Meilleur', asc: 'Meilleur → Pire' }
  ] as const

  const currentOption = sortOptions.find(opt => opt.value === currentSort)
  const currentLabel = currentOrder === 'desc' ? currentOption?.desc : currentOption?.asc

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs"
        >
          {currentLabel}
          {currentOrder === 'desc' ? (
            <ChevronDownIcon className="ml-1 h-3 w-3" />
          ) : (
            <ChevronUpIcon className="ml-1 h-3 w-3" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {sortOptions.map((option) => (
          <div key={option.value}>
            <DropdownMenuItem
              onClick={() => onSortChange(option.value, 'desc')}
              className="cursor-pointer"
            >
              {option.desc}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onSortChange(option.value, 'asc')}
              className="cursor-pointer"
            >
              {option.asc}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function SearchControls({
  totalCount,
  pageSize,
  sortBy,
  sortOrder,
  businessType,
  onPageSizeChange,
  onSortChange,
  onBusinessTypeChange
}: SearchControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        {totalCount} résultat{totalCount > 1 ? 's' : ''} trouvé{totalCount > 1 ? 's' : ''}
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Type:</span>
          <BusinessTypeFilter 
            currentBusinessType={businessType}
            onBusinessTypeChange={onBusinessTypeChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Afficher:</span>
          <PageSizeSelector 
            currentPageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Trier par:</span>
          <SortSelector
            currentSort={sortBy}
            currentOrder={sortOrder}
            onSortChange={onSortChange}
          />
        </div>
      </div>
    </div>
  )
} 