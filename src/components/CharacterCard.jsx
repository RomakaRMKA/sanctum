import './CharacterCard.css'

export default function CharacterCard({ character, onClick }) {
  const handleImageError = (e) => {
    const fallback = character.fallbackImage || '/placeholder.jpg'
    if (e.currentTarget.src !== fallback) {
      e.currentTarget.src = fallback
    }
  }

  return (
    <button type="button" className="character-box" onClick={onClick}>
      <img
        className="character-image"
        src={character.image}
        alt={character.name}
        onError={handleImageError}
      />
      <p className="character-name">{character.name}</p>
      <p className="character-title">{character.title}</p>
    </button>
  )
}
