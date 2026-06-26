import { useState, useEffect } from 'react'

function withBase(path) {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const normalizedPath = path.replace(/^\/+/, '')
  return `${normalizedBase}${normalizedPath}`
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

export function useCharacterData(dir) {
  const [character, setCharacter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        let data = null
        try {
          const res = await fetch(withBase(`characters/${dir}/data.json`))
          if (res.ok) {
            data = await res.json()
          }
        } catch (e) {
          data = null
        }

        const configuredImage = (data?.image || 'assets/portrait.jpg').replace(/^\/+/, '')
        const imageUrl = withBase(`characters/${dir}/${configuredImage}`)

        setCharacter({
          id: data?.id || dir,
          name: data?.name || dir,
          title: data?.title || 'Missing Data',
          image: imageUrl,
          fallbackImage: withBase('placeholder.jpg'),
          race: data?.race || '',
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (dir) fetchData()
  }, [dir])

  return { character, loading, error }
}
