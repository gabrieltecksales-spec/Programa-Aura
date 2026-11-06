import { useEffect, useState } from 'react'
import './StudyWorld.css'

type StudyWorldProps = {
  onEarnXp: (points: number) => void
  onBack: () => void
}

type Region = {
  number: string
  title: string
  description: string
  icon: string
}

type Question = {
  id: string
  question: string
  explanation: string
  options: string[]
  correct: number
}

const regions: Region[] = [
  { number: '01', title: 'Árvores', description: 'Raiz, nós, relações, caminhos, níveis e altura.', icon: '🌳' },
  { number: '02', title: 'Algoritmos e sequências', description: 'Dados, vetores, matrizes, registros e operações.', icon: '📜' },
  { number: '03', title: 'Complexidade de algoritmos', description: 'Análise de custo, operações e eficiência.', icon: '⌛' },
  { number: '04', title: 'Big O e recursividade', description: 'Notação assintótica e chamadas recursivas.', icon: '∞' },
  { number: '05', title: 'Indução matemática', description: 'Demonstração e raciocínio matemático.', icon: '🔮' },
  { number: '06', title: 'Listas lineares e pilhas', description: 'Estruturas lineares e suas operações.', icon: '📚' },
  { number: '07', title: 'Listas sequenciais e filas', description: 'Sequências, filas e organização dos elementos.', icon: '🏛️' },
  { number: '08', title: 'Deque', description: 'Fila com operações nas duas extremidades.', icon: '⚖️' },
  { number: '09', title: 'Heap e fila de prioridades', description: 'Hierarquia e organização por prioridade.', icon: '💎' },
]

const questions: Question[] = [
  {
    id: 'arvores-01',
    question: 'Qual é a principal característica de uma árvore?',
    explanation: 'A árvore é um conjunto finito de elementos chamados nós. Quando não está vazia, possui um nó especial chamado raiz e os demais nós formam subárvores.',
    options: [
      'É uma sequência em que todos os elementos ficam em uma única linha.',
      'É um conjunto finito de nós organizado a partir de uma raiz e suas subárvores.',
      'É uma tabela formada somente por linhas e colunas.',
      'É uma estrutura que não permite relações entre elementos.',
    ],
    correct: 1,
  },
  {
    id: 'arvores-02',
    question: 'O que é uma floresta na definição apresentada na aula?',
    explanation: 'O professor define floresta como um conjunto de árvores.',
    options: ['Um conjunto de árvores.', 'Um único nó sem filhos.', 'Uma árvore sem raiz.', 'Um caminho entre dois nós.'],
    correct: 0,
  },
  {
    id: 'arvores-03',
    question: 'Quando um nó é considerado uma folha?',
    explanation: 'Um nó que não possui filhos é chamado de folha. Se possui pelo menos um filho, é um nó interior.',
    options: ['Quando possui muitos filhos.', 'Quando está obrigatoriamente na raiz.', 'Quando não possui filhos.', 'Quando possui dois irmãos.'],
    correct: 2,
  },
  {
    id: 'arvores-04',
    question: 'Na árvore de exemplo, se a é pai de b e c, como b e c são chamados entre si?',
    explanation: 'Nós que possuem o mesmo pai são chamados de irmãos. Como b e c têm a como pai, eles são irmãos.',
    options: ['Avô e neto.', 'Pai e filho.', 'Tio e sobrinho.', 'Irmãos.'],
    correct: 3,
  },
  {
    id: 'arvores-05',
    question: 'De acordo com a convenção do professor, qual é o nível da raiz?',
    explanation: 'O nível conta o número de nós no caminho da raiz até o nó. Para a própria raiz, o caminho possui apenas um nó. Portanto, seu nível é 1.',
    options: ['Nível 0.', 'Nível 1.', 'Nível 2.', 'Nível 3.'],
    correct: 1,
  },
  {
    id: 'arvores-06',
    question: 'Na árvore do slide, o caminho da raiz a até f é a → b → f. Qual é o nível de f?',
    explanation: 'O caminho a → b → f possui três nós. O slide confirma que o nível de f é 3.',
    options: ['1.', '2.', '3.', '4.'],
    correct: 2,
  },
  {
    id: 'arvores-07',
    question: 'Qual é a altura de c quando c não possui filhos?',
    explanation: 'A altura é contada pelo número de nós no maior caminho até um descendente. Como c é folha, o caminho tem somente o próprio nó: altura 1.',
    options: ['0.', '1.', '2.', '3.'],
    correct: 1,
  },
  {
    id: 'arvores-08',
    question: 'Qual é a altura da árvore do exemplo que possui o maior caminho a → b → d → g?',
    explanation: 'Esse caminho contém quatro nós: a, b, d e g. Como a altura é contada em número de nós, a altura da árvore é 4.',
    options: ['1.', '2.', '3.', '4.'],
    correct: 3,
  },
  {
    id: 'arvores-09',
    question: 'O que caracteriza uma árvore ordenada segundo a aula?',
    explanation: 'Em uma árvore ordenada, os filhos de cada nó possuem uma ordem. A convenção apresentada no slide é da esquerda para a direita.',
    options: [
      'Todos os nós precisam ter exatamente dois filhos.',
      'Os filhos de cada nó estão ordenados, seguindo a convenção da esquerda para a direita.',
      'A raiz precisa ser sempre o último elemento.',
      'As folhas precisam ficar na mesma altura.',
    ],
    correct: 1,
  },
  {
    id: 'arvores-10',
    question: 'Qual sequência abaixo foi apresentada como um caminho válido no slide?',
    explanation: 'O material mostra c, a, b, e como caminho. Cada par consecutivo está ligado por uma relação de pai e filho.',
    options: ['c → a → b → e', 'c → d → g → a', 'g → e → c → i', 'a → g → c → b'],
    correct: 0,
  },
]

