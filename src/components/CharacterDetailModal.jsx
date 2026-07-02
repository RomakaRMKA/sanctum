import { useEffect, useState } from 'react'
import './CharacterDetailModal.css'

export default function CharacterDetailModal({ character, onClose }) {
  const [activeImage, setActiveImage] = useState(character?.gallery?.[0] || character?.image)

  useEffect(() => {
    if (!character) return
    setActiveImage(character.gallery?.[0] || character.image)
  }, [character])

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  if (!character) return null

  const gallery = Array.isArray(character.gallery) && character.gallery.length > 0
    ? character.gallery
    : [character.image]

  const handleMainImageError = (e) => {
    const fallback = character.fallbackImage || '/placeholder.jpg'
    if (e.currentTarget.src !== fallback) {
      e.currentTarget.src = fallback
    }
  }

  const handleThumbError = (e) => {
    const fallback = character.fallbackImage || '/placeholder.jpg'
    if (e.currentTarget.src !== fallback) {
      e.currentTarget.src = fallback
    }
  }

  return (
    <div className="character-modal-overlay" onClick={onClose} role="presentation">
      <div className="character-modal" role="dialog" aria-modal="true" aria-label={`${character.name} details`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="character-modal-close" onClick={onClose} aria-label="Close details panel">
          x
        </button>

        <div className="character-modal-top">
          <div className="character-modal-image-wrap">
            <img
              src={activeImage}
              alt={`${character.name} portrait`}
              className="character-modal-main-image"
              onError={handleMainImageError}
            />

            <div className="character-modal-thumbs">
              {gallery.map((img, index) => (
                <button
                  type="button"
                  key={`${character.id}-gallery-${index}`}
                  className={`character-modal-thumb-button ${activeImage === img ? 'active' : ''}`}
                  onClick={() => setActiveImage(img)}
                  aria-label={`Show image ${index + 1} for ${character.name}`}
                >
                  <img
                    src={img}
                    alt={`${character.name} thumbnail ${index + 1}`}
                    className="character-modal-thumb"
                    onError={handleThumbError}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="character-modal-info">
            <h2 className="character-modal-name">{character.name}</h2>
            <p className="character-modal-title">{character.title}</p>

            <div className="character-modal-meta">
              <p><strong>Age:</strong> {character.age}</p>
              <p><strong>Affiliations:</strong> {character.affiliations.length > 0 ? character.affiliations.join(', ') : 'Unaffiliated'}</p>
            </div>

            <section className="character-modal-bio">
              <h3>Bio</h3>
              <p>{character.bio}</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
