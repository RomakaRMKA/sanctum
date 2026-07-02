import { useState, useEffect } from 'react'

function withBase(path) {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBase}${normalizedPath}`
}

function normalizeCharacter(dir, data) {
  const configuredImage = (data?.image || 'assets/portrait.jpg').replace(/^\/+/, '')
  const imageUrl = withBase(`characters/${dir}/${configuredImage}`)
  const fallbackImage = withBase('placeholder.jpg')
  const configuredGallery = Array.isArray(data?.gallery)
    ? data.gallery
    : [configuredImage]
  const normalizedGallery = configuredGallery
    .map((entry) => String(entry || '').replace(/^\/+/, ''))
    .filter(Boolean)

  const gallery = normalizedGallery.length > 0
    ? normalizedGallery.map((entry) => withBase(`characters/${dir}/${entry}`))
    : [imageUrl]

  return {
    id: data?.id || dir,
    name: data?.name || dir,
    title: data?.title || 'Missing Data',
    image: imageUrl,
    fallbackImage,
    race: data?.race || '',
    age: data?.age || 'Unknown',
    affiliations: Array.isArray(data?.affiliations) ? data.affiliations : [],
    bio: data?.bio || 'No biography available yet.',
    gallery,
  }
}

export function useCharacterOrder() {
  const [order, setOrder] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(withBase('characters/order.json'))
        if (!res.ok) throw new Error('Failed to fetch character order')
        const data = await res.json()
        setOrder(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [])

  return { order, loading, error }
}

export function useAllCharacters(order) {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (order.length === 0) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchAll() {
      try {
        const results = await Promise.all(order.map(async (dir) => {
          let data = null
          try {
            const res = await fetch(withBase(`characters/${dir}/data.json`))
            if (res.ok) data = await res.json()
          } catch (e) {
            data = null
          }
          return normalizeCharacter(dir, data)
        }))
        if (!cancelled) setCharacters(results)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAll()

    return () => {
      cancelled = true
    }
  }, [order])

  return { characters, loading, error }
}
