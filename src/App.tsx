
import { useEffect, useState } from 'react'
import './App.css'

type Category = 'Principal' | 'Diária' | 'Instantânea' | 'Chefão' | 'Agendada'
type Filter = 'Ativas' | 'Diárias' | 'Principais' | 'Instantâneas' | 'Chefão' | 'Agendadas' | 'Concluídas'

type Quest = {
  id: number
  title: string
  description: string
  lesson: string
  category: Category
  reward: number
  rank: string
  icon: string
  completed: boolean
}

const initialQuests: Quest[] = [
  {
    id: 1,
    title: 'A primeira árvore',
    description: 'Aprenda a reconhecer raiz, nós, folhas, caminhos e altura.',
    lesson: 'AULA 01 · ÁRVORES',
    category: 'Principal',
    reward: 25,
    rank: 'E-RANK',
    icon: '🌳',
    completed: false,
  },
  {
    id: 2,
    title: 'Vocabulário da floresta',
    description: 'Revise os conceitos fundamentais da estrutura de uma árvore.',
    lesson: 'REVISÃO · AULA 01',
    category: 'Diária',
    reward: 15,
    rank: 'E-RANK',
    icon: '📘',
    completed: false,
  },
  {
    id: 3,
    title: 'O guardião das raízes',
    description: 'Desafio especial sobre raiz, nós internos e folhas.',
    lesson: 'CHEFÃO · AULA 01',
    category: 'Chefão',
    reward: 50,
    rank: 'D-RANK',
    icon: '👾',
    completed: false,
  },
]

const filters: { label: Filter; icon: string }[] = [
  { label: 'Ativas', icon: '●' },
  { label: 'Diárias', icon: '◷' },
  { label: 'Principais', icon: '✦' },
  { label: 'Instantâneas', icon: 'ϟ' },
  { label: 'Chefão', icon: '♛' },
  { label: 'Agendadas', icon: '▣' },
  { label: 'Concluídas', icon: '✓' },
]

const menuItems = [
  { label: 'Missões', icon: '⚔' },
  { label: 'Foco', icon: '◉' },
  { label: 'Habilidades', icon: '✧' },
  { label: 'Calendário', icon: '▦' },
  { label: 'Loja', icon: '◈' },
  { label: 'Atributos', icon: '⌬' },
  { label: 'Histórico', icon: '◷' },
  { label: 'Conquistas', icon: '♛' },
  { label: 'Configurações', icon: '⚙' },
]

const attributes = [
  { short: 'LOG', name: 'Lógica', value: 1, color: 'blue' },
  { short: 'MEM', name: 'Memória', value: 1, color: 'cyan' },
  { short: 'FOC', name: 'Foco', value: 1, color: 'green' },
  { short: 'DIS', name: 'Disciplina', value: 1, color: 'orange' },
  { short: 'CON', name: 'Consistência', value: 1, color: 'purple' },
]

