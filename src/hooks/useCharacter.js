import { useState, useEffect } from 'react'

export function useCharacterOrder() {
  const [order, setOrder] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch('/characters/order.json')
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
          const res = await fetch(`/characters/${dir}/data.json`)
          if (res.ok) {
            data = await res.json()
          }
        } catch (e) {
          data = null
        }

        // Try jpg first, then png
        let imageUrl = `/characters/${dir}/assets/portrait.jpg`
        let imgRes = await fetch(imageUrl)
        const size = parseInt(imgRes.headers.get('content-length') || '0', 10)
        
        // Check status and reasonable file size (real images should be > 10KB)
        if (!imgRes.ok || size < 10000) {
          imageUrl = `/characters/${dir}/assets/portrait.png`
          imgRes = await fetch(imageUrl)
          const pngSize = parseInt(imgRes.headers.get('content-length') || '0', 10)
          
          if (!imgRes.ok || pngSize < 10000) {
            imageUrl = '/placeholder.jpg'
          }
        }

        setCharacter({
          id: data?.id || dir,
          name: data?.name || dir,
          title: data?.title || 'Missing Data',
          image: imageUrl,
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
