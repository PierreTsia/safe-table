'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { searchFormSchema, type SearchFormValues } from '@/lib/schemas'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter()
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      query: ''
    }
  })

  const onSubmit = form.handleSubmit((data) => {
    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(data.query)}`)
  })

  return (
    <div className={cn("w-full max-w-lg", className)}>
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex gap-2">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Recherchez par code postal, nom de ville ou d'établissement"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      form.clearErrors()
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            Rechercher
          </Button>
        </form>
      </Form>
    </div>
  )
} 