import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '@/styles/invitation.css'
import { useConfig } from '@/hooks/useConfig'
import { useReveal } from '@/hooks/useReveal'
import { getPublicGuest } from '@/lib/supabase'
import type { PublicGuest } from '@/types'
import Loading from '@/components/ui/Loading'
import Envelope from '@/components/invitation/Envelope'
import MusicPlayer from '@/components/invitation/MusicPlayer'
import Hero from '@/components/invitation/Hero'
import Countdown from '@/components/invitation/Countdown'
import Parents from '@/components/invitation/Parents'
import Details from '@/components/invitation/Details'
import DressCode from '@/components/invitation/DressCode'
import Gallery from '@/components/invitation/Gallery'
import Rsvp from '@/components/invitation/Rsvp'
import Gifts from '@/components/invitation/Gifts'
import Farewell from '@/components/invitation/Farewell'

export default function InvitationPage() {
  const { slug } = useParams<{ slug?: string }>()
  const { config } = useConfig()
  const [guest, setGuest] = useState<PublicGuest | null | undefined>(slug ? undefined : null)
  const [coverReady, setCoverReady] = useState(false)
  const [phase, setPhase] = useState<'closed' | 'opening' | 'open'>('closed')

  useEffect(() => {
    if (!slug) return
    void getPublicGuest(slug).then(setGuest)
  }, [slug])

  useEffect(() => {
    if (!config) return
    document.title = `${config.groom_name} & ${config.bride_name} · Nuestra boda`
    if (!config.cover_photo_url) { setCoverReady(true); return }
    const img = new Image()
    img.onload = img.onerror = () => setCoverReady(true)
    img.src = config.cover_photo_url
  }, [config])

  useReveal(phase !== 'closed')

  if (!config || guest === undefined || !coverReady) return <Loading />

  const open = () => {
    setPhase('opening')
    window.scrollTo(0, 0)
    setTimeout(() => setPhase('open'), 3100)
  }

  return (
    <div className={`invitation ${phase === 'closed' ? 'is-locked' : ''}`}>
      <MusicPlayer src={config.music_url} start={phase !== 'closed'} />
      {phase !== 'open' && (
        <Envelope
          bride={config.bride_name}
          groom={config.groom_name}
          date={config.wedding_date}
          guestName={guest?.name}
          opening={phase === 'opening'}
          onOpen={open}
        />
      )}
      <Hero config={config} />
      {config.wedding_date && <Countdown date={config.wedding_date} />}
      <Parents config={config} />
      <Details config={config} />
      <DressCode config={config} />
      <Gallery photos={config.gallery_urls ?? []} />
      <Rsvp config={config} guest={guest} slug={slug} />
      <Gifts config={config} />
      <Farewell config={config} />
    </div>
  )
}