function App() {
  const [activeMenu, setActiveMenu] = useState('Missões')
  const [activeFilter, setActiveFilter] = useState<Filter>('Ativas')

  const [quests, setQuests] = useState<Quest[]>(() => {
    try {
      const saved = localStorage.getItem('aura-quests')
      return saved ? (JSON.parse(saved) as Quest[]) : initialQuests
    } catch {
      return initialQuests
    }
  })

  const [totalXp, setTotalXp] = useState(() => {
    const saved = localStorage.getItem('aura-xp')
    return saved ? Number(saved) || 0 : 0
  })

  const [showModal, setShowModal] = useState(false)
  const [newQuestTitle, setNewQuestTitle] = useState('')
  const [newQuestDescription, setNewQuestDescription] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem('aura-quests', JSON.stringify(quests))
  }, [quests])

  useEffect(() => {
    localStorage.setItem('aura-xp', String(totalXp))
  }, [totalXp])

  const level = Math.floor(totalXp / 100) + 1
  const xpInLevel = totalXp % 100
  const activeCount = quests.filter((quest) => !quest.completed).length
  const completedCount = quests.filter((quest) => quest.completed).length

  const filteredQuests = quests.filter((quest) => {
    if (activeFilter === 'Ativas') return !quest.completed
    if (activeFilter === 'Concluídas') return quest.completed
    if (activeFilter === 'Diárias') return quest.category === 'Diária' && !quest.completed
    if (activeFilter === 'Principais') return quest.category === 'Principal' && !quest.completed
    if (activeFilter === 'Instantâneas') return quest.category === 'Instantânea' && !quest.completed
    if (activeFilter === 'Chefão') return quest.category === 'Chefão' && !quest.completed
    if (activeFilter === 'Agendadas') return quest.category === 'Agendada' && !quest.completed
    return true
  })

  function showMessage(message: string) {
    setToast(message)
  }

  function completeQuest(quest: Quest) {
    if (quest.completed) return

    setQuests((current) =>
      current.map((item) =>
        item.id === quest.id ? { ...item, completed: true } : item,
      ),
    )

    setTotalXp((current) => current + quest.reward)
    showMessage(`+${quest.reward} XP · Missão concluída!`)
  }

  function createQuest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const title = newQuestTitle.trim()
    if (!title) return

    const newQuest: Quest = {
      id: Date.now(),
      title,
      description: newQuestDescription.trim() || 'Uma nova missão da sua jornada.',
      lesson: 'MISSÃO PERSONALIZADA',
      category: 'Instantânea',
      reward: 10,
      rank: 'E-RANK',
      icon: '✦',
      completed: false,
    }

    setQuests((current) => [...current, newQuest])
    setNewQuestTitle('')
    setNewQuestDescription('')
    setShowModal(false)
    setActiveFilter('Ativas')
    showMessage('Nova missão adicionada ao quadro!')
  }

  const pageDescriptions: Record<string, string> = {
    Foco: 'Organize sessões de estudo e mantenha sua concentração.',
    Habilidades: 'Acompanhe as habilidades que desenvolve ao estudar.',
    Calendário: 'Visualize seus compromissos e sua rotina de estudos.',
    Loja: 'Futuramente, troque suas recompensas por itens e personalizações.',
    Atributos: 'Observe sua evolução em cada atributo de aprendizagem.',
    Histórico: 'Consulte suas missões e atividades anteriores.',
    Conquistas: 'Suas medalhas e títulos serão registrados aqui.',
    Configurações: 'Personalize sua experiência no Programa Aura.',
  }

  return (
    <div className="aura-app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">✧</div>
          <div className="brand-name">
            <strong>AURA</strong>
            <span>STUDY SYSTEM</span>
          </div>
          <span className="sidebar-collapse">«</span>
        </div>

        <div className="user-mini-profile">
          <div className="user-avatar">A</div>
          <div>
            <strong>Aventureiro</strong>
            <span>Aprendiz da Aura</span>
          </div>
        </div>

        <div className="sidebar-label">MENU PRINCIPAL</div>

        <nav className="side-navigation">
          {menuItems.map((item) => (
            <button
              key={item.label}
              className={`side-link ${activeMenu === item.label ? 'selected' : ''}`}
              onClick={() => setActiveMenu(item.label)}
            >
              <span className="side-link-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Conquistas' && <span className="menu-count">0</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-world">
          <span className="sidebar-label">MUNDO ATUAL</span>
          <div className="sidebar-world-icon">🌳</div>
          <strong>Estrutura de Dados</strong>
          <span>9 AULAS MAPEADAS</span>
          <button onClick={() => setActiveMenu('Missões')}>Acessar mundo →</button>
        </div>

        <div className="sidebar-profile-bottom">
          <div className="bottom-avatar">A</div>
          <div className="bottom-profile-text">
            <strong>Aventureiro</strong>
            <span>Nível {String(level).padStart(2, '0')}</span>
          </div>
          <span className="bottom-menu">•••</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="mobile-header">
          <div className="mobile-brand">✧ AURA</div>
          <span>SISTEMA DE ESTUDOS</span>
        </header>

        <section className="status-panel">
          <div className="panel-kicker">
            <span className="blue-dot" />
            STATUS DO SISTEMA
          </div>

          <div className="status-main">
            <div className="character-info">
              <div className="character-avatar">
                <span>✧</span>
              </div>

              <div className="character-details">
                <div className="character-name-line">
                  <span className="small-label">NOME:</span>
                  <h1>Aventureiro</h1>
                </div>
                <div className="character-class">
                  <span className="small-label">CLASSE:</span>
                  <strong>Aprendiz da Aura</strong>
                </div>

                <div className="character-resources">
                  <div className="resource">
                    <span className="resource-symbol streak-symbol">🔥</span>
                    <strong>0</strong>
                    <span className="resource-caption">DIAS DE SEQUÊNCIA</span>
                  </div>
                  <div className="resource">
                    <span className="resource-symbol coin-symbol">✦</span>
                    <strong>0</strong>
                    <span className="resource-caption">FRAGMENTOS AURA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="level-info">
              <span className="small-label">LEVEL</span>
              <strong>{String(level).padStart(2, '0')}</strong>
              <span className="level-xp">{xpInLevel} / 100 XP</span>
              <span className="daily-goal">META DIÁRIA: <b>30 MIN</b></span>
            </div>
          </div>

          <div className="experience-track">
            <div className="experience-fill" style={{ width: `${xpInLevel}%` }} />
            <span>{xpInLevel}%</span>
          </div>
        </section>

        <div className="content-toolbar">
          <div className="toolbar-title">
            <span className="blue-dot" />
            <span>ÁREA DE EVOLUÇÃO</span>
          </div>

          <div className="toolbar-actions">
            <button
              className="secondary-action"
              onClick={() => showMessage('O assistente de estudos será desenvolvido em uma próxima etapa.')}
            >
              ✧ <span>ASSISTENTE AURA</span>
            </button>
            <button className="create-action" onClick={() => setShowModal(true)}>
              + <span>CRIAR MISSÃO</span>
            </button>
          </div>
        </div>

        {activeMenu === 'Missões' ? (
          <div className="dashboard-grid">
            <section className="attributes-panel glass-panel">
              <div className="panel-title-row">
                <div>
                  <span className="panel-kicker">SEU DESENVOLVIMENTO</span>
                  <h2>ATRIBUTOS</h2>
                </div>
                <span className="attribute-points">✦ +0</span>
              </div>

              <div className="attributes-list">
                {attributes.map((attribute) => (
                  <div className="attribute-item" key={attribute.short}>
                    <div className={`attribute-icon ${attribute.color}`}>
                      {attribute.short.slice(0, 1)}
                    </div>
                    <div className="attribute-data">
                      <div className="attribute-label-row">
                        <div>
                          <span>{attribute.short}</span>
                          <strong>{attribute.name}</strong>
                        </div>
                        <b>{attribute.value}</b>
                      </div>
                      <div className="attribute-track">
                        <div className={`attribute-fill ${attribute.color}`} style={{ width: '3%' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="attribute-note">
                <span>✧</span>
                Seus atributos evoluirão conforme você dominar novos conteúdos.
              </div>
            </section>

            <section className="quests-panel glass-panel">
              <div className="quests-heading">
                <div className="quests-title">
                  <span className="blue-dot" />
                  <h2>MISSÕES</h2>
                </div>

                <div className="quest-counters">
                  <span><i className="counter-blue" /> Ativas: <b>{activeCount}</b></span>
                  <span><i className="counter-green" /> Concluídas: <b>{completedCount}</b></span>
                </div>
              </div>

              <div className="quest-filters">
                {filters.map((filter) => (
                  <button
                    key={filter.label}
                    className={`filter-button ${activeFilter === filter.label ? 'active' : ''}`}
                    onClick={() => setActiveFilter(filter.label)}
                  >
                    <span>{filter.icon}</span>
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="quest-list">
                {filteredQuests.length > 0 ? (
                  filteredQuests.map((quest) => (
                    <article
                      className={`quest-card ${quest.completed ? 'completed' : ''}`}
                      key={quest.id}
                    >
                      <div className="quest-icon">{quest.icon}</div>

                      <div className="quest-information">
                        <h3>{quest.title}</h3>
                        <span className="quest-lesson">{quest.lesson}</span>
                        <p>{quest.description}</p>
                      </div>

                      <div className="quest-reward">
                        <span className={`rank ${quest.rank === 'D-RANK' ? 'rank-d' : ''}`}>
                          ✦ {quest.rank}
                        </span>
                        <span className="quest-stars">★★★</span>
                        <span className="reward-xp">✧ +{quest.reward} XP</span>
                      </div>

                      {!quest.completed && (
                        <button
                          className="complete-button"
                          onClick={() => completeQuest(quest)}
                        >
                          CONCLUIR
                        </button>
                      )}

                      {quest.completed && (
                        <span className="completed-label">✓ CONCLUÍDA</span>
                      )}
                    </article>
                  ))
                ) : (
                  <div className="empty-quests">
                    <span>✧</span>
                    <strong>Nenhuma missão nesta categoria</strong>
                    <p>Novas missões aparecerão aqui durante sua jornada.</p>
                  </div>
                )}
              </div>

              <div className="quest-footer">
                <span>PROGRAMA AURA</span>
                <span>UMA CONQUISTA POR VEZ ✧</span>
              </div>
            </section>
          </div>
        ) : (
          <section className="placeholder-panel glass-panel">
            <span className="placeholder-icon">✧</span>
            <span className="panel-kicker">SISTEMA AURA</span>
            <h2>{activeMenu}</h2>
            <p>{pageDescriptions[activeMenu] ?? 'Esta área fará parte da sua jornada de aprendizado.'}</p>
            <button className="create-action" onClick={() => setActiveMenu('Missões')}>
              VOLTAR PARA MISSÕES →
            </button>
          </section>
        )}

        <footer className="main-footer">
          <span>✧ PROGRAMA AURA · SISTEMA DE EVOLUÇÃO</span>
          <span>SEU CONHECIMENTO É SUA MAIOR FORÇA.</span>
        </footer>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <form
            className="mission-modal"
            onSubmit={createQuest}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <span className="panel-kicker">SISTEMA DE MISSÕES</span>
            <h2>Criar nova missão</h2>
            <p>Adicione um objetivo pessoal à sua jornada de aprendizado.</p>

            <label htmlFor="quest-title">NOME DA MISSÃO</label>
            <input
              id="quest-title"
              value={newQuestTitle}
              onChange={(event) => setNewQuestTitle(event.target.value)}
              placeholder="Ex.: Estudar por 30 minutos"
              required
            />

            <label htmlFor="quest-description">DESCRIÇÃO</label>
            <textarea
              id="quest-description"
              value={newQuestDescription}
              onChange={(event) => setNewQuestDescription(event.target.value)}
              placeholder="Descreva o que você deseja realizar..."
              rows={3}
            />

            <div className="modal-reward">✧ RECOMPENSA INICIAL: +10 XP</div>
            <button className="create-action modal-submit" type="submit">
              ADICIONAR MISSÃO
            </button>
          </form>
        </div>
      )}

      {toast && (
        <button className="toast-message" onClick={() => setToast('')}>
          ✦ {toast} <span>×</span>
        </button>
      )}
    </div>
  )
}

export default App
