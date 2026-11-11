import { useEffect, useMemo, useState, type FormEvent } from 'react'
import StudyWorld from './components/StudyWorld'
import AnimeSideCharacters from './components/AnimeSideCharacters'
import './App.css'

type Category = 'Principal' | 'Diária' | 'Instantânea' | 'Chefão' | 'Agendada'
type Filter = 'Ativas' | 'Diárias' | 'Principais' | 'Chefão' | 'Concluídas'
type SubjectStatus = 'active' | 'preparing'

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

type Subject = {
  id: string
  title: string
  shortTitle: string
  description: string
  icon: string
  lessons: number | null
  status: SubjectStatus
  tags: string[]
  custom?: boolean
}

const menuItems = [
  { label: 'Matérias', icon: '◈' },
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

const initialSubjects: Subject[] = [
  {
    id: 'estrutura-de-dados',
    title: 'Estrutura de Dados',
    shortTitle: 'Estrutura de Dados',
    description: 'Aprenda a organizar e manipular dados com estruturas fundamentais, árvores, listas, pilhas, filas e heaps.',
    icon: '🌳',
    lessons: 9,
    status: 'active',
    tags: ['Árvores', 'Listas', 'Pilhas', 'Filas'],
  },
  {
    id: 'lab-programacao-front-end',
    title: 'Laboratório de Programação Front End',
    shortTitle: 'Programação Front End',
    description: 'Construa interfaces para a web e pratique a criação de aplicações front-end.',
    icon: '🖥️',
    lessons: null,
    status: 'preparing',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    id: 'lab-programacao-poo',
    title: 'Laboratório de Programação Orientada a Objetos',
    shortTitle: 'Programação Orientada a Objetos',
    description: 'Estude a organização de programas com classes, objetos e os conceitos de orientação a objetos.',
    icon: '🧩',
    lessons: null,
    status: 'preparing',
    tags: ['Classes', 'Objetos', 'POO'],
  },
  {
    id: 'algoritmos',
    title: 'Algoritmos',
    shortTitle: 'Algoritmos',
    description: 'Desenvolva o raciocínio lógico e aprenda a construir soluções passo a passo.',
    icon: '⌘',
    lessons: null,
    status: 'preparing',
    tags: ['Lógica', 'Fluxogramas', 'Resolução'],
  },
  {
    id: 'resolucao-problemas-engenharia-i',
    title: 'Resolução de Problemas para Engenharia I',
    shortTitle: 'Resolução de Problemas I',
    description: 'Organize os conteúdos, atividades e desafios da primeira disciplina de resolução de problemas.',
    icon: '🧠',
    lessons: null,
    status: 'preparing',
    tags: ['Raciocínio', 'Problemas', 'Engenharia'],
  },
  {
    id: 'resolucao-problemas-engenharia-ii',
    title: 'Resolução de Problemas para Engenharia II',
    shortTitle: 'Resolução de Problemas II',
    description: 'Um espaço próprio para os materiais e desafios da segunda disciplina de resolução de problemas.',
    icon: '⚙️',
    lessons: null,
    status: 'preparing',
    tags: ['Raciocínio', 'Projetos', 'Engenharia'],
  },
  {
    id: 'lab-programacao-websites',
    title: 'Laboratório de Programação de Websites',
    shortTitle: 'Programação de Websites',
    description: 'Reúna aulas, práticas e projetos de desenvolvimento de websites.',
    icon: '🌐',
    lessons: null,
    status: 'preparing',
    tags: ['Web', 'Interfaces', 'Projetos'],
  },
  {
    id: 'engenharia-requisitos-analise-sistemas',
    title: 'Engenharia de Requisitos e Análise de Sistemas',
    shortTitle: 'Requisitos e Análise de Sistemas',
    description: 'Organize o estudo de requisitos, análise e documentação de sistemas.',
    icon: '📋',
    lessons: null,
    status: 'preparing',
    tags: ['Requisitos', 'Análise', 'Documentação'],
  },
]

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

const filters: Filter[] = ['Ativas', 'Diárias', 'Principais', 'Chefão', 'Concluídas']

const pageDescriptions: Record<string, string> = {
  Foco: 'Organize suas sessões de estudo e mantenha sua concentração.',
  Habilidades: 'Acompanhe as habilidades que desenvolve ao estudar.',
  Calendário: 'Visualize seus compromissos e sua rotina de estudos.',
  Loja: 'Futuramente, troque suas recompensas por itens e personalizações.',
  Atributos: 'Observe sua evolução em cada atributo de aprendizagem.',
  Histórico: 'Consulte suas missões e atividades anteriores.',
  Conquistas: 'Suas medalhas e títulos serão registrados aqui.',
  Configurações: 'Personalize sua experiência no Programa Aura.',
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? (JSON.parse(value) as T) : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [activeMenu, setActiveMenu] = useState('Matérias')
  const [activeFilter, setActiveFilter] = useState<Filter>('Ativas')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const custom = readJson<Subject[]>('aura-custom-subjects', [])
    return [...initialSubjects, ...custom]
  })
  const [subjectXp, setSubjectXp] = useState<Record<string, number>>(() =>
    readJson<Record<string, number>>('aura-subject-xp', {}),
  )

  const [quests, setQuests] = useState<Quest[]>(() => {
    const parsed = readJson<Quest[] | null>('aura-quests', null)
    if (!parsed) return initialQuests
    return initialQuests
      .map((initial) => parsed.find((quest) => quest.id === initial.id) ?? initial)
      .concat(parsed.filter((quest) => quest.id > 3))
  })

  const [totalXp, setTotalXp] = useState(() => {
    const saved = localStorage.getItem('aura-xp')
    return saved ? Number(saved) || 0 : 0
  })
  const [showModal, setShowModal] = useState(false)
  const [showSubjectModal, setShowSubjectModal] = useState(false)
  const [newQuestTitle, setNewQuestTitle] = useState('')
  const [newQuestDescription, setNewQuestDescription] = useState('')
  const [newSubjectTitle, setNewSubjectTitle] = useState('')
  const [newSubjectDescription, setNewSubjectDescription] = useState('')
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem('aura-quests', JSON.stringify(quests))
  }, [quests])

  useEffect(() => {
    localStorage.setItem('aura-xp', String(totalXp))
  }, [totalXp])

  useEffect(() => {
    localStorage.setItem('aura-subject-xp', JSON.stringify(subjectXp))
  }, [subjectXp])

  useEffect(() => {
    localStorage.setItem('aura-custom-subjects', JSON.stringify(subjects.filter((subject) => subject.custom)))
  }, [subjects])

  const level = Math.floor(totalXp / 100) + 1
  const xpInLevel = totalXp % 100
  const activeCount = quests.filter((quest) => !quest.completed).length
  const completedCount = quests.filter((quest) => quest.completed).length

  const filteredQuests = useMemo(() => quests.filter((quest) => {
    if (activeFilter === 'Ativas') return !quest.completed
    if (activeFilter === 'Concluídas') return quest.completed
    if (activeFilter === 'Diárias') return quest.category === 'Diária' && !quest.completed
    if (activeFilter === 'Principais') return quest.category === 'Principal' && !quest.completed
    if (activeFilter === 'Chefão') return quest.category === 'Chefão' && !quest.completed
    return true
  }), [quests, activeFilter])

  function addXp(points: number, subjectTitle = 'Estrutura de Dados') {
    setTotalXp((current) => current + points)
    setSubjectXp((current) => ({ ...current, [subjectTitle]: (current[subjectTitle] ?? 0) + points }))
    setToast(`+${points} XP · ${subjectTitle}`)
  }

  function selectSubject(subject: Subject) {
    setActiveMenu('Matérias')
    setSelectedSubject(subject.title)
    setToast(`${subject.shortTitle} selecionada`)
  }

  function completeQuest(quest: Quest) {
    if (quest.completed) return
    setQuests((current) => current.map((item) => item.id === quest.id ? { ...item, completed: true } : item))
    addXp(quest.reward, 'Missões gerais')
  }

  function createQuest(event: FormEvent<HTMLFormElement>) {
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
    setToast('Nova missão adicionada ao quadro!')
  }

  function createSubject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newSubjectTitle.trim()
    if (!title) return

    if (subjects.some((subject) => subject.title.toLocaleLowerCase() === title.toLocaleLowerCase())) {
      setToast('Essa matéria já está cadastrada.')
      return
    }

    const subject: Subject = {
      id: `custom-${Date.now()}`,
      title,
      shortTitle: title.length > 34 ? `${title.slice(0, 31)}...` : title,
      description: newSubjectDescription.trim() || 'Matéria adicionada à sua jornada. Os conteúdos serão organizados quando você enviar os materiais.',
      icon: '📘',
      lessons: null,
      status: 'preparing',
      tags: ['Personalizada'],
      custom: true,
    }

    setSubjects((current) => [...current, subject])
    setNewSubjectTitle('')
    setNewSubjectDescription('')
    setShowSubjectModal(false)
    setToast('Nova matéria adicionada ao Programa Aura!')
  }

  function openSubjectFromQuest() {
    const subject = subjects.find((item) => item.id === 'estrutura-de-dados')
    if (subject) selectSubject(subject)
  }

  const selectedSubjectData = subjects.find((subject) => subject.title === selectedSubject)

  return (
    <div className="aura-app">
      <div className="aura-background-scene" aria-hidden="true">
        <div className="scene-moon" />
        <div className="scene-mountain scene-mountain-one" />
        <div className="scene-mountain scene-mountain-two" />
        <div className="scene-particles" />
      </div>

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
              onClick={() => {
                setActiveMenu(item.label)
                if (item.label === 'Matérias') setSelectedSubject(null)
                else setSelectedSubject(null)
              }}
            >
              <span className="side-link-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Matérias' && <span className="menu-count">{subjects.length}</span>}
              {item.label === 'Conquistas' && <span className="menu-count">{completedCount}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-world">
          <span className="sidebar-label">MUNDO EM DESTAQUE</span>
          <div className="sidebar-world-icon">🌳</div>
          <strong>Estrutura de Dados</strong>
          <span>9 AULAS MAPEADAS</span>
          <button onClick={openSubjectFromQuest}>Acessar mundo →</button>
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
          <div className="panel-kicker"><span className="blue-dot" />STATUS DO SISTEMA</div>
          <div className="status-main">
            <div className="character-info">
              <div className="character-avatar">✧</div>
              <div className="character-details">
                <div className="character-name-line"><span className="small-label">NOME:</span><h1>Aventureiro</h1></div>
                <div className="character-class"><span className="small-label">CLASSE:</span><strong>Aprendiz da Aura</strong></div>
                <div className="character-resources">
                  <div className="resource"><span className="resource-symbol streak-symbol">🔥</span><strong>0</strong><span className="resource-caption">DIAS DE SEQUÊNCIA</span></div>
                  <div className="resource"><span className="resource-symbol coin-symbol">✦</span><strong>0</strong><span className="resource-caption">FRAGMENTOS AURA</span></div>
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
          <div className="experience-track"><div className="experience-fill" style={{ width: `${xpInLevel}%` }} /><span>{xpInLevel}%</span></div>
        </section>

        {activeMenu === 'Matérias' && !selectedSubject && (
          <div className="subject-home">
            <AnimeSideCharacters />
            <div className="subject-home-content">
              <section className="subject-welcome">
                <span className="panel-kicker"><span className="blue-dot" />SUA JORNADA DE CONHECIMENTO</span>
                <h1>Escolha seu próximo <span>mundo.</span></h1>
                <p>Cada matéria é um universo próprio. Estude, pratique, conclua desafios e evolua em cada disciplina.</p>
                <div className="subject-welcome-stats">
                  <span><strong>{subjects.length}</strong> MUNDOS CADASTRADOS</span>
                  <span><strong>{subjects.filter((subject) => subject.status === 'active').length}</strong> MUNDO COM CONTEÚDO</span>
                  <span><strong>{totalXp}</strong> XP TOTAL</span>
                </div>
              </section>

              <div className="subject-grid-heading">
                <div><span className="study-eyebrow">BIBLIOTECA DE MATÉRIAS</span><h2>Seus mundos</h2></div>
                <button className="create-action" onClick={() => setShowSubjectModal(true)}>+ ADICIONAR MATÉRIA</button>
              </div>

              <section className="subject-grid">
                {subjects.map((subject) => {
                  const xp = subjectXp[subject.title] ?? 0
                  const subjectLevel = Math.floor(xp / 100) + 1
                  const isReady = subject.status === 'active'

                  return (
                    <article className={`subject-card ${isReady ? 'subject-ready' : 'subject-preparing'}`} key={subject.id}>
                      <div className="subject-card-top">
                        <span className="subject-icon">{subject.icon}</span>
                        <span className={`subject-status ${isReady ? 'status-ready' : 'status-preparing'}`}>{isReady ? '● EM ANDAMENTO' : '◷ EM PREPARAÇÃO'}</span>
                      </div>
                      <span className="subject-code">{subject.custom ? 'MATÉRIA PERSONALIZADA' : 'DISCIPLINA DA GRADUAÇÃO'}</span>
                      <h3>{subject.title}</h3>
                      <p>{subject.description}</p>
                      <div className="subject-tags">{subject.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <div className="subject-card-footer">
                        <div><strong>LV. {String(subjectLevel).padStart(2, '0')}</strong><small>{xp} XP · {subject.lessons ? `${subject.lessons} aulas mapeadas` : 'Conteúdo a organizar'}</small></div>
                        <button onClick={() => selectSubject(subject)}>{isReady ? 'ENTRAR NO MUNDO' : 'ABRIR MUNDO'} →</button>
                      </div>
                    </article>
                  )
                })}
              </section>
              <div className="subject-footer-note"><span>✧</span> Envie os PDFs, slides e exercícios de cada disciplina para transformarmos cada mundo em uma trilha de estudo baseada nas aulas reais.</div>
            </div>
          </div>
        )}

        {activeMenu === 'Matérias' && selectedSubject && selectedSubjectData && (
          selectedSubject === 'Estrutura de Dados' ? (
            <StudyWorld onEarnXp={(points) => addXp(points, 'Estrutura de Dados')} onBack={() => setSelectedSubject(null)} />
          ) : (
            <section className="subject-detail glass-panel">
              <button className="subject-back-button" onClick={() => setSelectedSubject(null)}>← VOLTAR PARA MATÉRIAS</button>
              <div className="subject-detail-icon">{selectedSubjectData.icon}</div>
              <span className="study-eyebrow">MUNDO EM PREPARAÇÃO</span>
              <h2>{selectedSubjectData.title}</h2>
              <p>{selectedSubjectData.description}</p>
              <div className="subject-detail-status">◷ Aguardando os materiais desta disciplina</div>
              <p className="subject-detail-help">Quando você enviar as aulas, vou organizar os assuntos na ordem do professor, criar explicações detalhadas, exercícios e desafios. Não vamos inventar conteúdos antes de analisar seu material.</p>
              <button className="create-action" onClick={() => setSelectedSubject(null)}>VOLTAR AO MAPA DE MATÉRIAS</button>
            </section>
          )
        )}

        {activeMenu === 'Missões' && (
          <>
            <div className="content-toolbar">
              <div className="toolbar-title"><span className="blue-dot" /><span>ÁREA DE EVOLUÇÃO</span></div>
              <div className="toolbar-actions">
                <button className="secondary-action" onClick={() => setToast('O assistente Aura será desenvolvido em uma próxima etapa.')}>✧ <span>ASSISTENTE AURA</span></button>
                <button className="create-action" onClick={() => setShowModal(true)}>+ <span>CRIAR MISSÃO</span></button>
              </div>
            </div>
            <div className="dashboard-grid">
              <section className="attributes-panel glass-panel">
                <div className="panel-title-row"><div><span className="panel-kicker">SEU DESENVOLVIMENTO</span><h2>ATRIBUTOS</h2></div><span className="attribute-points">✦ +0</span></div>
                <div className="attributes-list">
                  {attributes.map((attribute) => (
                    <div className="attribute-item" key={attribute.short}>
                      <div className={`attribute-icon ${attribute.color}`}>{attribute.short.slice(0, 1)}</div>
                      <div className="attribute-data">
                        <div className="attribute-label-row"><div><span>{attribute.short}</span><strong>{attribute.name}</strong></div><b>{attribute.value}</b></div>
                        <div className="attribute-track"><div className={`attribute-fill ${attribute.color}`} style={{ width: '3%' }} /></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="attribute-note"><span>✧</span>Seus atributos evoluirão conforme você dominar novos conteúdos.</div>
              </section>

              <section className="quests-panel glass-panel">
                <div className="quests-heading"><div className="quests-title"><span className="blue-dot" /><h2>MISSÕES</h2></div><div className="quest-counters"><span><i className="counter-blue" /> Ativas: <b>{activeCount}</b></span><span><i className="counter-green" /> Concluídas: <b>{completedCount}</b></span></div></div>
                <div className="quest-filters">
                  {filters.map((filter) => <button key={filter} className={`filter-button ${activeFilter === filter ? 'active' : ''}`} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
                </div>
                <div className="quest-list">
                  {filteredQuests.length > 0 ? filteredQuests.map((quest) => (
                    <article className={`quest-card ${quest.completed ? 'completed' : ''}`} key={quest.id}>
                      <div className="quest-icon">{quest.icon}</div>
                      <div className="quest-information"><h3>{quest.title}</h3><span className="quest-lesson">{quest.lesson}</span><p>{quest.description}</p></div>
                      <div className="quest-reward"><span className="rank">✦ {quest.rank}</span><span className="quest-stars">★★★</span><span className="reward-xp">✧ +{quest.reward} XP</span></div>
                      {!quest.completed && (quest.id <= 3 ? <button className="complete-button study-quest-button" onClick={openSubjectFromQuest}>ESTUDAR</button> : <button className="complete-button" onClick={() => completeQuest(quest)}>CONCLUIR</button>)}
                      {quest.completed && <span className="completed-label">✓ CONCLUÍDA</span>}
                    </article>
                  )) : <div className="empty-quests"><span>✧</span><strong>Nenhuma missão nesta categoria</strong><p>Novas missões aparecerão aqui durante sua jornada.</p></div>}
                </div>
                <div className="quest-footer"><span>PROGRAMA AURA</span><span>UMA CONQUISTA POR VEZ ✧</span></div>
              </section>
            </div>
          </>
        )}

        {activeMenu !== 'Matérias' && activeMenu !== 'Missões' && (
          <section className="placeholder-panel glass-panel"><span className="placeholder-icon">✧</span><span className="panel-kicker">SISTEMA AURA</span><h2>{activeMenu}</h2><p>{pageDescriptions[activeMenu] ?? 'Esta área fará parte da sua jornada de aprendizado.'}</p><button className="create-action" onClick={() => setActiveMenu('Matérias')}>EXPLORAR MATÉRIAS →</button></section>
        )}

        <footer className="main-footer"><span>✧ PROGRAMA AURA · SISTEMA DE EVOLUÇÃO</span><span>SEU CONHECIMENTO É SUA MAIOR FORÇA.</span></footer>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <form className="mission-modal" onSubmit={createQuest} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <span className="panel-kicker">SISTEMA DE MISSÕES</span><h2>Criar nova missão</h2><p>Adicione um objetivo pessoal à sua jornada de aprendizado.</p>
            <label htmlFor="quest-title">NOME DA MISSÃO</label><input id="quest-title" value={newQuestTitle} onChange={(event) => setNewQuestTitle(event.target.value)} placeholder="Ex.: Estudar por 30 minutos" required />
            <label htmlFor="quest-description">DESCRIÇÃO</label><textarea id="quest-description" value={newQuestDescription} onChange={(event) => setNewQuestDescription(event.target.value)} placeholder="Descreva o que você deseja realizar..." rows={3} />
            <div className="modal-reward">✧ RECOMPENSA INICIAL: +10 XP</div><button className="create-action modal-submit" type="submit">ADICIONAR MISSÃO</button>
          </form>
        </div>
      )}

      {showSubjectModal && (
        <div className="modal-overlay" onClick={() => setShowSubjectModal(false)}>
          <form className="mission-modal subject-modal" onSubmit={createSubject} onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setShowSubjectModal(false)}>×</button>
            <span className="panel-kicker">EXPANSÃO DA JORNADA</span><h2>Adicionar matéria</h2><p>Crie um novo mundo agora. Depois podemos preencher com as aulas e exercícios do professor.</p>
            <label htmlFor="subject-title">NOME DA MATÉRIA</label><input id="subject-title" value={newSubjectTitle} onChange={(event) => setNewSubjectTitle(event.target.value)} placeholder="Ex.: Banco de Dados" required />
            <label htmlFor="subject-description">DESCRIÇÃO (OPCIONAL)</label><textarea id="subject-description" value={newSubjectDescription} onChange={(event) => setNewSubjectDescription(event.target.value)} placeholder="Qual é o foco desta disciplina?" rows={3} />
            <button className="create-action modal-submit" type="submit">CRIAR MEU MUNDO</button>
          </form>
        </div>
      )}

      {toast && <button className="toast-message" onClick={() => setToast('')}>✦ {toast}<span>×</span></button>}
    </div>
  )
}

export default App
