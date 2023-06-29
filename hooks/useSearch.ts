import { useMemo, useState } from 'react'

import Fuse from 'fuse.js'

interface UseSearchProps<T> {
  dataSet: T[]
  keys: string[]
}

export default function useSearch<T>({ dataSet, keys }: UseSearchProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')

  const fuse = useMemo(() => {
    const options = {
      includeScore: true,
      keys,
      threshold: 0.4,
    }

    return new Fuse(dataSet, options)
  }, [dataSet, keys])

  const results = useMemo(() => {
    if (!searchQuery) return []

    const searchResults = fuse.search(searchQuery, { limit: 10 })

    return searchResults.map((sr) => sr.item)
  }, [fuse, searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    results,
  }
}
