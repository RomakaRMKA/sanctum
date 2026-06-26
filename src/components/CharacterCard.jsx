import './CharacterCard.css'

export default function CharacterCard({ character }) {
  const handleImageError = (e) => {
    const fallback = character.fallbackImage || '/placeholder.jpg'
    if (e.currentTarget.src !== fallback) {
      e.currentTarget.src = fallback
    }
  }

  return (
    <div className="character-box">
      <img
        className="character-image"
        src={character.image}
        alt={character.name}
        onError={handleImageError}
      />
      <p className="character-name">{character.name}</p>
      <p className="character-title">{character.title}</p>
    </div>
  )
}
