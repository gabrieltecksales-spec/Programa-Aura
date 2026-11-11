import { useEffect, useMemo, useState } from 'react'
import './StudyWorld.css'

type StudyWorldProps = {
  onEarnXp: (points: number) => void
  onBack: () => void
}

type Question = {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

type LessonSection = {
  title: string
  intro: string
  bullets?: string[]
  example?: string
  code?: string
  warning?: string
}

type Lesson = {
  id: number
  number: string
  title: string
  shortTitle: string
  description: string
  icon: string
  summary: string
  sections: LessonSection[]
  questions: Question[]
}

const lessons: Lesson[] = [
  {
    id: 1,
    number: '01',
    title: 'Árvores',
    shortTitle: 'Árvores',
    description: 'Raiz, nós, subárvores, relações, caminhos, níveis e altura.',
    icon: '🌳',
    summary: 'Entenda como os dados podem ser organizados hierarquicamente e como analisar as relações entre os nós.',
    sections: [
      {
        title: 'O que é uma árvore?',
        intro: 'Uma árvore é um conjunto finito de elementos chamados nós. Ela pode ser vazia. Quando não está vazia, possui um nó especial chamado raiz; os demais nós formam subárvores da raiz. Pense em uma árvore genealógica ou nas pastas do computador: um elemento pode conter outros elementos abaixo dele.',
        bullets: ['Nó: cada elemento da estrutura.', 'Raiz: nó especial que inicia a árvore.', 'Subárvore: árvore formada por um nó e seus descendentes.', 'Floresta: conjunto de árvores.', 'Rótulo: identificador associado a um nó, como a, b ou c.'],
        example: 'Na árvore do slide, a é a raiz; b e c são filhos de a; d, e e f estão abaixo de b; g, h e i aparecem no nível seguinte.'
      },
      {
        title: 'Relações entre os nós',
        intro: 'As ligações entre os nós recebem nomes semelhantes aos de uma família. Um nó pode ser pai de outro, e dois nós que compartilham o mesmo pai são irmãos.',
        bullets: ['Pai: nó imediatamente acima de outro.', 'Filho: nó imediatamente abaixo de seu pai.', 'Irmãos: nós que possuem o mesmo pai.', 'Tio: irmão do pai de um nó.', 'Avô: pai do pai de um nó.', 'Ancestral: nó que aparece acima de outro; descendente: nó que aparece abaixo.'],
        example: 'Se a é pai de b e c, então b e c são irmãos. Se d é filho de b, então a é avô de d.'
      },
      {
        title: 'Folhas e nós interiores',
        intro: 'A classificação depende de o nó possuir filhos ou não.',
        bullets: ['Folha: nó que não possui filhos.', 'Nó interior: nó que possui pelo menos um filho.'],
        example: 'No desenho da aula, c, g, h e i são folhas. a, b, d, e e f são nós interiores.'
      },
      {
        title: 'Caminho, nível e altura',
        intro: 'Caminho é uma sequência de nós distintos em que cada par consecutivo está ligado por uma relação de pai e filho. O comprimento do caminho é k − 1, sendo k a quantidade de nós. O nível conta quantos nós existem no caminho da raiz até o nó. A altura conta quantos nós existem no maior caminho do nó até um descendente.',
        bullets: ['Nível da raiz: 1.', 'Nível de b: 2, pois o caminho a → b possui dois nós.', 'Nível de f: 3, pois o caminho a → b → f possui três nós.', 'Altura de uma folha: 1.', 'Altura da árvore: altura da raiz.'],
        warning: 'Atenção à convenção usada nos slides: o professor conta NÓS, não arestas. Por isso, a raiz tem nível 1 e uma folha tem altura 1.',
        example: 'O caminho c → a → b → e é válido. Na árvore do exemplo, o maior caminho descendente tem quatro nós; portanto, a altura da árvore é 4.'
      },
      {
        title: 'Árvore ordenada e notação em parênteses',
        intro: 'Uma árvore ordenada é aquela em que os filhos de cada nó possuem uma ordem definida. A convenção do material é da esquerda para a direita. Uma árvore também pode ser descrita por uma sequência de parênteses aninhados.',
        example: '(a(b(d)(e))(c(f))) representa uma árvore com raiz a, filhos b e c, e descendentes descritos dentro dos parênteses.'
      },
      {
        title: 'Árvores e expressões aritméticas',
        intro: 'Expressões aritméticas podem ser representadas como árvores. Os operadores aparecem como nós e os operandos aparecem em posições subordinadas. Essa representação ajuda a visualizar a ordem em que a expressão deve ser computada.',
        example: 'Na expressão x + y * (w / r - t), a árvore representa as operações e deixa explícito que divisão e subtração fazem parte do ramo multiplicado por y.'
      }
    ],
    questions: [
      { id: 'arvores-01', question: 'Qual é a principal característica de uma árvore?', options: ['É uma sequência em que todos os elementos ficam em uma única linha.', 'É um conjunto finito de nós organizado a partir de uma raiz e suas subárvores.', 'É uma tabela formada somente por linhas e colunas.', 'É uma estrutura que não permite relações entre elementos.'], correct: 1, explanation: 'A árvore é um conjunto finito de nós. Quando não está vazia, possui uma raiz e suas subárvores.' },
      { id: 'arvores-02', question: 'O que é uma floresta?', options: ['Um conjunto de árvores.', 'Um único nó sem filhos.', 'Uma árvore sem raiz.', 'Um caminho entre dois nós.'], correct: 0, explanation: 'O material define floresta como um conjunto de árvores.' },
      { id: 'arvores-03', question: 'Quando um nó é considerado uma folha?', options: ['Quando possui muitos filhos.', 'Quando está obrigatoriamente na raiz.', 'Quando não possui filhos.', 'Quando possui dois irmãos.'], correct: 2, explanation: 'Folha é o nó que não possui filhos.' },
      { id: 'arvores-04', question: 'Se a é pai de b e c, como b e c são chamados entre si?', options: ['Avô e neto.', 'Pai e filho.', 'Tio e sobrinho.', 'Irmãos.'], correct: 3, explanation: 'Nós que possuem o mesmo pai são irmãos.' },
      { id: 'arvores-05', question: 'De acordo com a convenção do professor, qual é o nível da raiz?', options: ['Nível 0.', 'Nível 1.', 'Nível 2.', 'Nível 3.'], correct: 1, explanation: 'O caminho da raiz até ela mesma possui um nó. Portanto, o nível da raiz é 1.' },
      { id: 'arvores-06', question: 'Se o caminho da raiz a até f é a → b → f, qual é o nível de f?', options: ['1.', '2.', '3.', '4.'], correct: 2, explanation: 'O caminho possui três nós: a, b e f. Logo, nível 3.' },
      { id: 'arvores-07', question: 'Qual é a altura de c quando c não possui filhos?', options: ['0.', '1.', '2.', '3.'], correct: 1, explanation: 'Como c é folha, o maior caminho até um descendente contém apenas o próprio nó: altura 1.' },
      { id: 'arvores-08', question: 'O maior caminho da raiz até uma folha é a → b → d → g. Qual é a altura da árvore?', options: ['1.', '2.', '3.', '4.'], correct: 3, explanation: 'Esse caminho contém quatro nós. A altura da árvore é 4.' },
      { id: 'arvores-09', question: 'O que caracteriza uma árvore ordenada segundo a aula?', options: ['Todos os nós precisam ter exatamente dois filhos.', 'Os filhos de cada nó possuem uma ordem, seguindo a convenção da esquerda para a direita.', 'A raiz precisa ser sempre o último elemento.', 'As folhas precisam ficar na mesma altura.'], correct: 1, explanation: 'A árvore ordenada define uma ordem para os filhos de cada nó; no slide, da esquerda para a direita.' },
      { id: 'arvores-10', question: 'Qual sequência foi apresentada como um caminho válido no slide?', options: ['c → a → b → e', 'c → d → g → a', 'g → e → c → i', 'a → g → c → b'], correct: 0, explanation: 'O slide mostra c, a, b, e como caminho válido; cada par consecutivo está ligado por pai/filho.' }
    ]
  },
  {
    id: 2, number: '02', title: 'Algoritmos e sequências', shortTitle: 'Algoritmos e sequências', description: 'Entrada, saída, dados, vetores, matrizes, registros, funções e iterações.', icon: '📜', summary: 'Revise os elementos usados para representar dados e descrever soluções passo a passo.',
    sections: [
      { title: 'O conceito de algoritmo', intro: 'Um algoritmo é um processo sistemático para resolver um problema. Ele recebe uma entrada, executa etapas e produz uma saída. Dois pontos fundamentais no estudo de algoritmos são correção e análise.', bullets: ['Entrada: dados fornecidos ao algoritmo.', 'Processamento: sequência de passos que resolve o problema.', 'Saída: resultado produzido.', 'Correção: verificar se o algoritmo resolve o problema como esperado.', 'Análise: estudar o comportamento e o custo do algoritmo.'], example: 'Entrada → Algoritmo → Saída. Exemplo: receber dois números, somá-los e mostrar o resultado.' },
      { title: 'Dados e estruturas', intro: 'As entradas e saídas são constituídas por dados. O algoritmo precisa representar e manipular esses dados.', bullets: ['Variável simples: guarda um valor, como a, i ou j.', 'Vetor: sequência indexada, por exemplo x[i]. O índice identifica a posição.', 'Matriz: estrutura com linhas e colunas, por exemplo x[i][j].', 'Registro: conjunto de campos nomeados que representam dados relacionados.', 'Ponteiro: guarda um endereço; pt->info representa o campo info do registro apontado por pt.'], example: 'Um registro de aluno pode ter os campos nome, matrícula e nota. Cada campo possui um nome que o identifica.' },
      { title: 'Funções e parâmetros', intro: 'Uma função é chamada pelo seu nome e pode receber parâmetros. Os parâmetros permitem enviar informações para a função e, conforme a definição, receber resultados.', code: 'minhaFuncao(B)\n// B representa o(s) parâmetro(s) recebido(s) pela função.', example: 'Uma função soma(a, b) recebe dois parâmetros e pode devolver a + b.' },
      { title: 'Declarações de iteração e parada', intro: 'Iterações permitem repetir um bloco de instruções. O material apresenta três formas principais.', bullets: ['enquanto condição faça bloco: repete enquanto a condição for verdadeira.', 'para variável = início até fim faça bloco: repete em uma faixa de valores.', 'repetir bloco até condição: executa o bloco e verifica a condição ao final.', 'pare: interrompe explicitamente a execução. A parada também pode ocorrer implicitamente.'], code: 'enquanto i < 5 faça\n    i = i + 1\n\npara i = 1 até n faça\n    escreva(i)\n\nrepetir\n    i = i + 1\naté que i == 5' },
      { title: 'Piso, teto e inversão de sequência', intro: 'Piso de x é o maior inteiro menor ou igual a x. Teto de x é o menor inteiro maior ou igual a x.', bullets: ['⌊3,2⌋ = 3.', '⌈3,2⌉ = 4.', 'Para inverter um vetor, troque o primeiro elemento com o último, o segundo com o penúltimo e assim por diante.', 'Só é necessário percorrer até a metade do vetor.'], code: 'para i = 0 até ⌊n/2⌋ - 1 faça\n    temp = S[i]\n    S[i] = S[n - 1 - i]\n    S[n - 1 - i] = temp', example: 'Vetor inicial: [2, 5, 1, 3, 4]. Após as trocas: [4, 3, 1, 5, 2]. A variável temp guarda temporariamente um valor para a troca não perder dados.' }
    ],
    questions: [
      { id: 'algseq-01', question: 'Qual é o fluxo básico apresentado para um algoritmo?', options: ['Saída → Entrada → Algoritmo.', 'Entrada → Algoritmo → Saída.', 'Algoritmo → Saída → Entrada.', 'Entrada → Saída → Memória.'], correct: 1, explanation: 'O algoritmo recebe dados de entrada, processa e produz uma saída.' },
      { id: 'algseq-02', question: 'Em x[i], o que representa i?', options: ['A quantidade de vetores.', 'A posição do elemento no vetor.', 'O conteúdo de toda a matriz.', 'O endereço do programa.'], correct: 1, explanation: 'O índice i identifica a posição do elemento no vetor.' },
      { id: 'algseq-03', question: 'Qual estrutura organiza dados em linhas e colunas?', options: ['Variável simples.', 'Vetor.', 'Matriz.', 'Função.'], correct: 2, explanation: 'A matriz utiliza índices para linha e coluna.' },
      { id: 'algseq-04', question: 'Qual é a diferença entre “enquanto” e “repetir...até”?', options: ['São sempre idênticos.', '“Enquanto” verifica antes de executar; “repetir...até” verifica depois do bloco.', '“Repetir...até” nunca repete.', '“Enquanto” só funciona com vetores.'], correct: 1, explanation: 'No enquanto a condição é verificada antes de cada execução; no repetir...até, o bloco é executado antes da verificação.' },
      { id: 'algseq-05', question: 'Para inverter um vetor com n elementos, quantas posições aproximadamente precisam ser percorridas?', options: ['n².', 'n/2.', '2ⁿ.', 'n!'], correct: 1, explanation: 'Cada troca resolve um par de posições simétricas; basta percorrer aproximadamente metade do vetor.' }
    ]
  },
  {
    id: 3, number: '03', title: 'Complexidade de algoritmos', shortTitle: 'Complexidade', description: 'Métodos empíricos e analíticos, passos, operação dominante e casos.', icon: '⌛', summary: 'Aprenda a estimar o custo do algoritmo pelo tamanho da entrada, contando operações relevantes.',
    sections: [
      { title: 'Por que analisar a complexidade?', intro: 'Uma característica importante de qualquer algoritmo é seu tempo de execução. Podemos estudá-lo medindo execuções reais ou construindo uma expressão matemática que descreva seu comportamento.', bullets: ['Método empírico: mede o tempo de execução; depende do computador, linguagem, compilador, dados e ambiente.', 'Método analítico: estima o comportamento por meio de uma expressão matemática; é independente do computador específico.', 'A análise considera o tamanho da entrada como variável.'], example: 'O mesmo programa pode levar tempos diferentes em máquinas diferentes, mas sua quantidade de operações em função de n pode ser analisada matematicamente.' },
      { title: 'Passos e operação dominante', intro: 'A execução pode ser dividida em passos elementares. A operação básica que aparece com maior frequência é chamada de operação dominante.', bullets: ['Conte quantas vezes a operação dominante é executada.', 'Desconsidere constantes aditivas e multiplicativas para comparar o crescimento.', '3n² + 5n − 7 e 12n² + 11n + 32 têm o mesmo comportamento dominante: n².'], example: 'Um laço que executa n vezes tem crescimento linear. Dois laços aninhados, cada um repetindo n vezes, executam aproximadamente n × n = n² iterações.' },
      { title: 'Exemplos dos slides: inversão e matrizes', intro: 'O professor usa a inversão de sequência e operações com matrizes para contar passos.', bullets: ['Inversão de vetor: o bloco de troca executa n/2 vezes; o crescimento é linear.', 'Soma de duas matrizes n × n: dois laços aninhados; n² operações.', 'Multiplicação de duas matrizes n × n: três laços aninhados; n³ operações.', 'Para matrizes A(n × m) e B(m × p), a soma compatível custa n × m e o produto custa n × m × p.'], code: 'Soma n × n:\nfor i = 0 até n-1\n  for j = 0 até n-1\n    C[i][j] = A[i][j] + B[i][j]\n\nProduto n × n:\nfor i = 0 até n-1\n  for j = 0 até n-1\n    for k = 0 até n-1\n      D[i][j] += A[i][k] * B[k][j]' },
      { title: 'Melhor, pior e caso médio', intro: 'O custo pode variar conforme a entrada recebida. Por isso, distinguimos três formas de analisar o algoritmo.', bullets: ['Pior caso: máximo número de passos entre as entradas possíveis.', 'Melhor caso: mínimo número de passos entre as entradas possíveis.', 'Caso médio: média ponderada dos custos, considerando a probabilidade de cada entrada.'], example: 'Em uma busca, encontrar o item logo na primeira posição pode ser o melhor caso; encontrá-lo no fim ou não encontrá-lo pode ser o pior caso, dependendo do algoritmo.' }
    ],
    questions: [
      { id: 'complex-01', question: 'Qual é a característica do método empírico?', options: ['Conta somente fórmulas, sem executar o programa.', 'Mede o tempo real e depende do ambiente de execução.', 'É independente de computador e linguagem.', 'Sempre fornece o pior caso exato.'], correct: 1, explanation: 'O método empírico mede execuções reais e depende de hardware, linguagem, compilador, dados e ambiente.' },
      { id: 'complex-02', question: 'O que é a operação dominante?', options: ['A operação que aparece com maior frequência na execução.', 'A primeira linha do código.', 'A operação que usa mais memória sempre.', 'A última instrução executada.'], correct: 0, explanation: 'A operação básica de maior frequência é usada como referência para contar passos.' },
      { id: 'complex-03', question: 'A soma de duas matrizes n × n, usando dois laços aninhados, possui quantos passos proporcionais?', options: ['n.', 'n².', 'n³.', '2ⁿ.'], correct: 1, explanation: 'O laço externo executa n vezes e o interno n vezes: n × n = n².' },
      { id: 'complex-04', question: 'A multiplicação convencional de duas matrizes n × n, usando três laços, possui complexidade proporcional a:', options: ['n.', 'n².', 'n³.', 'n⁴.'], correct: 2, explanation: 'Três laços de n iterações resultam em n × n × n = n³.' },
      { id: 'complex-05', question: 'O caso médio considera:', options: ['Somente a entrada mais rápida.', 'Somente a entrada mais lenta.', 'A média ponderada dos custos pelas probabilidades das entradas.', 'A quantidade de linhas do programa.'], correct: 2, explanation: 'O caso médio soma os custos de cada entrada multiplicados por suas probabilidades.' }
    ]
  },
  {
    id: 4, number: '04', title: 'Notação Big O e recursividade', shortTitle: 'Big O e recursividade', description: 'Comportamento assintótico, limite superior e chamadas recursivas.', icon: '∞', summary: 'Compare o crescimento dos algoritmos e entenda como analisar uma função que chama a si mesma.',
    sections: [
      { title: 'O que é Big O?', intro: 'A notação O descreve um limite superior assintótico para o crescimento de uma função. Dizemos que f(n) = O(g(n)) quando existem constantes c > 0 e n₀ tais que, para n ≥ n₀, f(n) ≤ c · g(n).', bullets: ['Observe o comportamento quando n cresce muito.', 'Ignore constantes multiplicativas e termos de menor crescimento.', 'O termo dominante determina a classe assintótica.'], example: '8n + 128 é O(n²), mas sua ordem mais justa é O(n). Já 3n² + 5n − 7 é O(n²).' },
      { title: 'Como simplificar expressões', intro: 'Para encontrar a ordem, identifique o termo que cresce mais rapidamente e desconsidere os fatores constantes.', bullets: ['6n³ → O(n³).', 'n² + 2 log n → O(n²).', '6.547.326 → O(1), pois é constante.', '5n⁷ + 3·2ⁿ + n! → O(n!), pois o fatorial domina os termos apresentados.', '3n + 7m + 2 → O(n + m).'], warning: 'Não confunda O(n²) com “n ao quadrado de tempo exato”. Big O descreve uma classe de crescimento, não um cronômetro preciso.' },
      { title: 'Recursividade', intro: 'Um procedimento recursivo contém uma ou mais chamadas a si mesmo. A versão recursiva costuma ser mais concisa e possui relação com a prova por indução matemática.', bullets: ['Caso base: situação que encerra a recursão.', 'Passo recursivo: reduz o problema e chama a função novamente.', 'Sem caso base alcançável, a recursão pode continuar indefinidamente.'], code: 'int fatorial(int n) {\n  if (n == 0 || n == 1) return 1; // caso base\n  return n * fatorial(n - 1);    // chamada recursiva\n}' },
      { title: 'Analisando o fatorial recursivo', intro: 'Para n > 1, a função chama fatorial(n − 1). O número de chamadas cresce proporcionalmente a n.', bullets: ['T(0) = 1, considerando o caso base.', 'T(n) = T(n − 1) + 1, para n > 0.', 'Expandindo: T(n) = T(n − k) + k.', 'Quando k = n, chegamos ao caso base; T(n) = n + 1.', 'Portanto, o número de chamadas cresce linearmente: O(n).'], example: 'fatorial(4) chama fatorial(3), depois fatorial(2), depois fatorial(1), que retorna 1. As chamadas retornam multiplicando 2 × 1, 3 × 2 e 4 × 6.' }
    ],
    questions: [
      { id: 'bigo-01', question: 'O que a notação Big O representa?', options: ['O tempo exato em segundos.', 'Um limite superior assintótico para o crescimento.', 'A quantidade de variáveis do programa.', 'Somente o uso de memória.'], correct: 1, explanation: 'Big O descreve um limite superior assintótico do crescimento em função do tamanho da entrada.' },
      { id: 'bigo-02', question: 'Qual é a ordem de 3n² + 5n − 7?', options: ['O(1).', 'O(n).', 'O(n²).', 'O(n³).'], correct: 2, explanation: 'O termo n² domina os termos n e constante.' },
      { id: 'bigo-03', question: 'Qual é a ordem assintótica de uma constante, como 6.547.326?', options: ['O(1).', 'O(log n).', 'O(n).', 'O(n²).'], correct: 0, explanation: 'Uma expressão constante não cresce com n: O(1).' },
      { id: 'bigo-04', question: 'Qual é o papel do caso base em uma função recursiva?', options: ['Aumentar o tamanho do problema.', 'Encerrar a recursão em uma condição conhecida.', 'Chamar a função mais uma vez sem alterar os dados.', 'Ordenar o vetor automaticamente.'], correct: 1, explanation: 'O caso base é a condição de parada que impede chamadas recursivas indefinidas.' },
      { id: 'bigo-05', question: 'O fatorial recursivo que chama fatorial(n − 1) até chegar a 1 possui crescimento de chamadas de qual ordem?', options: ['O(1).', 'O(log n).', 'O(n).', 'O(n²).'], correct: 2, explanation: 'Há aproximadamente uma chamada para cada valor de n até chegar ao caso base, portanto O(n).' }
    ]
  },
  {
    id: 5, number: '05', title: 'Indução matemática', shortTitle: 'Indução matemática', description: 'Sequências, termos, fórmulas explícitas, passo base e passo indutivo.', icon: '🔮', summary: 'Aprenda o método usado para demonstrar que uma afirmação é verdadeira para todos os inteiros de um conjunto.',
    sections: [
      { title: 'Sequências: termos e índices', intro: 'Uma sequência é uma lista ordenada de termos. Cada elemento é chamado termo, e seu índice ou subscrito indica a posição ocupada.', bullets: ['a₁ é o primeiro termo; a₃ é o terceiro termo.', 'Sequência finita: possui quantidade limitada de termos.', 'Sequência infinita: possui infinitos termos.', 'Fórmula explícita: regra que permite obter o termo a partir do índice.'], example: 'Na sequência 2, 4, 8, 16, 32..., o termo dobra a cada passo. O índice indica a geração do termo.' },
      { title: 'Fórmulas explícitas', intro: 'Uma mesma sequência pode ser representada por fórmulas diferentes. O importante é que a regra gere os mesmos termos nas posições correspondentes.', bullets: ['Sequência alternante: cⱼ = (−1)ʲ, para j ≥ 0.', 'Os valores dessa sequência alternante são −1 e 1.', 'Uma sequência pode ser descrita por uma regra direta ou por uma recorrência, dependendo do problema.'] },
      { title: 'Princípio da indução matemática', intro: 'A indução é uma técnica de demonstração. A analogia clássica é uma fileira de dominós: derrubar o primeiro e provar que cada dominó derruba o próximo garante que todos cairão.', bullets: ['Passo base: prove que P(n₀) é verdadeira para o primeiro valor.', 'Passo indutivo: suponha P(k) verdadeira para um k arbitrário com k ≥ n₀.', 'Com essa hipótese, prove que P(k + 1) também é verdadeira.', 'Conclusão: P(n) vale para todos os inteiros n ≥ n₀.'], warning: 'Atenção: no passo indutivo você NÃO assume que P(k) é verdadeira para todos os valores. Assume apenas para um k arbitrário e prova a passagem para k + 1.' },
      { title: 'Modelo de prova', intro: 'Uma prova por indução precisa deixar visíveis a hipótese e a conclusão. Não pule o passo base nem use o que deseja provar como se já estivesse demonstrado.', code: '1) Base: verificar P(n₀).\n2) Hipótese indutiva: supor P(k) verdadeira.\n3) Passo: usando P(k), demonstrar P(k + 1).\n4) Conclusão: P(n) é verdadeira para todo n ≥ n₀.', example: 'Exemplo ilustrativo: para provar uma fórmula de soma, primeiro verifique o menor n; depois suponha a fórmula válida até k e use essa hipótese para demonstrá-la em k + 1.' }
    ],
    questions: [
      { id: 'inducao-01', question: 'O que representa o índice em um termo como a₃?', options: ['O valor do termo.', 'A posição do termo na sequência.', 'A quantidade de sequências.', 'A soma de todos os termos.'], correct: 1, explanation: 'O subscrito 3 indica que a₃ ocupa a terceira posição.' },
      { id: 'inducao-02', question: 'O que é uma sequência finita?', options: ['Uma sequência que não tem primeiro termo.', 'Uma sequência com quantidade limitada de termos.', 'Uma sequência que só possui valores negativos.', 'Uma sequência que repete sempre o mesmo número.'], correct: 1, explanation: 'Sequência finita possui um conjunto limitado de termos.' },
      { id: 'inducao-03', question: 'Qual é o primeiro passo obrigatório de uma prova por indução?', options: ['Passo base.', 'Passo recursivo.', 'Multiplicação de matrizes.', 'Análise do pior caso.'], correct: 0, explanation: 'Primeiro demonstramos P(n₀), o caso inicial.' },
      { id: 'inducao-04', question: 'No passo indutivo, o que devemos fazer?', options: ['Assumir P(k) verdadeira para todos os inteiros sem provar.', 'Supor P(k) para um k arbitrário e provar P(k + 1).', 'Provar apenas P(0).', 'Substituir k por n².'], correct: 1, explanation: 'A hipótese indutiva assume P(k) para um k arbitrário e a demonstração deve chegar a P(k+1).' },
      { id: 'inducao-05', question: 'A analogia dos dominós representa qual ideia?', options: ['Uma operação de pilha.', 'O passo base derruba o primeiro e o passo indutivo garante a queda do próximo.', 'A ordenação de uma árvore.', 'O pior caso de um algoritmo.'], correct: 1, explanation: 'Base: primeiro dominó cai. Indutivo: cada dominó derruba o seguinte.' }
    ]
  },
  {
    id: 6, number: '06', title: 'Listas lineares e pilhas', shortTitle: 'Listas e pilhas', description: 'Listas lineares, alocação sequencial, LIFO, push, pop, top, overflow e underflow.', icon: '📚', summary: 'Entenda listas lineares e domine a pilha, estrutura em que o último elemento inserido é o primeiro a sair.',
    sections: [
      { title: 'Lista linear', intro: 'Uma lista linear é um conjunto ordenado de n elementos x₁, x₂, ..., xₙ. A propriedade estrutural está na posição relativa dos elementos.', bullets: ['x₁ é o primeiro elemento.', 'Para 1 < k < n, xₖ é precedido por xₖ₋₁ e seguido por xₖ₊₁.', 'xₙ é o último elemento.', 'Podemos acessar, inserir, remover, ordenar, combinar, dividir ou copiar listas.'], example: 'A lista [A, B, C, D] é linear porque existe uma ordem: A antes de B, B antes de C e C antes de D.' },
      { title: 'Alocação sequencial', intro: 'A maneira mais simples de manter uma lista linear é usar um vetor. Como o espaço pode ser reservado previamente, inserções e remoções costumam ser simuladas por variáveis de controle e deslocamentos.', bullets: ['O vetor reserva posições contíguas.', 'Uma variável pode indicar quantos elementos estão ocupados.', 'Inserir ou remover pode exigir ajustar posições ou o limite lógico da estrutura.'] },
      { title: 'Pilha: LIFO', intro: 'Na pilha, todas as inserções e remoções acontecem na mesma extremidade, chamada topo. Por isso, o último elemento que entra é o primeiro a sair: LIFO (Last In, First Out).', bullets: ['Push: insere no topo.', 'Pop: remove do topo.', 'Top: consulta o elemento do topo sem removê-lo.', 'Clear: apaga todos os elementos.', 'Empty: verifica se está vazia.'], example: 'Pense em pratos empilhados: você coloca e retira pratos pelo topo. O último prato colocado é o primeiro retirado.' },
      { title: 'Overflow, underflow e pré/pós-condições', intro: 'As operações precisam verificar se podem ser executadas antes de alterar a pilha.', bullets: ['Overflow: tentativa de inserir em uma pilha cheia.', 'Underflow: tentativa de remover de uma pilha vazia.', 'Push: pré-condição — pilha não cheia; pós-condição — elemento foi inserido.', 'Pop: pré-condição — pilha não vazia; pós-condição — elemento foi removido.', 'Top: exige pilha não vazia.', 'Empty: informa se a pilha está vazia.'], code: 'push(x): se não estiver cheia, topo = topo + 1 e P[topo] = x\npop(): se não estiver vazia, retorna P[topo] e diminui topo' },
      { title: 'Simulação de operações', intro: 'Para resolver uma sequência de inserções (I) e remoções (R), simule cada operação na ordem. Lembre-se de que R sempre remove o elemento que está no topo.', example: 'I(A), I(B), I(C), R → a pilha fica [A, B] e o elemento removido é C. Depois de I(D), fica [A, B, D].' }
    ],
    questions: [
      { id: 'pilha-01', question: 'O que define uma lista linear?', options: ['Elementos sem qualquer relação.', 'Elementos organizados em uma sequência com primeiro e último.', 'Somente elementos em árvore.', 'Elementos sempre ordenados numericamente.'], correct: 1, explanation: 'Lista linear possui uma sequência ordenada e relações de predecessor e sucessor.' },
      { id: 'pilha-02', question: 'Qual é a regra de funcionamento de uma pilha?', options: ['FIFO.', 'LIFO.', 'Aleatória.', 'Menor primeiro.'], correct: 1, explanation: 'LIFO: Last In, First Out — o último que entra é o primeiro que sai.' },
      { id: 'pilha-03', question: 'Qual operação insere um elemento no topo?', options: ['Pop.', 'Top.', 'Push.', 'Clear.'], correct: 2, explanation: 'Push insere um elemento na pilha pelo topo.' },
      { id: 'pilha-04', question: 'O que é underflow em uma pilha?', options: ['Inserir em uma pilha cheia.', 'Remover de uma pilha vazia.', 'Consultar o topo.', 'Apagar uma pilha.'], correct: 1, explanation: 'Underflow ocorre ao tentar remover um elemento de uma pilha vazia.' },
      { id: 'pilha-05', question: 'Após I(A), I(B), I(C), R, qual é o conteúdo da pilha?', options: ['[B, C].', '[A, B].', '[A, C].', '[C].'], correct: 1, explanation: 'A, B e C entram nessa ordem; R remove C. Restam A e B.' }
    ]
  },
  {
    id: 7, number: '07', title: 'Listas sequenciais e filas', shortTitle: 'Listas sequenciais e filas', description: 'FIFO, enqueue, dequeue, frente, retaguarda, fila linear e circular.', icon: '🏛️', summary: 'Aprenda a fila, suas operações e o motivo de uma fila circular reaproveitar melhor o vetor.',
    sections: [
      { title: 'Fila: FIFO', intro: 'Fila é uma estrutura sequencial e ordenada em que as inserções ocorrem em uma extremidade e as remoções na outra. A regra é FIFO (First In, First Out): o primeiro a entrar é o primeiro a sair.', bullets: ['Frente/início: extremidade de onde ocorre a remoção.', 'Retaguarda/fim: extremidade em que ocorre a inserção.', 'Os elementos mantêm a ordem de chegada.'], example: 'Pense em uma fila de atendimento: quem chega primeiro deve ser atendido primeiro.' },
      { title: 'Operações de fila', intro: 'A fila possui operações para inserir, remover, consultar e verificar o estado da estrutura.', bullets: ['Enqueue: enfileirar/inserir na retaguarda.', 'Dequeue: desenfileirar/remover pela frente.', 'Size: retorna a quantidade de elementos.', 'Head: operação de consulta apresentada nos materiais; confira a convenção exata usada pelo professor na implementação.', 'Empty: verifica se a fila está vazia.'], warning: 'No raciocínio FIFO, a remoção acontece pelo início/frente e a inserção pelo fim/retaguarda. Não confunda com a pilha, que insere e remove pelo mesmo lado.' },
      { title: 'Fila linear em vetor', intro: 'Uma implementação pode usar um vetor e dois índices: f para o início/frente e r para o fim/retaguarda. Nos slides, a fila vazia é representada por f = r = 0.', bullets: ['Na inserção, r é incrementado.', 'Na remoção, f é incrementado, se a fila não estiver vazia.', 'Inserir em uma fila cheia gera overflow.', 'Remover de uma fila vazia gera underflow.', 'Para a fila linear representada nos slides, a quantidade pode ser calculada por n = |r − f| + 1 quando f ≠ 0, conforme a convenção de índices usada.'] },
      { title: 'Por que usar fila circular?', intro: 'Em uma fila linear, os índices podem avançar para a direita e deixar posições livres no começo do vetor sem que sejam reaproveitadas. Isso pode produzir um falso overflow.', bullets: ['A fila circular considera o vetor como um círculo.', 'Depois da última posição, o índice volta para a primeira.', 'A frente e a retaguarda podem circular pelo vetor.', 'A estrutura só está cheia quando não existe posição livre segundo a regra de controle.'], example: 'Com vetor de tamanho M, um avanço circular costuma usar a operação (índice + 1) % M, adaptando o índice inicial escolhido.' }
    ],
    questions: [
      { id: 'fila-01', question: 'Qual é a regra principal de uma fila?', options: ['LIFO.', 'FIFO.', 'Acesso apenas ao meio.', 'Remoção aleatória.'], correct: 1, explanation: 'FIFO significa First In, First Out: primeiro a entrar, primeiro a sair.' },
      { id: 'fila-02', question: 'Em uma fila convencional, onde ocorre a inserção?', options: ['Na frente/início.', 'No meio.', 'Na retaguarda/fim.', 'Em qualquer posição.'], correct: 2, explanation: 'Enqueue insere na retaguarda, enquanto dequeue remove pela frente.' },
      { id: 'fila-03', question: 'Qual operação remove o elemento da frente?', options: ['Enqueue.', 'Dequeue.', 'Size.', 'Empty.'], correct: 1, explanation: 'Dequeue desenfileira e remove pela frente da fila.' },
      { id: 'fila-04', question: 'O que é o falso overflow em uma fila linear?', options: ['A fila ficou vazia.', 'Ainda há posições livres no começo, mas os índices avançaram e a inserção parece impossível.', 'A fila foi ordenada.', 'A fila possui elementos duplicados.'], correct: 1, explanation: 'A fila linear pode desperdiçar posições liberadas no começo; a fila circular resolve esse reaproveitamento.' },
      { id: 'fila-05', question: 'Qual é a principal vantagem da fila circular?', options: ['Transforma FIFO em LIFO.', 'Permite reaproveitar posições do vetor ao circular os índices.', 'Não precisa controlar início e fim.', 'Impede underflow.'], correct: 1, explanation: 'A fila circular reaproveita as posições do vetor, fazendo os índices retornarem ao início.' }
    ]
  },
  {
    id: 8, number: '08', title: 'Fila dupla (Deque)', shortTitle: 'Deque', description: 'Inserção e remoção nas duas extremidades, restrições e palíndromos.', icon: '⚖️', summary: 'Entenda a estrutura que permite inserir e remover elementos tanto pelo início quanto pelo fim.',
    sections: [
      { title: 'O que é um deque?', intro: 'Deque (double-ended queue ou fila dupla) é uma lista em que inserções e remoções podem ocorrer nas duas extremidades. Nesse caso, os conceitos de topo da pilha e de início/fim da fila convencional não descrevem sozinhos toda a operação.', bullets: ['É possível inserir em qualquer uma das duas extremidades.', 'É possível remover em qualquer uma das duas extremidades.', 'O material descreve alocação sequencial com vetor e um ponteiro para cada extremidade.'] },
      { title: 'Deques com restrição', intro: 'Existem variações em que uma das operações fica limitada a uma extremidade.', bullets: ['Deque de entrada restrita: a inserção só ocorre em uma das extremidades; remoções podem ocorrer nas duas.', 'Deque de saída restrita: a remoção só ocorre em uma das extremidades; inserções podem ocorrer nas duas.'] },
      { title: 'Extremidades, overflow e underflow', intro: 'O deque controla duas extremidades. Assim como outras estruturas com capacidade fixa, existem condições de erro.', bullets: ['Deque vazio: uma remoção não é possível e pode gerar underflow.', 'Deque cheio: uma inserção não é possível e pode gerar overflow.', 'O controle usa as duas extremidades do vetor.'] },
      { title: 'Aplicação: verificar palíndromos', intro: 'Palíndromo é uma palavra, frase ou número que permanece igual quando lido de trás para frente. O deque é útil porque permite comparar e remover caracteres pelas duas pontas.', bullets: ['Coloque os caracteres no deque.', 'Compare o primeiro com o último.', 'Se forem diferentes, não é palíndromo.', 'Se forem iguais, remova ambos e continue até restar zero ou um caractere.'], example: '“radar” é palíndromo: r = r, a = a e sobra d no centro. “casa” não é: c ≠ a.' }
    ],
    questions: [
      { id: 'deque-01', question: 'O que diferencia um deque de uma fila convencional?', options: ['Deque não permite remoção.', 'Deque permite inserção e remoção nas duas extremidades.', 'Deque só insere no meio.', 'Deque funciona obrigatoriamente em LIFO.'], correct: 1, explanation: 'Deque permite operar tanto pela extremidade 1 quanto pela extremidade 2.' },
      { id: 'deque-02', question: 'O que é um deque de entrada restrita?', options: ['Inserção permitida somente em uma extremidade.', 'Remoção permitida somente em uma extremidade.', 'Inserção proibida.', 'Somente consulta ao centro.'], correct: 0, explanation: 'Entrada restrita limita as inserções a uma das extremidades.' },
      { id: 'deque-03', question: 'O que é um deque de saída restrita?', options: ['Inserção somente no início.', 'Remoção somente em uma das extremidades.', 'Remoção proibida.', 'Fila que não possui vetor.'], correct: 1, explanation: 'Saída restrita limita as remoções a uma das extremidades.' },
      { id: 'deque-04', question: 'Qual erro ocorre ao tentar remover de um deque vazio?', options: ['Overflow.', 'Underflow.', 'Recursão.', 'Colisão.'], correct: 1, explanation: 'Underflow ocorre quando tentamos remover de uma estrutura vazia.' },
      { id: 'deque-05', question: 'Como um deque ajuda a verificar um palíndromo?', options: ['Compara apenas o caractere central.', 'Compara caracteres das duas extremidades, removendo pares iguais.', 'Ordena letras alfabeticamente.', 'Conta somente vogais.'], correct: 1, explanation: 'Comparando as duas pontas sucessivamente, verificamos se a leitura inversa mantém a mesma sequência.' }
    ]
  },
  {
    id: 9, number: '09', title: 'Heap e fila de prioridades', shortTitle: 'Heap e prioridades', description: 'Árvore binária completa, chave/prioridade, subir e descer elementos.', icon: '💎', summary: 'Aprenda a propriedade de heap máximo e como a prioridade sobe ou desce na árvore.',
    sections: [
      { title: 'Fila de prioridades', intro: 'Em uma fila de prioridades, cada elemento possui uma prioridade, geralmente representada por uma chave numérica. A remoção seleciona o elemento de maior ou menor prioridade, conforme a convenção adotada.', bullets: ['A chave representa a prioridade do elemento.', 'A prioridade pode ser alterada.', 'Além de selecionar, inserir e remover, existe operação de alteração de prioridade.'] },
      { title: 'O que é um Heap?', intro: 'Nos slides desta disciplina, o heap é uma árvore binária completa ou quase completa, preenchida da esquerda para a direita, representada também como uma lista linear de valores numéricos.', bullets: ['Os nós são numerados por níveis, da esquerda para a direita.', 'Na representação de vetor com índice iniciado em 1: o pai de i fica em ⌊i/2⌋.', 'Os filhos de i ficam em 2i e 2i + 1.', 'Para o heap máximo apresentado pelo professor, cada filho possui chave menor ou igual à chave do pai: S[i] ≤ S[⌊i/2⌋].'], example: 'Exemplo de heap máximo: [95, 60, 78, 39, 28, 66, 70, 33]. O 95 fica na raiz e cada pai tem prioridade maior ou igual à de seus filhos.' },
      { title: 'Aumentar prioridade: subir', intro: 'Quando a chave de um nó aumenta, ele pode ficar maior que o pai. Para restaurar a propriedade do heap máximo, trocamos o nó com seu pai enquanto a chave do nó for maior.', bullets: ['Localize o pai: j = ⌊i/2⌋.', 'Se T[i] > T[j], troque os elementos.', 'Repita a partir da nova posição até a propriedade ser respeitada ou chegar à raiz.'], code: 'j = i / 2\nse j >= 1 e T[i] > T[j]:\n    trocar(T[i], T[j])\n    subir(T, j)' },
      { title: 'Diminuir prioridade: descer', intro: 'Quando a chave de um nó diminui, um dos filhos pode ficar maior que ele. Para restaurar o heap máximo, escolha o maior filho e troque enquanto ele possuir chave maior.', bullets: ['Encontre os filhos: 2i e 2i + 1.', 'Escolha o filho com maior chave.', 'Se o filho escolhido for maior que o nó atual, troque.', 'Continue descendo até a propriedade ficar válida.'], code: 'j = 2 * i\nenquanto j <= n:\n    se existir filho direito e T[j+1] > T[j]: j = j + 1\n    se T[i] < T[j]: trocar(T[i], T[j])\n    senão: parar' },
      { title: 'Como verificar um heap máximo?', intro: 'Percorra os nós e confira se nenhum filho é maior que o seu pai. Uma única violação já faz a lista deixar de ser heap máximo.', example: 'Para cada índice i > 1, compare T[i] com T[⌊i/2⌋]. Se algum T[i] for maior que o pai, a propriedade do heap máximo foi violada.' }
    ],
    questions: [
      { id: 'heap-01', question: 'O que é um heap segundo a aula?', options: ['Uma lista aleatória sem relação entre elementos.', 'Uma árvore binária completa ou quase completa, representável por lista linear.', 'Uma pilha que funciona em FIFO.', 'Uma matriz quadrada.'], correct: 1, explanation: 'O material define o heap como árvore binária completa ou quase completa, preenchida da esquerda para a direita.' },
      { id: 'heap-02', question: 'No heap máximo da disciplina, qual relação deve valer entre filho e pai?', options: ['Filho sempre maior que o pai.', 'Filho menor ou igual ao pai.', 'Filho sempre igual ao pai.', 'Não existe relação entre as chaves.'], correct: 1, explanation: 'A propriedade apresentada é S[i] ≤ S[⌊i/2⌋]: o pai tem chave maior ou igual à do filho.' },
      { id: 'heap-03', question: 'Em um vetor de heap com índice começando em 1, qual é o índice do pai do nó i?', options: ['2i.', '2i + 1.', '⌊i/2⌋.', 'i + 1.'], correct: 2, explanation: 'O pai do nó i fica na posição floor(i/2).' },
      { id: 'heap-04', question: 'Ao aumentar a prioridade de um nó em um heap máximo, qual operação pode ser necessária?', options: ['Descer o nó até a última posição.', 'Subir o nó, trocando com o pai quando for maior.', 'Apagar a raiz.', 'Transformar em fila circular.'], correct: 1, explanation: 'A prioridade aumentou; o nó pode precisar subir para restaurar a propriedade de heap máximo.' },
      { id: 'heap-05', question: 'Ao diminuir a prioridade de um nó, como restaurar o heap máximo?', options: ['Subir trocando com o pai.', 'Descer, trocando com o maior filho quando ele for maior.', 'Ordenar todos os elementos em ordem crescente.', 'Remover todos os filhos.'], correct: 1, explanation: 'Ao diminuir a chave, um filho pode ficar maior; o nó desce trocando com o maior filho.' }
    ]
  }
]

function TreeDiagram() {
  const nodes = [
    { id: 'a', x: 320, y: 48 }, { id: 'b', x: 200, y: 142 }, { id: 'c', x: 440, y: 142 },
    { id: 'd', x: 110, y: 240 }, { id: 'e', x: 200, y: 240 }, { id: 'f', x: 290, y: 240 },
    { id: 'g', x: 110, y: 338 }, { id: 'h', x: 200, y: 338 }, { id: 'i', x: 290, y: 338 }
  ]
  const connections = [['a', 'b'], ['a', 'c'], ['b', 'd'], ['b', 'e'], ['b', 'f'], ['d', 'g'], ['e', 'h'], ['f', 'i']]
  const getNode = (id: string) => nodes.find((node) => node.id === id)!
  return (
    <svg className="tree-diagram" viewBox="0 0 640 385" role="img" aria-label="Árvore com raiz a e nós descendentes b, c, d, e, f, g, h e i.">
      {connections.map(([parent, child]) => {
        const start = getNode(parent); const end = getNode(child)
        return <line key={`${parent}-${child}`} x1={start.x} y1={start.y + 21} x2={end.x} y2={end.y - 21} className="tree-connection" />
      })}
      {nodes.map((node) => <g key={node.id}><circle cx={node.x} cy={node.y} r="22" className={`tree-node ${node.id === 'a' ? 'tree-root' : ''}`} /><text x={node.x} y={node.y + 6} textAnchor="middle" className="tree-node-label">{node.id}</text></g>)}
    </svg>
  )
}

function KiCelebration({ xp, onContinue, lastQuestion }: { xp: number; onContinue: () => void; lastQuestion: boolean }) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 2300)
    return () => window.clearTimeout(timer)
  }, [])
  return (
    <div className="ki-celebration" data-ki-ready={ready} role="dialog" aria-modal="true" aria-label="Exercício concluído">
      <div className="ki-energy-ring ki-ring-one" /><div className="ki-energy-ring ki-ring-two" /><div className="ki-energy-ring ki-ring-three" />
      <div className="ki-lightning ki-lightning-left" /><div className="ki-lightning ki-lightning-right" />
      <div className="ki-celebration-content">
        <span className="ki-kicker">AURA SYSTEM · POWER UP</span>
        <div className="ki-warrior-scene" aria-hidden="true">
          <div className="ki-aura-flame ki-flame-one" /><div className="ki-aura-flame ki-flame-two" /><div className="ki-aura-core" />
          <img className="ki-goku-image" src="/characters/goku-powerup.png" alt="Goku carregando energia" />
          <div className="ki-power-orb">気</div>
        </div>
        <span className="ki-overline">RESPOSTA CORRETA!</span>
        <h2>SEU KI <span>AUMENTOU!</span></h2>
        <div className="ki-reward">{xp > 0 ? `+${xp} XP` : 'REVISÃO CONCLUÍDA'}</div>
        <p>{xp > 0 ? 'Você dominou mais um conceito. Sua energia e seu conhecimento evoluíram.' : 'Você acertou novamente. A experiência desta questão já tinha sido contabilizada.'}</p>
        <button className="ki-continue-button" onClick={onContinue} disabled={!ready}>{ready ? (lastQuestion ? 'FINALIZAR AULA' : 'PRÓXIMA QUESTÃO →') : 'CARREGANDO KI...'}</button>
      </div>
    </div>
  )
}