function TreeDiagram() {
  const nodes = [
    { id: 'a', x: 320, y: 48 },
    { id: 'b', x: 200, y: 142 },
    { id: 'c', x: 440, y: 142 },
    { id: 'd', x: 110, y: 240 },
    { id: 'e', x: 200, y: 240 },
    { id: 'f', x: 290, y: 240 },
    { id: 'g', x: 110, y: 338 },
    { id: 'h', x: 200, y: 338 },
    { id: 'i', x: 290, y: 338 },
  ]

  const connections = [
    ['a', 'b'], ['a', 'c'], ['b', 'd'], ['b', 'e'],
    ['b', 'f'], ['d', 'g'], ['e', 'h'], ['f', 'i'],
  ]

  const getNode = (id: string) => nodes.find((node) => node.id === id)!

  return (
    <svg className="tree-diagram" viewBox="0 0 640 385" role="img" aria-label="Árvore com raiz a e nós descendentes b, c, d, e, f, g, h e i.">
      {connections.map(([parent, child]) => {
        const start = getNode(parent)
        const end = getNode(child)
        return <line key={`${parent}-${child}`} x1={start.x} y1={start.y + 21} x2={end.x} y2={end.y - 21} className="tree-connection" />
      })}
      {nodes.map((node) => (
        <g key={node.id}>
          <circle cx={node.x} cy={node.y} r="22" className={`tree-node ${node.id === 'a' ? 'tree-root' : ''}`} />
          <text x={node.x} y={node.y + 6} textAnchor="middle" className="tree-node-label">{node.id}</text>
        </g>
      ))}
    </svg>
  )
}

