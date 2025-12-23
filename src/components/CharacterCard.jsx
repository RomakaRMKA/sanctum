import './CharacterCard.css'

export default function CharacterCard({ character }) {
  return (
    <div className="character-box">
      <img className="character-image" src={character.image} alt={character.name} />
      <p className="character-name">{character.name}</p>
      <p className="character-title">{character.title}</p>
    </div>
  )
}
