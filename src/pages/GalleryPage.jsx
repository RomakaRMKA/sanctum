import { useCharacterOrder, useCharacterData } from '../hooks/useCharacter'
import CharacterCard from '../components/CharacterCard'

export default function GalleryPage() {
  const { order, loading, error } = useCharacterOrder()

  if (loading) return <div className="container mt-5"><p>Loading characters...</p></div>
  if (error) return <div className="container mt-5"><p className="text-danger">Error: {error}</p></div>

  return (
    <div>
      <h1 id="pagetitle">The Sanctum</h1>
      <div id="charagrid" className="character-grid">
        {order.map(dir => (
          <CharacterCardWrapper key={dir} dir={dir} />
        ))}
      </div>
    </div>
  )
}

function CharacterCardWrapper({ dir }) {
  const { character, loading } = useCharacterData(dir)

  if (loading) return <div className="character-box">Loading...</div>
  if (!character) return null

  return <CharacterCard character={character} />
}