function KiCelebration({ xp, onContinue, lastQuestion }: { xp: number; onContinue: () => void; lastQuestion: boolean }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 2600)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="ki-celebration" role="dialog" aria-modal="true" aria-label="Exercício concluído">
      <div className="ki-energy-ring ki-ring-one" />
      <div className="ki-energy-ring ki-ring-two" />
      <div className="ki-energy-ring ki-ring-three" />
      <div className="ki-lightning ki-lightning-left" />
      <div className="ki-lightning ki-lightning-right" />

      <div className="ki-celebration-content">
        <span className="ki-kicker">GOKU · AURA SYSTEM · POWER UP</span>
        <div className="ki-warrior-scene" aria-hidden="true">
          <div className="ki-aura-flame ki-flame-one" />
          <div className="ki-aura-flame ki-flame-two" />
          <div className="ki-aura-core" />
          <svg className="ki-warrior" viewBox="0 0 360 430" role="img" aria-label="Ilustração vetorial estilizada de Goku carregando energia">
            <defs>
              <linearGradient id="giOrange" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffd36e"/><stop offset="0.5" stopColor="#f47b25"/><stop offset="1" stopColor="#a93617"/></linearGradient>
              <linearGradient id="giBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#67eaff"/><stop offset="1" stopColor="#1766d7"/></linearGradient>
            </defs>
            <ellipse cx="180" cy="394" rx="112" ry="18" fill="#4bdcff" opacity=".25" />
            <path d="M180 30 L197 5 L209 38 L236 13 L238 51 L271 37 L257 75 L290 73 L266 101 L286 120 L246 124 L230 142 L205 127 L179 144 L155 128 L126 142 L121 109 L91 103 L116 79 L101 48 L143 60 Z" fill="#10172a" stroke="#65dfff" strokeWidth="4" />
            <path d="M139 100 Q180 74 221 101 L222 159 Q180 190 138 157 Z" fill="#efb48b" stroke="#4c2630" strokeWidth="5" />
            <path d="M146 129 L171 137 L153 145 Z M214 129 L190 137 L207 145 Z" fill="#111b33" />
            <path d="M167 164 L193 164 L206 183 L180 207 L154 183 Z" fill="#edaa80" />
            <path d="M133 183 Q180 163 227 183 L270 287 L218 326 L180 300 L140 326 L91 286 Z" fill="url(#giOrange)" stroke="#7b2e1e" strokeWidth="7" />
            <path d="M135 192 L88 214 L54 286 L76 299 L126 249 L151 220 Z" fill="url(#giOrange)" stroke="#7b2e1e" strokeWidth="7" />
            <path d="M225 192 L272 214 L306 286 L284 299 L234 249 L209 220 Z" fill="url(#giOrange)" stroke="#7b2e1e" strokeWidth="7" />
            <path d="M52 281 Q37 283 34 303 Q47 326 74 310 L81 291 Z M308 281 Q323 283 326 303 Q313 326 286 310 L279 291 Z" fill="#edb184" stroke="#6c3c37" strokeWidth="5" />
            <path d="M147 310 L180 300 L214 310 L226 376 L194 385 L180 352 L164 385 L132 376 Z" fill="url(#giOrange)" stroke="#7b2e1e" strokeWidth="7" />
            <path d="M132 365 L166 375 L158 406 L112 410 L102 392 Z M194 375 L228 365 L258 392 L248 410 L202 406 Z" fill="url(#giBlue)" stroke="#142b59" strokeWidth="7" />
            <path d="M140 211 L180 236 L220 211 M180 236 L180 293" fill="none" stroke="#ffe0a0" strokeWidth="7" opacity=".75" />
            <circle cx="180" cy="255" r="17" fill="#1a4e8b" stroke="#a6eaff" strokeWidth="4" />
            <text x="180" y="262" textAnchor="middle" fontSize="19" fill="#e9faff" fontWeight="bold">悟</text>
          </svg>
          <div className="ki-power-orb">気</div>
        </div>

        <span className="ki-overline">EXERCÍCIO CONCLUÍDO!</span>
        <h2>SEU KI <span>AUMENTOU!</span></h2>
        <div className="ki-reward">{xp > 0 ? `+${xp} XP` : 'REVISÃO CONCLUÍDA'}</div>
        <p>{xp > 0 ? 'Você superou mais um desafio. Sua energia e seu conhecimento evoluíram.' : 'Você resolveu novamente este desafio. Continue fortalecendo seu conhecimento.'}</p>
        <button className="ki-continue-button" onClick={onContinue} disabled={!ready}>
          {ready ? (lastQuestion ? 'FINALIZAR AULA' : 'PRÓXIMO EXERCÍCIO →') : 'CARREGANDO KI...'}
        </button>
      </div>
    </div>
  )
}