function StudyWorld({ onEarnXp, onBack }: StudyWorldProps) {
  const [selectedLessonId, setSelectedLessonId] = useState(1)
  const [view, setView] = useState<'map' | 'lesson'>('map')
  const [exerciseOpen, setExerciseOpen] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [showKi, setShowKi] = useState(false)
  const [lastXpEarned, setLastXpEarned] = useState(0)
  const [completedIds, setCompletedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('aura-ed-completed-lessons')
      const ids = saved ? JSON.parse(saved) as number[] : []
      if (localStorage.getItem('aura-aula-1-concluida') === 'true' && !ids.includes(1)) ids.push(1)
      return ids
    } catch {
      return localStorage.getItem('aura-aula-1-concluida') === 'true' ? [1] : []
    }
  })

  const lesson = useMemo(() => lessons.find((item) => item.id === selectedLessonId) ?? lessons[0], [selectedLessonId])
  const currentQuestion = lesson.questions[questionIndex]
  const earnedCount = lesson.questions.filter((question) => localStorage.getItem(`aura-xp-${question.id}`) === 'true').length

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

  function openLesson(lessonId: number) {
    setSelectedLessonId(lessonId)
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
    if (selected === null || !currentQuestion) return
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

  function finishLesson() {
    localStorage.setItem(`aura-aula-${lesson.id}-concluida`, 'true')
    if (lesson.id === 1) localStorage.setItem('aura-aula-1-concluida', 'true')
    setCompletedIds((current) => {
      const next = current.includes(lesson.id) ? current : [...current, lesson.id]
      localStorage.setItem('aura-ed-completed-lessons', JSON.stringify(next))
      return next
    })
    setExerciseOpen(false)
    setShowKi(false)
    setView('map')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function continueAfterKi() {
    setShowKi(false)
    if (questionIndex === lesson.questions.length - 1) {
      finishLesson()
      return
    }
    setQuestionIndex((current) => current + 1)
    setSelected(null)
    setFeedback(null)
  }

  function abandonExercise() {
    const confirmed = window.confirm('Deseja sair do desafio? Os XP já conquistados serão mantidos. Você poderá retomar o treino desde a primeira questão.')
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
        <div className="study-breadcrumb"><button onClick={onBack}>Matérias</button><span>/</span><button onClick={() => setView('map')}>Estrutura de Dados</button><span>/</span><strong>Aula {lesson.number} · {lesson.title}</strong></div>
        <header className="lesson-hero">
          <div className="lesson-hero-text">
            <span className="study-eyebrow">REGIÃO {lesson.number} · AULA {lesson.number}</span>
            <h1>{lesson.icon} {lesson.title}</h1>
            <p>{lesson.summary}</p>
            <div className="lesson-tags"><span>✦ MATERIAL DO PROFESSOR</span><span>📖 REVISÃO DETALHADA</span><span>⚔ {lesson.questions.length} QUESTÕES</span></div>
          </div>
          <div className="lesson-hero-symbol">{lesson.icon}</div>
        </header>

        {lesson.sections.map((section, index) => (
          <section className="lesson-section-card" key={`${lesson.id}-${section.title}`}>
            <div className="study-section-heading"><span className="study-step">{String(index + 1).padStart(2, '0')}</span><div><span className="study-eyebrow">AULA {lesson.number} · PARTE {index + 1}</span><h2>{section.title}</h2></div></div>
            <p>{section.intro}</p>
            {section.bullets && <ul className="study-bullet-list">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
            {section.code && <pre className="study-code-block"><code>{section.code}</code></pre>}
            {section.example && <div className="study-example"><strong>EXEMPLO / APLICAÇÃO</strong><p>{section.example}</p></div>}
            {section.warning && <div className="study-callout important-callout"><span>⚠</span><div><strong>ATENÇÃO PARA A PROVA</strong><p>{section.warning}</p></div></div>}
            {lesson.id === 1 && index === 0 && <div className="tree-visual-panel"><div className="tree-visual-heading"><span>REPRESENTAÇÃO DE UMA ÁRVORE</span><span className="tree-visual-badge">EXEMPLO DA AULA</span></div><TreeDiagram /><div className="tree-legend"><span><i className="legend-root" />Raiz</span><span><i className="legend-branch" />Nós intermediários</span><span><i className="legend-leaf" />Folhas</span></div></div>}
          </section>
        ))}

        <section className="lesson-challenge-intro">
          <div><span className="study-eyebrow">REVISÃO ATIVA · AULA {lesson.number}</span><h2>Teste o que você aprendeu.</h2><p>{lesson.questions.length} questões de múltipla escolha. Você precisa acertar cada uma para avançar. Respostas erradas permitem nova tentativa e não retiram XP.</p></div>
          <div className="challenge-reward"><strong>+{lesson.questions.length * 5} XP</strong><span>RECOMPENSA MÁXIMA</span></div>
          <div className="lesson-challenge-meta"><span>{earnedCount}/{lesson.questions.length} questões já recompensadas</span><span>{completedIds.includes(lesson.id) ? '✓ AULA CONCLUÍDA · PODE REVISAR' : 'AULA EM ANDAMENTO'}</span></div>
          <button className="study-primary-button" onClick={openExercise}>{completedIds.includes(lesson.id) ? 'REVISAR DESAFIO' : 'INICIAR DESAFIO'} ⚔</button>
          {completedIds.includes(lesson.id) && <span className="lesson-completed-chip">✓ AULA CONCLUÍDA</span>}
        </section>

        {exerciseOpen && (
          <div className="study-exercise-backdrop" role="presentation">
            <section className="study-exercise-modal" role="dialog" aria-modal="true" aria-labelledby="exercise-title">
              <div className="exercise-modal-header"><div><span className="study-eyebrow">MODO DE DESAFIO · AULA {lesson.number}</span><h2 id="exercise-title">{lesson.title}</h2></div><button className="exercise-exit" onClick={abandonExercise}>SAIR DO DESAFIO ×</button></div>
              <div className="exercise-progress-line"><div style={{ width: `${((questionIndex + 1) / lesson.questions.length) * 100}%` }} /></div>
              <div className="exercise-meta"><span>QUESTÃO {String(questionIndex + 1).padStart(2, '0')} / {lesson.questions.length}</span><span>+5 XP POR ACERTO</span></div>
              <h3 className="exercise-question">{currentQuestion.question}</h3>
              <div className="exercise-options">{currentQuestion.options.map((option, index) => <button key={option} className={`exercise-option ${selected === index ? 'chosen' : ''} ${feedback === 'wrong' && selected === index ? 'option-wrong' : ''} ${feedback === 'correct' && index === currentQuestion.correct ? 'option-correct' : ''}`} disabled={feedback !== null} onClick={() => setSelected(index)}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}</div>
              {feedback === 'wrong' && <div className="exercise-feedback wrong-feedback"><strong>RESPOSTA INCORRETA</strong><p>Revise o conceito e tente novamente. Você não perde XP por errar.</p><button onClick={retryQuestion}>TENTAR NOVAMENTE</button></div>}
              {feedback === 'correct' && <div className="exercise-feedback right-feedback"><strong>RESPOSTA CORRETA</strong><p>{currentQuestion.explanation}</p></div>}
              {feedback === null && <button className="exercise-confirm-button" disabled={selected === null} onClick={checkAnswer}>CONFIRMAR RESPOSTA →</button>}
              <div className="exercise-modal-footer"><span>O CONTEÚDO ANTERIOR FICA BLOQUEADO DURANTE O DESAFIO.</span><span>✧ AURA SYSTEM</span></div>
            </section>
          </div>
        )}
        {showKi && <KiCelebration xp={lastXpEarned} lastQuestion={questionIndex === lesson.questions.length - 1} onContinue={continueAfterKi} />}
      </div>
    )
  }

  const totalQuestions = lessons.reduce((sum, item) => sum + item.questions.length, 0)
  const totalEarned = lessons.reduce((sum, item) => sum + item.questions.filter((question) => localStorage.getItem(`aura-xp-${question.id}`) === 'true').length, 0)
  const totalCompleted = completedIds.length

  return (
    <div className="study-world">
      <div className="study-world-topline"><button className="study-back-button" onClick={onBack}>← TODAS AS MATÉRIAS</button><span className="study-eyebrow">MUNDO 01 · ESTRUTURA DE DADOS</span></div>
      <header className="world-hero">
        <div className="world-hero-text"><span className="study-eyebrow">MUNDO 01 · PROGRAMA AURA</span><h1>Estrutura de <span>Dados</span></h1><p>As nove aulas estão liberadas para sua revisão. Estude a teoria, pratique e enfrente os desafios antes da prova.</p><div className="world-progress-label"><span>PROGRESSO DA MATÉRIA</span><strong>{totalCompleted} / 9 aulas concluídas</strong></div><div className="world-progress-track"><div style={{ width: `${(totalCompleted / lessons.length) * 100}%` }} /></div></div>
        <div className="world-hero-art"><span>🌳</span><small>REVISÃO PARA A PROVA</small></div>
      </header>

      <div className="world-map-heading"><div><span className="study-eyebrow">TRILHA COMPLETA · AULAS 01–09</span><h2>Mapa de aprendizado</h2></div><span className="world-map-count">{lessons.length} AULAS DISPONÍVEIS</span></div>
      <div className="study-exam-summary"><div><strong>{totalQuestions}</strong><span>QUESTÕES NA TRILHA</span></div><div><strong>{totalEarned}</strong><span>ACERTOS RECOMPENSADOS</span></div><div><strong>{totalCompleted}/9</strong><span>AULAS CONCLUÍDAS</span></div><div><strong>{(totalQuestions - totalEarned) * 5}</strong><span>XP AINDA DISPONÍVEL</span></div></div>
      <div className="regions-grid">
        {lessons.map((region) => {
          const completed = completedIds.includes(region.id)
          const answered = region.questions.filter((question) => localStorage.getItem(`aura-xp-${question.id}`) === 'true').length
          return (
            <article key={region.number} className={`region-card unlocked ${completed ? 'region-completed' : ''}`}>
              <div className="region-card-top"><span className="region-number">AULA {region.number}</span><span className="region-icon">{region.icon}</span></div>
              <h3>{region.title}</h3><p>{region.description}</p>
              <div className="region-mini-progress"><div style={{ width: `${(answered / region.questions.length) * 100}%` }} /></div>
              <div className="region-card-bottom"><span className={`region-state ${completed ? 'completed-state' : 'open-state'}`}>{completed ? '✓ CONCLUÍDA' : `● ${answered}/${region.questions.length} ACERTOS`}</span><button onClick={() => openLesson(region.id)}>{completed ? 'Revisar' : 'Estudar'} →</button></div>
            </article>
          )
        })}
      </div>
      <div className="world-guidance"><span>✧</span><div><strong>As nove aulas estão abertas para a sua prova.</strong><p>Você pode estudar em qualquer ordem. Cada questão correta concede 5 XP apenas na primeira vez. Se errar, leia a explicação e tente novamente; se acertar uma questão que já tinha sido recompensada, a animação de Ki aparece sem duplicar o XP.</p></div></div>
    </div>
  )
}

export default StudyWorld
