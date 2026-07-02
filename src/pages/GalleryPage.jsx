import { useState, useEffect } from 'react'
import { useCharacterOrder, useAllCharacters } from '../hooks/useCharacter'
import CharacterCard from '../components/CharacterCard'
import CharacterDetailModal from '../components/CharacterDetailModal'

const UNAFFILIATED = 'Unaffiliated'

function groupByFaction(characters) {
  const factionOrder = []
  const buckets = new Map()

  for (const character of characters) {
    const faction = character.affiliations[0] || UNAFFILIATED
    if (!buckets.has(faction)) {
      buckets.set(faction, [])
      factionOrder.push(faction)
    }
    buckets.get(faction).push(character)
  }

  if (buckets.has(UNAFFILIATED)) {
    factionOrder.splice(factionOrder.indexOf(UNAFFILIATED), 1)
    factionOrder.push(UNAFFILIATED)
  }

  return factionOrder.map((name) => ({ name, characters: buckets.get(name) }))
}

export default function GalleryPage() {
  const { order, loading: orderLoading, error: orderError } = useCharacterOrder()
  const { characters, loading: charactersLoading, error: charactersError } = useAllCharacters(order)
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  useEffect(() => {
    if (selectedCharacter) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [selectedCharacter])

  const loading = orderLoading || charactersLoading
  const error = orderError || charactersError

  if (loading) return <div className="container mt-5"><p>Loading characters...</p></div>
  if (error) return <div className="container mt-5"><p className="text-danger">Error: {error}</p></div>

  const factions = groupByFaction(characters)

  return (
    <div>
      <h1 id="pagetitle">The Sanctum</h1>
      {factions.map((faction) => (
        <section key={faction.name} className="faction-section">
          <h2 className="faction-title">{faction.name}</h2>
          <div className="character-grid">
            {faction.characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                onClick={() => setSelectedCharacter(character)}
              />
            ))}
          </div>
        </section>
      ))}
      {selectedCharacter && (
        <CharacterDetailModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </div>
  )
}
