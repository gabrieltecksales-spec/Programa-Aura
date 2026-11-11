import { useState } from 'react'
import './AnimeSideCharacters.css'

type Character = {
  id: string
  name: string
  role: string
  symbol: string
  file: string
}

const characters: Character[] = [
  {
    id: 'deku',
    name: 'DEKU',
    role: 'DETERMINAÇÃO',
    symbol: '⚡',
    file: '/characters/deku.png',
  },
  {
    id: 'saitama',
    name: 'SAITAMA',
    role: 'FORÇA ABSOLUTA',
    symbol: '👊',
    file: '/characters/saitama.png',
  },
  {
    id: 'asta',
    name: 'ASTA',
    role: 'ESPÍRITO DE LUTA',
    symbol: '⚔',
    file: '/characters/asta.png',
  },
  {
    id: 'lelouch',
    name: 'LELOUCH',
    role: 'ESTRATÉGIA',
    symbol: '♟',
    file: '/characters/lelouch.png',
  },
]

export default function AnimeSideCharacters() {
  const [imageStatus, setImageStatus] = useState<Record<string, 'loaded' | 'missing'>>({})

  function markLoaded(id: string) {
    setImageStatus((current) => ({ ...current, [id]: 'loaded' }))
  }

  function markMissing(id: string) {
    setImageStatus((current) => ({ ...current, [id]: 'missing' }))
  }

  return (
    <div className="anime-side-decorations" aria-hidden="true">
      {characters.map((character) => {
        const status = imageStatus[character.id]

        return (
          <div className={`anime-float anime-float--${character.id}`} key={character.id}>
            <div className="anime-float-aura" />

            <div className="anime-float-portrait">
              {status !== 'loaded' && (
                <div className="anime-fallback-mark">{character.symbol}</div>
              )}

              {status !== 'missing' && (
                <img
                  src={character.file}
                  alt=""
                  onLoad={() => markLoaded(character.id)}
                  onError={() => markMissing(character.id)}
                />
              )}
            </div>

            <span className="anime-float-name">{character.name}</span>
            <span className="anime-float-role">{character.role}</span>
          </div>
        )
      })}
    </div>
  )
}