function StudyWorld({ onEarnXp, onBack }: StudyWorldProps) {
  const [view, setView] = useState<'map' | 'lesson'>('map')
  const [exerciseOpen, setExerciseOpen] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showKi, setShowKi] = useState(false)
  const [lastXpEarned, setLastXpEarned] = useState(0)
  const [lessonDone, setLessonDone] = useState(() => localStorage.getItem('aura-aula-1-concluida') === 'true')
  const currentQuestion = questions[questionIndex]

  useEffect(() => {
    if (!exerciseOpen) return
    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [exerciseOpen])

  function openLesson() {
    setView('lesson')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openExercise() {
    setQuestionIndex(0)
    setSelected(null)
    setFeedback(null)
    setShowKi(false)
    setExerciseOpen(true)
  }

  function checkAnswer() {
    if (selected === null) return
    if (selected !== currentQuestion.correct) {
      setFeedback('wrong')
      return
    }

    setFeedback('correct')
    const rewardKey = `aura-xp-${currentQuestion.id}`
    const alreadyRewarded = localStorage.getItem(rewardKey) === 'true'
    const xp = alreadyRewarded ? 0 : 5

    if (!alreadyRewarded) {
      localStorage.setItem(rewardKey, 'true')
      onEarnXp(xp)
    }

    setLastXpEarned(xp)
    setShowKi(true)
  }

  function retryQuestion() {
    setSelected(null)
    setFeedback(null)
  }

  function continueAfterKi() {
    setShowKi(false)
    if (questionIndex === questions.length - 1) {
      localStorage.setItem('aura-aula-1-concluida', 'true')
      setLessonDone(true)
      setExerciseOpen(false)
      setView('map')
      return
    }
    setQuestionIndex((current) => current + 1)
    setSelected(null)
    setFeedback(null)
  }

  function abandonExercise() {
    const confirmed = window.confirm('Deseja sair do desafio? Seu progresso de XP já conquistado será mantido, mas você precisará continuar as questões restantes depois.')
    if (confirmed) {
      setExerciseOpen(false)
      setShowKi(false)
      setSelected(null)
      setFeedback(null)
    }
  }

  if (view === 'lesson') {
    return (
      <div className="study-world">
        <div className="study-breadcrumb">
          <button onClick={onBack}>Matérias</button><span>/</span><button onClick={() => setView('map')}>Estrutura de Dados</button><span>/</span><strong>Árvores</strong>
        </div>

        <header className="lesson-hero">
          <div className="lesson-hero-text">
            <span className="study-eyebrow">REGIÃO 01 · AULA 01</span>
            <h1>O mundo das <span>árvores</span></h1>
            <p>Descubra como os dados podem ser organizados em estruturas hierárquicas. Sua primeira missão é compreender como os nós se relacionam e como uma árvore funciona.</p>
            <div className="lesson-tags"><span>✦ FUNDAMENTOS</span><span>📖 EXPLICAÇÃO DETALHADA</span><span>⚔ DESAFIO FINAL</span></div>
          </div>
          <div className="lesson-hero-symbol">🌳</div>
        </header>

        <section className="lesson-section-card">
          <div className="study-section-heading"><span className="study-step">01</span><div><span className="study-eyebrow">PRIMEIRO CONTATO</span><h2>O que é uma árvore?</h2></div></div>
          <p>Imagine uma árvore genealógica de uma família. Existe uma pessoa no topo, que se conecta a seus filhos, que podem ter seus próprios filhos. Em Estrutura de Dados, usamos uma organização parecida para representar informações.</p>
          <p>Uma <strong>árvore</strong> é um conjunto finito de elementos chamados <strong>nós</strong>. Ela pode ser vazia. Quando não é vazia, possui um nó especial chamado <strong>raiz</strong>, e os nós restantes constituem um conjunto vazio ou se dividem em subárvores da raiz.</p>
          <div className="study-callout"><span>✧</span><div><strong>Guarde esta ideia:</strong><p>Em uma árvore, os elementos não ficam apenas um depois do outro. Eles se organizam por relações hierárquicas.</p></div></div>
          <div className="study-example"><strong>Exemplo do cotidiano</strong><p>Pense nas pastas do seu computador. Uma pasta pode conter outras pastas, e cada uma delas pode possuir novos arquivos ou pastas. Essa organização hierárquica lembra uma árvore.</p></div>
        </section>

        <section className="lesson-section-card">
          <div className="study-section-heading"><span className="study-step">02</span><div><span className="study-eyebrow">VISUALIZE A ESTRUTURA</span><h2>Conhecendo os nós</h2></div></div>
          <p>Veja o exemplo utilizado no material da Aula 1. Cada círculo representa um nó e cada linha representa uma ligação entre um nó e seu filho.</p>
          <div className="tree-visual-panel"><div className="tree-visual-heading"><span>REPRESENTAÇÃO DE UMA ÁRVORE</span><span className="tree-visual-badge">EXEMPLO DA AULA</span></div><TreeDiagram /><div className="tree-legend"><span><i className="legend-root" />Raiz</span><span><i className="legend-branch" />Nós intermediários</span><span><i className="legend-leaf" />Folhas</span></div></div>
          <div className="study-definition-grid">
            <article><span>01</span><strong>Nó</strong><p>É cada elemento que pertence à árvore.</p></article>
            <article><span>02</span><strong>Raiz</strong><p>É o nó especial que fica no início da estrutura.</p></article>
            <article><span>03</span><strong>Subárvore</strong><p>É uma árvore formada a partir de um nó e sua descendência.</p></article>
            <article><span>04</span><strong>Rótulo</strong><p>É um identificador associado a um nó, como a, b ou c.</p></article>
          </div>
          <p>Uma <strong>floresta</strong> é um conjunto de árvores. Se v é um nó da árvore T, a notação Tv indica a subárvore de T cuja raiz é v.</p>
        </section>

        <section className="lesson-section-card">
          <div className="study-section-heading"><span className="study-step">03</span><div><span className="study-eyebrow">RELAÇÕES ENTRE OS NÓS</span><h2>Pais, filhos, irmãos e ancestrais</h2></div></div>
          <p>Na árvore do exemplo, observe o nó <strong>a</strong>. Ele se conecta diretamente a <strong>b</strong> e <strong>c</strong>. Essas relações recebem nomes específicos:</p>
          <div className="study-relationship-list">
            <div><strong>Pai:</strong> o nó que está diretamente acima de outro.</div>
            <div><strong>Filho:</strong> o nó que está diretamente abaixo de seu pai.</div>
            <div><strong>Irmãos:</strong> nós que possuem o mesmo pai.</div>
            <div><strong>Tios:</strong> irmãos do pai de um nó.</div>
            <div><strong>Avô:</strong> o pai do pai de um nó.</div>
            <div><strong>Descendente:</strong> um nó que está abaixo de outro na hierarquia.</div>
            <div><strong>Ascendente:</strong> um nó que está acima de outro na hierarquia.</div>
          </div>
          <div className="study-example"><strong>Aplicando no desenho</strong><p>O nó a é pai de b e c. Os nós b e c são irmãos. O nó d é filho de b, e a é avô de d.</p></div>
        </section>

        <section className="lesson-section-card">
          <div className="study-section-heading"><span className="study-step">04</span><div><span className="study-eyebrow">IDENTIFIQUE OS TIPOS DE NÓ</span><h2>Folhas e nós interiores</h2></div></div>
          <p>Existe uma diferença importante entre os nós de uma árvore:</p>
          <div className="study-two-columns">
            <article className="study-concept-card leaf-concept"><span>🍃</span><h3>Folha</h3><p>É o nó que não possui nenhum filho. Ele representa o fim de um ramo.</p><small>Exemplos: c, g, h e i.</small></article>
            <article className="study-concept-card internal-concept"><span>🌿</span><h3>Nó interior</h3><p>É o nó que possui pelo menos um filho. Ele continua a ramificação da árvore.</p><small>Exemplos: a, b, d, e e f.</small></article>
          </div>
        </section>

        <section className="lesson-section-card">
          <div className="study-section-heading"><span className="study-step">05</span><div><span className="study-eyebrow">CAMINHOS E MEDIDAS</span><h2>Caminho, nível e altura</h2></div></div>
          <h3 className="study-subtitle">Caminho</h3>
          <p>Uma sequência de nós distintos é um caminho quando cada par de nós consecutivos está relacionado como pai e filho. O comprimento do caminho é k - 1, sendo k a quantidade de nós da sequência.</p>
          <div className="study-formula"><span>EXEMPLO DO SLIDE</span><strong>c → a → b → e</strong><small>O material apresenta essa sequência como um caminho válido.</small></div>
          <h3 className="study-subtitle">Nível</h3>
          <p>O nível de um nó é o número de nós no caminho da raiz até ele. Nesta convenção, a raiz tem nível 1.</p>
          <div className="study-level-list"><div><span>Nível 1</span><strong>a</strong><small>Raiz</small></div><div><span>Nível 2</span><strong>b, c</strong><small>Filhos de a</small></div><div><span>Nível 3</span><strong>d, e, f</strong><small>Descendentes</small></div><div><span>Nível 4</span><strong>g, h, i</strong><small>Último nível do exemplo</small></div></div>
          <h3 className="study-subtitle">Altura</h3>
          <p>A altura de um nó é o número de nós no maior caminho dele até um de seus descendentes. A altura da árvore T é a altura da sua raiz.</p>
          <div className="study-callout important-callout"><span>⚠</span><div><strong>Atenção à convenção do professor!</strong><p>Nesta aula, a contagem é feita pelo número de nós, não pelo número de ligações. Por isso, uma folha tem altura 1 e a raiz deste exemplo tem nível 1.</p></div></div>
          <div className="study-definition-grid"><article><span>EXEMPLO</span><strong>Nível de b = 2</strong><p>O caminho a → b possui dois nós.</p></article><article><span>EXEMPLO</span><strong>Nível de f = 3</strong><p>O caminho a → b → f possui três nós.</p></article><article><span>EXEMPLO</span><strong>Altura de c = 1</strong><p>O nó c não possui descendentes.</p></article><article><span>EXEMPLO</span><strong>Altura da árvore = 4</strong><p>O maior caminho descendente tem quatro nós.</p></article></div>
        </section>

        <section className="lesson-section-card">
          <div className="study-section-heading"><span className="study-step">06</span><div><span className="study-eyebrow">ORGANIZAÇÃO DOS FILHOS</span><h2>Árvore ordenada</h2></div></div>
          <p>Uma árvore ordenada é aquela em que os filhos de cada nó estão ordenados. A convenção apresentada na aula é considerar a ordenação da esquerda para a direita.</p>
          <div className="study-example"><strong>Representação por parênteses</strong><p>O slide mostra a seguinte representação para uma árvore com raiz a:</p><code>(a(b(d)(e))(c(f)))</code></div>
          <p>O material também mostra que expressões aritméticas podem ser representadas por árvores. Essa estrutura representa a ordem em que a expressão deve ser computada.</p>
        </section>

        <section className="lesson-challenge-intro">
          <div><span className="study-eyebrow">PROVE O QUE APRENDEU</span><h2>O guardião das árvores aguarda.</h2><p>São 10 exercícios. Cada resposta correta aumenta seu Ki e concede experiência. Você pode tentar novamente quando errar.</p></div>
          <div className="challenge-reward"><strong>+50 XP</strong><span>10 EXERCÍCIOS</span></div>
          <button className="study-primary-button" onClick={openExercise}>{lessonDone ? 'REFAZER DESAFIO' : 'INICIAR DESAFIO'} ⚔</button>
          {lessonDone && <span className="lesson-completed-chip">✓ AULA CONCLUÍDA</span>}
        </section>

        {exerciseOpen && (
          <div className="study-exercise-backdrop" role="presentation">
            <section className="study-exercise-modal" role="dialog" aria-modal="true" aria-labelledby="exercise-title">
              <div className="exercise-modal-header"><div><span className="study-eyebrow">MODO DE DESAFIO · REGIÃO 01</span><h2 id="exercise-title">Prova do guardião</h2></div><button className="exercise-exit" onClick={abandonExercise}>ABANDONAR DESAFIO ×</button></div>
              <div className="exercise-progress-line"><div style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div>
              <div className="exercise-meta"><span>EXERCÍCIO {String(questionIndex + 1).padStart(2, '0')} / {questions.length}</span><span>RECOMPENSA POR ACERTO: 5 XP</span></div>
              <h3 className="exercise-question">{currentQuestion.question}</h3>
              <div className="exercise-options">{currentQuestion.options.map((option, index) => <button key={option} className={`exercise-option ${selected === index ? 'chosen' : ''} ${feedback === 'wrong' && selected === index ? 'option-wrong' : ''} ${feedback === 'correct' && index === currentQuestion.correct ? 'option-correct' : ''}`} disabled={feedback !== null} onClick={() => setSelected(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
              {feedback === 'wrong' && <div className="exercise-feedback wrong-feedback"><strong>RESPOSTA INCORRETA</strong><p>Revise o conceito e tente novamente. Errar faz parte do aprendizado.</p><button onClick={retryQuestion}>TENTAR NOVAMENTE</button></div>}
              {feedback === 'correct' && <div className="exercise-feedback right-feedback"><strong>RESPOSTA CORRETA</strong><p>{currentQuestion.explanation}</p></div>}
              {feedback === null && <button className="exercise-confirm-button" disabled={selected === null} onClick={checkAnswer}>CONFIRMAR RESPOSTA →</button>}
              <div className="exercise-modal-footer"><span>O CONTEÚDO ANTERIOR ESTÁ BLOQUEADO DURANTE O DESAFIO.</span><span>✧ AURA SYSTEM</span></div>
            </section>
          </div>
        )}

        {showKi && <KiCelebration xp={lastXpEarned} lastQuestion={questionIndex === questions.length - 1} onContinue={continueAfterKi} />}
      </div>
    )
  }

  return (
    <div className="study-world">
      <div className="study-world-topline"><button className="study-back-button" onClick={onBack}>← TODAS AS MATÉRIAS</button><span className="study-eyebrow">MUNDO 01 · SUA PRIMEIRA AVENTURA</span></div>
      <header className="world-hero">
        <div className="world-hero-text"><span className="study-eyebrow">MUNDO 01 · PROGRAMA AURA</span><h1>Estrutura de <span>Dados</span></h1><p>Explore as regiões, compreenda os fundamentos e conquiste domínio sobre as estruturas que organizam os dados.</p><div className="world-progress-label"><span>PROGRESSO DESTE MUNDO</span><strong>{lessonDone ? '1 / 9' : '0 / 9'} regiões concluídas</strong></div><div className="world-progress-track"><div style={{ width: lessonDone ? '11.11%' : '0%' }} /></div></div>
        <div className="world-hero-art"><span>🌳</span><small>O DESPERTAR DO CONHECIMENTO</small></div>
      </header>

      <div className="world-map-heading"><div><span className="study-eyebrow">SUA JORNADA DE APRENDIZADO</span><h2>Mapa das regiões</h2></div><span className="world-map-count">09 REGIÕES MAPEADAS</span></div>
      <div className="regions-grid">
        {regions.map((region, index) => {
          const unlocked = index === 0
          const completed = index === 0 && lessonDone
          return (
            <article key={region.number} className={`region-card ${unlocked ? 'unlocked' : 'locked'} ${completed ? 'region-completed' : ''}`}>
              <div className="region-card-top"><span className="region-number">REGIÃO {region.number}</span><span className="region-icon">{region.icon}</span></div>
              <h3>{region.title}</h3><p>{region.description}</p>
              <div className="region-card-bottom">{completed ? <span className="region-state completed-state">✓ CONCLUÍDA</span> : unlocked ? <span className="region-state open-state">● DISPONÍVEL</span> : <span className="region-state locked-state">🔒 BLOQUEADA</span>}{unlocked && <button onClick={openLesson}>{completed ? 'Revisar' : 'Explorar'} →</button>}</div>
            </article>
          )
        })}
      </div>
      <div className="world-guidance"><span>✧</span><div><strong>Como funciona sua progressão?</strong><p>Cada região será estudada em etapas. Primeiro você aprende a teoria, depois resolve exercícios em modo de desafio e, por fim, enfrenta questões de revisão. As próximas regiões serão liberadas conforme avançarmos pelo conteúdo.</p></div></div>
    </div>
  )
}

export default StudyWorld
