import { useCallback, useEffect, useState } from 'react'
import { getConfig } from '@/lib/supabase'
import type { WeddingConfig } from '@/types'

export function useConfig() {
  const [config, setConfig] = useState<WeddingConfig | null>(null)
  const refresh = useCallback(async () => setConfig(await getConfig()), [])
  useEffect(() => { void refresh() }, [refresh])
  return { config, setConfig, refresh }
}
