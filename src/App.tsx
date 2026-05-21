/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Minus, Copy, Calculator, AlertCircle, Check,
  FileJson, FileCode, Mail, Download, Info, Zap,
  ArrowRight, ChevronRight, Lightbulb, BarChart, Cpu,
  Globe
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

type Matrix = number[][];

const generateChartData = () => {
  const data = [];
  for (let n = 2; n <= 100; n += 2) {
    const theoretical = 4.7 * Math.pow(n, Math.log2(7));
    const practical = n < 16 
      ? Math.pow(n, 3) + Math.pow(n, 2) * (n - 1)
      : Math.pow(n, Math.log2(7)) * 5.2;
    data.push({ n, theoretical, practical });
  }
  return data;
};
const chartData = generateChartData();

type Language = 'en-US' | 'pt-BR' | 'fr';

const translations: Record<Language, any> = {
  'en-US': {
    hero: {
      tag: "High-Precision Computation Engine",
      title: "MatrixFlow",
      desc: "Eliminate calculation errors with our professional-grade matrix product calculator. Real-time visual feedback, LaTeX integration, and academic-ready exports."
    },
    dimensions: {
      a: "Matrix A Dimensions",
      b: "Matrix B Dimensions",
      rows: "Rows",
      cols: "Cols",
      error: "Incompatible dimensions! Matrix A columns ({colsA}) must equal Matrix B rows ({rowsB})."
    },
    result: {
      title: "Product Result",
      viz: "Operation Visualization",
      computing: "Computing cell",
      hover: "Hover over a result cell to visualize the dot product calculation.",
      copied: "Copied {label} to clipboard!"
    },
    complexity: {
      title: "Algorithm Complexity Analysis",
      time: "Time Complexity",
      timeDesc: "Strassen's Recursive Method",
      speed: "Theoretical Speedup",
      speedDesc: "Relative to O(n³) for large n",
      padding: "Padding (n=2ᵏ)",
      paddingDesc: "Internal matrix dimension",
      dive: "Technical Deep Dive: Strassen Implementation",
      diveDesc: "For academic purposes, this engine uses Strassen's Algorithm. Unlike the standard method, it uses 7 recursive multiplications for each 2x2 submatrix, instead of 8.",
      paddingRef: "Padding Process",
      paddingRefDesc: "Since Strassen requires 2ᵏ x 2ᵏ matrices, we pad the current dimensions to the next power of 2. For your current input, we are internally operating on a matrix of:"
    },
    export: {
      title: "Export Tools",
      json: "Copy as JSON",
      jsonDesc: "Perfect for programmatic usage",
      latex: "Copy as LaTeX",
      latexDesc: "For research & publications"
    },
    guide: {
        title: "Free Study Guide",
        desc: "Unlock our exclusive Advanced Linear Algebra Cheat Sheet. Covers Matrix Properties, Eigenvalues, and Decompositions.",
        placeholder: "name@university.edu",
        cta: "Get Study Guide"
    },
    rule: {
        title: "Quick Rule",
        desc: "The inner dimensions must match for multiplication to be defined."
    },
    educational: {
        title: "Understanding Matrix Multiplication",
        compTitle: "The Compatibility Rule",
        compDesc: "For the product AB to exist, the number of columns in the first matrix (A) must be equal to the number of rows in the second matrix (B). If A is an m x n matrix and B is an n x p matrix, the resulting matrix C will have dimensions m x p.",
        dotTitle: "The Dot Product Calculation",
        dotDesc: "Each element c_{ij} of the product matrix is calculated by taking the dot product of the i-th row of A and the j-th column of B.",
        orderTitle: "Why Order Matters",
        orderDesc: "Unlike scalar multiplication, matrix multiplication is not commutative. This means that AB ≠ BA in most cases. Swapping the order can lead to entirely different results, or even make the operation undefined if dimensions no longer match."
    },
    report: {
      title: "Project Roadmap & Research Report",
      step1: "Phase 1: Classic Strassen Algorithm",
      step1Desc: "The first step of our research involved implementing the classic Strassen algorithm in Python (via Google Colab) to compare the theoretical complexity O(n^2.807) with the practical execution time across various matrix sizes.",
      codeTitle: "Google Colab Implementation (Python)",
      comparisonTitle: "Theoretical vs. Practical Complexity",
      comparisonDesc: "While the theoretical complexity of Strassen is O(n^2.807), in practice, the overhead of recursive calls, memory allocation, and hardware-level optimizations (like cache locality) often make standard algorithms faster for smaller matrices (n < 64 or 128). The practical implementation highlighted the crossover point where Strassen begins to outperform the O(n³) approach.",
      downloadNotebook: "Download Colab (.ipynb)"
    },
    footer: "MatrixFlow Technical Calculator © 2024 • Powered by AI Studio"
  },
  'pt-BR': {
    hero: {
      tag: "Motor de Computação de Alta Precisão",
      title: "MatrixFlow",
      desc: "Elimine erros de cálculo com nossa calculadora de produto matricial de nível profissional. Feedback visual em tempo real, integração com LaTeX e exportações prontas para uso acadêmico."
    },
    dimensions: {
      a: "Dimensões da Matriz A",
      b: "Dimensões da Matriz B",
      rows: "Linhas",
      cols: "Cols",
      error: "Dimensões incompatíveis! Colunas da Matriz A ({colsA}) devem ser iguais às linhas da Matriz B ({rowsB})."
    },
    result: {
      title: "Resultado do Produto",
      viz: "Visualização da Operação",
      computing: "Computando célula",
      hover: "Passe o mouse sobre uma célula do resultado para visualizar o produto escalar.",
      copied: "Copiado {label} para a área de transferência!"
    },
    complexity: {
      title: "Análise de Complexidade do Algoritmo",
      time: "Complexidade de Tempo",
      timeDesc: "Método Recursivo de Strassen",
      speed: "Aceleração Teórica",
      speedDesc: "Relativo a O(n³) para n grandes",
      padding: "Padding (n=2ᵏ)",
      paddingDesc: "Dimensão interna da matriz",
      dive: "Technical Deep Dive: Strassen Implementation",
      diveDesc: "Para fins acadêmicos, este motor utiliza o Algoritmo de Strassen. Ao contrário do método padrão, ele utiliza 7 multiplicações recursivas para cada submatriz 2x2, em vez de 8.",
      paddingRef: "Processo de Padding",
      paddingRefDesc: "Como o Strassen requer matrizes 2ᵏ x 2ᵏ, preenchemos as dimensões atuais até a próxima potência de 2. Para a sua entrada atual, estamos operando internamente em uma matriz de:"
    },
    export: {
      title: "Ferramentas de Exportação",
      json: "Copiar como JSON",
      jsonDesc: "Perfeito para uso programático",
      latex: "Copiar como LaTeX",
      latexDesc: "Para pesquisas e publicações"
    },
    guide: {
        title: "Guia de Estudo Grátis",
        desc: "Desbloqueie nosso guia exclusivo de Álgebra Linear Avançada. Cobre Propriedades de Matrizes, Autovalores e Decomposições.",
        placeholder: "nome@universidade.edu",
        cta: "Obter Guia de Estudo"
    },
    rule: {
        title: "Regra Rápida",
        desc: "As dimensões internas devem coincidir para a multiplicação ser definida."
    },
    educational: {
        title: "Entendendo a Multiplicação de Matrizes",
        compTitle: "A Regra de Compatibilidade",
        compDesc: "Para que o produto AB exista, o número de colunas da primeira matriz (A) deve ser igual ao número de linhas da segunda matriz (B). Se A é uma matriz m x n e B é uma matriz n x p, a matriz resultante C terá dimensões m x p.",
        dotTitle: "O Cálculo do Produto Escalar",
        dotDesc: "Cada elemento c_{ij} da matriz produto é calculado tirando o produto escalar da i-ésima linha de A e da j-ésima coluna de B.",
        orderTitle: "Por que a Ordem Importa",
        orderDesc: "Ao contrário da multiplicação escalar, a multiplicação de matrizes não é comutativa. Isso significa que AB ≠ BA na maioria dos casos. Trocar a ordem pode levar a resultados totalmente diferentes, ou até tornar a operação indefinida se as dimensões não coincidirem mais."
    },
    report: {
      title: "Relatório de Pesquisa & Roadmap",
      step1: "Etapa 1: Algoritmo de Strassen Clássico",
      step1Desc: "A primeira etapa do nosso trabalho envolveu a implementação do algoritmo clássico de Strassen em Python (via Google Colab) para comparar a complexidade teórica O(n^2.807) com o tempo de execução prático em vários tamanhos de matrizes.",
      codeTitle: "Implementação no Google Colab (Python)",
      comparisonTitle: "Complexidade Teórica vs. Prática",
      comparisonDesc: "Enquanto a complexidade teórica do Strassen é O(n^2.807), na prática, o custo das chamadas recursivas, alocação de memória e otimizações de hardware (como localidade de cache) frequentemente tornam algoritmos padrão mais rápidos para matrizes menores (n < 64 ou 128). A implementação prática evidenciou o ponto de cruzamento (crossover) onde o Strassen começa a superar a abordagem O(n³).",
      downloadNotebook: "Baixar Relatório (.ipynb)"
    },
    footer: "MatrixFlow Calculadora Técnica © 2024 • Powered by AI Studio"
  },
  'fr': {
    hero: {
      tag: "Moteur de calcul de haute précision",
      title: "MatrixFlow",
      desc: "Éliminez les erreurs de calcul avec notre calculatrice de produit matriciel de qualité professionnelle. Retour visuel en temps réel, intégration LaTeX et exportations prêtes pour le milieu académique."
    },
    dimensions: {
      a: "Dimensions de la matrice A",
      b: "Dimensions de la matrice B",
      rows: "Lignes",
      cols: "Colonnes",
      error: "Dimensions incompatibles ! Les colonnes de la matrice A ({colsA}) doivent être égales aux lignes de la matrice B ({rowsB})."
    },
    result: {
      title: "Résultat du produit",
      viz: "Visualisation de l'opération",
      computing: "Calcul de la cellule",
      hover: "Survolez une cellule de résultat pour visualiser le calcul du produit scalaire.",
      copied: "Copié {label} dans le presse-papier !"
    },
    complexity: {
      title: "Analyse de complexité de l'algorithme",
      time: "Complexité temporelle",
      timeDesc: "Méthode récursive de Strassen",
      speed: "Accélération théorique",
      speedDesc: "Par rapport à O(n³) pour n grands",
      padding: "Remplissage (n=2ᵏ)",
      paddingDesc: "Dimension interne de la matrice",
      dive: "Deep Dive Technique : Implémentation de Strassen",
      diveDesc: "À des fins académiques, ce moteur utilise l'algorithme de Strassen. Contrairement à la méthode standard, il utilise 7 multiplications récursives pour chaque sous-matrice 2x2, au lieu de 8.",
      paddingRef: "Processus de remplissage (Padding)",
      paddingRefDesc: "Comme Strassen nécessite des matrices 2ᵏ x 2ᵏ, nous complétons les dimensions actuelles jusqu'à la puissance de 2 suivante. Pour votre entrée actuelle, nous opérons sur une matrice de :"
    },
    export: {
      title: "Outils d'exportation",
      json: "Copier en JSON",
      jsonDesc: "Parfait pour une utilisation programmatique",
      latex: "Copier en LaTeX",
      latexDesc: "Pour la recherche et les publications"
    },
    guide: {
        title: "Guide d'étude gratuit",
        desc: "Débloquez notre guide exclusif de l'algèbre linéaire avancée. Couvre les propriétés des matrices, les valeurs propres et les décompositions.",
        placeholder: "nom@universite.edu",
        cta: "Obtenir le guide d'étude"
    },
    rule: {
        title: "Règle rapide",
        desc: "Les dimensions internes doivent correspondre pour que la multiplication soit définie."
    },
    educational: {
        title: "Comprendre la multiplication de matrices",
        compTitle: "La règle de compatibilité",
        compDesc: "Pour que le produit AB existe, le nombre de colonnes de la première matrice (A) doit être égal au nombre de lignes de la deuxième matrice (B). Si A est une matrice m x n et B est une matrice n x p, la matrice résultante C aura des dimensions m x p.",
        dotTitle: "Le calcul du produit scalaire",
        dotDesc: "Chaque élément c_{ij} do produit matriciel est calculé en effectuant le produit scalaire de la i-ème ligne de A et de la j-ème colonne de B.",
        orderTitle: "Pourquoi l'ordre compte",
        orderDesc: "Contrairement à la multiplication scalaire, la multiplication de matrices n'est pas commutative. Cela signifie que AB ≠ BA dans la plupart des cas. Changer l'ordre peut conduire à des résultats totalement différents, ou même rendre l'opération indéfinie si les dimensions ne correspondent plus."
    },
    report: {
      title: "Rapport de recherche et feuille de route",
      step1: "Étape 1: Algorithme de Strassen classique",
      step1Desc: "La première étape de notre recherche a consisté à implémenter l'algorithme de Strassen classique en Python (via Google Colab) pour comparer la complexité théorique O(n^2.807) au temps d'exécution pratique sur différentes tailles de matrices.",
      codeTitle: "Implémentation Google Colab (Python)",
      comparisonTitle: "Complexité théorique vs pratique",
      comparisonDesc: "Bien que la complexité théorique de Strassen soit O(n^2.807), en pratique, le coût des appels récursifs, de l'allocation mémoire et des optimisations matérielles (comme la localité du cache) rendent souvent les algorithmes standards plus rapides pour les petites matrices (n < 64 ou 128). L'implémentation pratique a mis en évidence le point de croisement (crossover) où Strassen commence à surpasser l'approche O(n³).",
      downloadNotebook: "Télécharger Colab (.ipynb)"
    },
    footer: "Calculatrice technique MatrixFlow © 2024 • Propulsé par AI Studio"
  }
};

const COLAB_CODE = `!pip install matplotlib

import math
import time
import random
import matplotlib.pyplot as plt

# ==========================================
# Contadores Globais de Operações
# ==========================================
ops_mult = 0
ops_add = 0

# ==========================================
# Funções Matemáticas Básicas
# ==========================================
def add_matrix(A, B):
    global ops_add
    n = len(A)
    ops_add += n * n
    return [[A[i][j] + B[i][j] for j in range(n)] for i in range(n)]

def sub_matrix(A, B):
    global ops_add
    n = len(A)
    ops_add += n * n
    return [[A[i][j] - B[i][j] for j in range(n)] for i in range(n)]

def split_matrix(A):
    n = len(A)
    mid = n // 2
    return (
        [[A[i][j] for j in range(mid)] for i in range(mid)],
        [[A[i][j] for j in range(mid, n)] for i in range(mid)],
        [[A[i][j] for j in range(mid)] for i in range(mid, n)],
        [[A[i][j] for j in range(mid, n)] for i in range(mid, n)]
    )

def merge_matrix(C11, C12, C21, C22):
    n = len(C11) * 2
    mid = n // 2
    C = [[0 for _ in range(n)] for _ in range(n)]
    for i in range(mid):
        for j in range(mid):
            C[i][j] = C11[i][j]
            C[i][j + mid] = C12[i][j]
            C[i + mid][j] = C21[i][j]
            C[i + mid][j + mid] = C22[i][j]
    return C

# ==========================================
# O Caso Base α_m,0 (Multiplicação Convencional)
# ==========================================
def alpha_m_0_multiply(A, B):
    global ops_mult, ops_add
    m = len(A)

    # Contagem exata ditada pela Fact 1 do artigo
    ops_mult += (m ** 3)
    ops_add += (m ** 2) * (m - 1)

    C = [[0] * m for _ in range(m)]
    for i in range(m):
        for j in range(m):
            for k in range(m):
                C[i][j] += A[i][k] * B[k][j]
    return C

# ==========================================
# A Recursão Híbrida α_m,k
# ==========================================
def strassen_hybrid_recursive(A, B, k):
    if k == 0:
        return alpha_m_0_multiply(A, B)

    A11, A12, A21, A22 = split_matrix(A)
    B11, B12, B21, B22 = split_matrix(B)

    I = strassen_hybrid_recursive(add_matrix(A11, A22), add_matrix(B11, B22), k - 1)
    II = strassen_hybrid_recursive(add_matrix(A21, A22), B11, k - 1)
    III = strassen_hybrid_recursive(A11, sub_matrix(B12, B22), k - 1)
    IV = strassen_hybrid_recursive(A22, sub_matrix(B21, B11), k - 1)
    V = strassen_hybrid_recursive(add_matrix(A11, A12), B22, k - 1)
    VI = strassen_hybrid_recursive(sub_matrix(A21, A11), add_matrix(B11, B12), k - 1)
    VII = strassen_hybrid_recursive(sub_matrix(A12, A22), add_matrix(B21, B22), k - 1)

    C11 = add_matrix(sub_matrix(add_matrix(I, IV), V), VII)
    C21 = add_matrix(II, IV)
    C12 = add_matrix(III, V)
    C22 = add_matrix(sub_matrix(add_matrix(I, III), II), VI)

    return merge_matrix(C11, C12, C21, C22)

# ==========================================
# Função Principal (Fact 2 do Artigo)
# ==========================================
def strassen_faithful(A, B):
    n = len(A)

    # Para matrizes menores que 16, usa o método clássico (k=0)
    if n < 16:
        k = 0
        m = n
    else:
        # Equações de "early stopping" propostas por Strassen
        k = math.floor(math.log2(n)) - 4
        m = math.floor(n * (2 ** -k)) + 1

    M = m * (2 ** k)

    # Padding
    A_pad = [[0] * M for _ in range(M)]
    B_pad = [[0] * M for _ in range(M)]
    for i in range(n):
        for j in range(n):
            A_pad[i][j] = A[i][j]
            B_pad[i][j] = B[i][j]

    # Executa a recursão
    C_pad = strassen_hybrid_recursive(A_pad, B_pad, k)

    # Remove padding
    C = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            C[i][j] = C_pad[i][j]

    return C

# ==========================================
# Plotador do Gráfico e Benchmark
# ==========================================
def run_and_plot():
    global ops_mult, ops_add

    # Vamos testar de N=2 até N=200 para gerar uma curva suave
    tamanhos = list(range(2, 201, 2))

    lista_pratica = []
    lista_teorica = []

    print("Executando o algoritmo para gerar o gráfico. Aguarde...")

    for n in tamanhos:
        ops_mult = ops_add = 0

        # Cria matrizes aleatórias
        A = [[random.random() for _ in range(n)] for _ in range(n)]
        B = [[random.random() for _ in range(n)] for _ in range(n)]

        # Executa Strassen Fiel
        strassen_faithful(A, B)
        total_pratico = ops_mult + ops_add
        lista_pratica.append(total_pratico)

        # Calcula o Limite Teórico: 4.7 * N^(log2(7))
        limite_teorico = 4.7 * (n ** math.log2(7))
        lista_teorica.append(limite_teorico)

    # --- Configuração do Gráfico (Matplotlib) ---
    plt.figure(figsize=(10, 6))

    # Plota as duas linhas
    plt.plot(tamanhos, lista_pratica, label='Operações Práticas (Híbrido)', color='blue', linewidth=2)
    plt.plot(tamanhos, lista_teorica, label='Limite Teórico (4.7 * N^2.8)', color='red', linestyle='--', linewidth=2)

    # Estilização
    plt.title('Algoritmo de Strassen: Operações Práticas vs Limite Teórico', fontsize=14)
    plt.xlabel('Tamanho da Matriz (N)', fontsize=12)
    plt.ylabel('Total de Operações Aritméticas', fontsize=12)

    # Adiciona linha vertical para marcar o ponto de quebra (N=16)
    plt.axvline(x=16, color='green', linestyle=':', label='Início da Recursão (N=16)')

    # Usa escala logarítmica no eixo Y para visualizar a diferença com mais clareza em valores altos
    plt.yscale('log')

    plt.grid(True, which="both", ls="--", alpha=0.5)
    plt.legend(fontsize=11)

    print("Gráfico gerado! Feche a janela da imagem para encerrar o programa.")
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    run_and_plot()`;

const highlightPython = (code: string) => {
  return code
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(#.*)/g, '<span class="text-slate-500">$1</span>')
    .replace(/\\b(def|import|from|global|for|in|return|if|else|while)\\b/g, '<span class="text-pink-400">$1</span>')
    .replace(/\\b(math|time|random|plt\\.[a-z_]+|np\\.[a-z_]+|add_matrix|sub_matrix|split_matrix|merge_matrix|alpha_m_0_multiply|strassen_hybrid_recursive|strassen_faithful|run_and_plot|print)\\b/g, '<span class="text-blue-400">$1</span>')
    .replace(/\\b([0-9]+\\.?[0-9]*)\\b/g, '<span class="text-purple-400">$1</span>')
    .replace(/("[^"]*")/g, '<span class="text-emerald-400">$1</span>')
    .replace(/('[^']*')/g, '<span class="text-emerald-400">$1</span>');
};

const MatrixGrid = ({ 
  matrix, 
  rows, 
  cols, 
  onChange, 
  highlightRow = -1, 
  highlightCol = -1,
  readOnly = false,
  onHover = (r: number, c: number) => {}
}: { 
  matrix: Matrix; 
  rows: number; 
  cols: number; 
  onChange?: (r: number, c: number, val: string) => void;
  highlightRow?: number;
  highlightCol?: number;
  readOnly?: boolean;
  onHover?: (r: number, c: number) => void;
}) => {
  return (
    <div 
      className="grid gap-1 p-4 bg-surface-dark/50 border border-border-dark rounded-xl backdrop-blur-sm overflow-auto max-w-full"
      style={{ 
        gridTemplateColumns: `repeat(${cols}, minmax(3rem, 1fr))`,
        maxHeight: '400px'
      }}
    >
      {Array(rows).fill(0).map((_, r) => (
        Array(cols).fill(0).map((_, c) => {
          const isHighlighted = (highlightRow === r || highlightCol === c);
          return (
            <motion.div
              key={`${r}-${c}`}
              className={`matrix-grid-cell ${isHighlighted ? 'bg-accent/20 border-accent/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : ''}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: (r * cols + c) * 0.01 }}
              onMouseEnter={() => !readOnly && onHover?.(r, c)}
              onMouseLeave={() => !readOnly && onHover?.(-1, -1)}
            >
              {readOnly ? (
                <span className={`font-mono text-xs ${isHighlighted ? 'text-accent font-bold' : 'text-slate-400'}`}>
                  {matrix[r]?.[c] ?? 0}
                </span>
              ) : (
                <input
                  type="number"
                  className="matrix-grid-input text-xs font-mono"
                  value={matrix[r]?.[c] ?? 0}
                  onChange={(e) => onChange?.(r, c, e.target.value)}
                  onFocus={() => onHover?.(r, c)}
                />
              )}
            </motion.div>
          );
        })
      ))}
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('pt-BR');
  const t = translations[lang];

  const [rowsA, setRowsA] = useState(3);
  const [colsA, setColsA] = useState(3);
  const [rowsB, setRowsB] = useState(3);
  const [colsB, setColsB] = useState(3);

  const [matrixA, setMatrixA] = useState<Matrix>(() => Array(10).fill(0).map(() => Array(10).fill(0)));
  const [matrixB, setMatrixB] = useState<Matrix>(() => Array(10).fill(0).map(() => Array(10).fill(0)));
  
  const [hoveredCell, setHoveredCell] = useState<{ r: number, c: number } | null>(null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  useEffect(() => {
    const initA = Array(10).fill(0).map(() => Array(10).fill(0).map(() => Math.floor(Math.random() * 9) + 1));
    const initB = Array(10).fill(0).map(() => Array(10).fill(0).map(() => Math.floor(Math.random() * 9) + 1));
    setMatrixA(initA);
    setMatrixB(initB);
  }, []);

  const isValid = colsA === rowsB;

  const strassen = (A: Matrix, B: Matrix): Matrix => {
    const n = A.length;
    if (n <= 1) {
      return [[A[0][0] * B[0][0]]];
    }

    const mid = n / 2;
    const a11: Matrix = [], a12: Matrix = [], a21: Matrix = [], a22: Matrix = [];
    const b11: Matrix = [], b12: Matrix = [], b21: Matrix = [], b22: Matrix = [];

    for (let i = 0; i < mid; i++) {
      a11[i] = A[i].slice(0, mid);
      a12[i] = A[i].slice(mid);
      a21[i] = A[i + mid].slice(0, mid);
      a22[i] = A[i + mid].slice(mid);
      b11[i] = B[i].slice(0, mid);
      b12[i] = B[i].slice(mid);
      b21[i] = B[i + mid].slice(0, mid);
      b22[i] = B[i + mid].slice(mid);
    }

    const add = (M1: Matrix, M2: Matrix) => M1.map((row, i) => row.map((val, j) => val + M2[i][j]));
    const sub = (M1: Matrix, M2: Matrix) => M1.map((row, i) => row.map((val, j) => val - M2[i][j]));

    const p1 = strassen(add(a11, a22), add(b11, b22));
    const p2 = strassen(add(a21, a22), b11);
    const p3 = strassen(a11, sub(b12, b22));
    const p4 = strassen(a22, sub(b21, b11));
    const p5 = strassen(add(a11, a12), b22);
    const p6 = strassen(sub(a21, a11), add(b11, b12));
    const p7 = strassen(sub(a12, a22), add(b21, b22));

    const c11 = add(sub(add(p1, p4), p5), p7);
    const c12 = add(p3, p5);
    const c21 = add(p2, p4);
    const c22 = add(add(sub(p1, p2), p3), p6);

    const res: Matrix = [];
    for (let i = 0; i < mid; i++) {
      res[i] = c11[i].concat(c12[i]);
      res[i + mid] = c21[i].concat(c22[i]);
    }
    return res;
  };

  const resultMatrix = useMemo(() => {
    if (!isValid) return null;
    
    // Resolve padding for Strassen
    const maxSize = Math.max(rowsA, colsA, colsB);
    let n = 1;
    while (n < maxSize) n *= 2;

    const paddedA: Matrix = Array(n).fill(0).map((_, r) => 
      Array(n).fill(0).map((_, c) => (r < rowsA && c < colsA) ? matrixA[r][c] : 0)
    );
    const paddedB: Matrix = Array(n).fill(0).map((_, r) => 
      Array(n).fill(0).map((_, c) => (r < rowsB && c < colsB) ? matrixB[r][c] : 0)
    );

    const fullResult = strassen(paddedA, paddedB);
    
    // Unpad
    return fullResult.slice(0, rowsA).map(row => row.slice(0, colsB));
  }, [matrixA, matrixB, rowsA, colsA, rowsB, colsB, isValid]);

  const handleCellChange = (matrix: 'A' | 'B', r: number, c: number, val: string) => {
    const numVal = val === '' ? 0 : parseFloat(val);
    if (isNaN(numVal)) return;

    if (matrix === 'A') {
      setMatrixA(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = numVal;
        return next;
      });
    } else {
      setMatrixB(prev => {
        const next = prev.map(row => [...row]);
        next[r][c] = numVal;
        return next;
      });
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(label);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const handleDownloadColab = () => {
    const notebook = {
      nbformat: 4,
      nbformat_minor: 0,
      metadata: {
        colab: { name: "strassen_matrix_multiplication.ipynb" },
        kernelspec: { name: "python3", display_name: "Python 3" }
      },
      cells: [
        {
          cell_type: "markdown",
          metadata: {},
          source: [
            "# Comparação de Complexidade: Algoritmo de Strassen\n",
            "Este notebook acompanha o relatório de pesquisa sobre produtos matriciais.\n",
            "Implementação inicial para a Etapa 1."
          ]
        },
        {
          cell_type: "code",
          metadata: {},
          execution_count: null,
          outputs: [],
          source: COLAB_CODE.split('\n').map(line => line + '\n')
        }
      ]
    };
    
    const blob = new Blob([JSON.stringify(notebook, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Strassen_Algorithm.ipynb';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setCopyStatus('Notebook');
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-accent/30 lowercase-scrollbars overflow-x-hidden">
      {/* Language Selector */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-surface-dark/80 backdrop-blur-md border border-border-dark p-1 rounded-full shadow-xl">
        {(['pt-BR', 'en-US', 'fr'] as Language[]).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
              lang === l ? 'bg-accent text-bg-dark' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {l.split('-')[0]}
          </button>
        ))}
      </div>

      {/* Hero Section */}
      <header className="relative py-16 px-6 overflow-hidden border-b border-border-dark bg-[radial-gradient(circle_at_50%_-20%,_#10b98122,_transparent_50%)]">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium mb-6 uppercase tracking-widest"
          >
            <Zap className="w-3 h-3" />
            <span>{t.hero.tag}</span>
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            Matrix<span className="text-accent italic">Flow</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            {t.hero.desc}
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Controls & Calculator */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Dimensions Control */}
            <section className="bg-surface-dark border border-border-dark p-8 rounded-3xl shadow-2xl">
              <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
                <div className="space-y-6 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t.dimensions.a}</h3>
                    <span className="text-accent font-mono text-sm">{rowsA} × {colsA}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 w-8 uppercase">{t.dimensions.rows}</span>
                      <input 
                        type="range" min="1" max="10" value={rowsA} 
                        onChange={(e) => setRowsA(parseInt(e.target.value))}
                        className="flex-1 accent-accent"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 w-8 uppercase">{t.dimensions.cols}</span>
                      <input 
                        type="range" min="1" max="10" value={colsA} 
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setColsA(val);
                          setRowsB(val); // Auto-sync to maintain validity for convenience
                        }}
                        className="flex-1 accent-accent"
                      />
                    </div>
                  </div>
                </div>

                <div className="hidden md:block">
                  <ArrowRight className="text-slate-700 w-8 h-8" />
                </div>

                <div className="space-y-6 w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t.dimensions.b}</h3>
                    <span className="text-accent font-mono text-sm">{rowsB} × {colsB}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 w-8 uppercase">{t.dimensions.rows}</span>
                      <input 
                        type="range" min="1" max="10" value={rowsB} 
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setRowsB(val);
                          setColsA(val); // Sync
                        }}
                        className="flex-1 accent-accent"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 w-8 uppercase">{t.dimensions.cols}</span>
                      <input 
                        type="range" min="1" max="10" value={colsB} 
                        onChange={(e) => setColsB(parseInt(e.target.value))}
                        className="flex-1 accent-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {!isValid && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{t.dimensions.error.replace('{colsA}', colsA.toString()).replace('{rowsB}', rowsB.toString())}</p>
                </motion.div>
              )}
            </section>

            {/* Matrix Input Grids */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2 lowercase">
                    <span className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center text-accent text-[10px]">A</span>
                    Matrix A
                  </h2>
                </div>
                <MatrixGrid 
                  matrix={matrixA} 
                  rows={rowsA} 
                  cols={colsA} 
                  onChange={(r, c, v) => handleCellChange('A', r, c, v)}
                  highlightRow={hoveredCell?.r}
                  onHover={(r, c) => setHoveredCell(prev => prev ? { ...prev, r } : null)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2 lowercase">
                    <span className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center text-accent text-[10px]">B</span>
                    Matrix B
                  </h2>
                </div>
                <MatrixGrid 
                  matrix={matrixB} 
                  rows={rowsB} 
                  cols={colsB} 
                  onChange={(r, c, v) => handleCellChange('B', r, c, v)}
                  highlightCol={hoveredCell?.c}
                  onHover={(r, c) => setHoveredCell(prev => prev ? { ...prev, c } : null)}
                />
              </div>
            </div>

            {/* Result Section */}
            {isValid && resultMatrix && (
              <section className="space-y-6">
                <div className="flex items-center justify-between border-b border-border-dark pb-4">
                  <h2 className="text-xl font-bold flex items-center gap-3 lowercase">
                    <Calculator className="text-accent" />
                    {t.result.title} <span className="opacity-30">C = A × B</span>
                  </h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopy(resultMatrix.map(r => r.join('\t')).join('\n'), t.result.title)}
                      className="p-2 bg-surface-dark border border-border-dark hover:border-accent/50 rounded-lg transition-colors group"
                    >
                      <Copy className="w-4 h-4 text-slate-500 group-hover:text-accent" />
                    </button>
                  </div>
                </div>

                <div className="bg-surface-dark p-8 rounded-3xl border border-border-dark">
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <MatrixGrid 
                      matrix={resultMatrix} 
                      rows={rowsA} 
                      cols={colsB} 
                      readOnly 
                      highlightRow={hoveredCell?.r}
                      highlightCol={hoveredCell?.c}
                      onHover={(r, c) => setHoveredCell({ r, c })}
                    />
                    
                    <div className="flex-1 space-y-4 w-full">
                      <div className="p-4 bg-bg-dark/50 rounded-2xl border border-border-dark">
                        <h4 className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-bold">{t.result.viz}</h4>
                        <div className="math-rendered text-sm">
                          {hoveredCell ? (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <p className="text-xs text-slate-400 mb-4">{t.result.computing} <span className="font-mono text-accent">C[{hoveredCell.r},{hoveredCell.c}]</span></p>
                              <InlineMath math={`C_{${hoveredCell.r},${hoveredCell.c}} = \\sum_{k=1}^{${colsA}} A_{${hoveredCell.r},k} B_{k,${hoveredCell.c}}`} />
                              <div className="mt-4 text-slate-500 font-mono text-[10px] flex flex-wrap gap-1">
                                {Array(colsA).fill(0).map((_, k) => (
                                  <span key={k}>
                                    ({matrixA[hoveredCell.r][k]} × {matrixB[k][hoveredCell.c]})
                                    {k < colsA - 1 ? ' + ' : ''}
                                  </span>
                                ))} = <span className="text-accent font-bold">{resultMatrix[hoveredCell.r][hoveredCell.c]}</span>
                              </div>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-500 italic">{t.result.hover}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Complexity Analysis */}
            <section className="bg-gradient-to-br from-surface-dark to-bg-dark border border-border-dark p-8 rounded-3xl space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <BarChart className="text-accent w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold lowercase">{t.complexity.title}</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { 
                    label: t.complexity.time, 
                    value: "O(n²·⁸⁰⁷)", 
                    desc: t.complexity.timeDesc,
                    icon: Cpu
                  },
                  { 
                    label: t.complexity.speed, 
                    value: "~12.5%", 
                    desc: t.complexity.speedDesc,
                    icon: Zap
                  },
                  { 
                    label: t.complexity.padding, 
                    value: `${(() => {
                      const ms = Math.max(rowsA, colsA, colsB);
                      let n = 1;
                      while (n < ms) n *= 2;
                      return `${n}x${n}`;
                    })()}`, 
                    desc: t.complexity.paddingDesc,
                    icon: Download
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-6 bg-surface-dark border border-border-dark rounded-2xl space-y-2 group hover:border-accent/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{item.label}</p>
                      <item.icon className="w-4 h-4 text-slate-700 group-hover:text-accent transition-colors" />
                    </div>
                    <p className="text-2xl font-mono font-bold text-white">{item.value}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-bg-dark/50 rounded-2xl border border-border-dark">
                <h3 className="text-sm font-semibold text-slate-300 mb-4 lowercase">{t.complexity.dive}</h3>
                <div className="grid md:grid-cols-2 gap-8 text-sm text-slate-400 leading-relaxed">
                  <div className="space-y-4">
                    <p>
                      {t.complexity.diveDesc}
                    </p>
                    <div className="p-3 bg-bg-dark rounded-xl border border-border-dark font-mono text-accent text-center text-xs">
                      T(n) = 7T(n/2) + O(n²) ⟹ O(n^{2.807})
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase font-bold text-slate-500">{t.complexity.paddingRef}</h4>
                    <p className="text-[11px] leading-relaxed">
                      {t.complexity.paddingRefDesc}
                    </p>
                    <div className="math-rendered bg-bg-dark rounded-xl border border-border-dark p-2 text-center text-accent font-bold">
                      {(() => {
                        const ms = Math.max(rowsA, colsA, colsB);
                        let n = 1;
                        while (n < ms) n *= 2;
                        return `${n} \times ${n}`;
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Tools & Conversions */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Educational Tooltip */}
            <div className="bg-surface-dark border border-border-dark rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{t.rule.title}</h3>
              </div>
              <div className="math-rendered text-sm text-slate-300">
                <BlockMath math="(m \times n) \times (n \times p) = (m \times p)" />
                <p className="text-[10px] text-slate-500 mt-2 italic text-center">{t.rule.desc}</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Project Roadmap / Research Report */}
        <section className="mt-24 border-t border-border-dark pt-16">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">{t.report.title}</h2>
              <div className="h-1 w-12 bg-accent mx-auto rounded-full"></div>
            </div>

            <div className="bg-surface-dark border border-border-dark rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full translate-x-16 -translate-y-16"></div>
              
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm">1</span>
                {t.report.step1}
              </h3>
              
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                {t.report.step1Desc}
              </p>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-slate-500" />
                      <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold">{t.report.codeTitle}</h4>
                    </div>
                    <button 
                      onClick={handleDownloadColab}
                      className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent font-semibold text-[10px] uppercase tracking-wider rounded-lg transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      {t.report.downloadNotebook}
                    </button>
                  </div>
                  <div className="bg-bg-dark border border-border-dark rounded-xl p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
                    <pre className="text-[12px] font-mono leading-relaxed text-slate-300 whitespace-pre-wrap">
                      <code dangerouslySetInnerHTML={{__html: highlightPython(COLAB_CODE)}} />
                    </pre>
                  </div>
                </div>

                <div className="bg-bg-dark border border-border-dark p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-2xl rounded-full translate-x-12 -translate-y-12"></div>
                  <h4 className="text-sm font-bold text-accent mb-3 flex items-center gap-2">
                    <BarChart className="w-4 h-4" />
                    {t.report.comparisonTitle}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {t.report.comparisonDesc}
                  </p>

                  <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="n" stroke="#94a3b8" fontSize={12} tickMargin={10} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => val > 1000 ? (val/1000).toFixed(1) + 'k' : val} />
                        <RechartsTooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                          itemStyle={{ color: '#e2e8f0' }}
                          formatter={(value, name) => [Math.floor(Number(value) || 0).toLocaleString(), name]}
                          labelFormatter={(label) => `N = ${label}`}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                        <Line type="monotone" dataKey="practical" name={lang === 'pt-BR' ? "Operações Práticas" : "Practical Ops"} stroke="#3b82f6" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="theoretical" name={lang === 'pt-BR' ? "Limite Teórico" : "Theoretical Limit"} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO / Educational Footer Content */}
        <section className="mt-24 border-t border-border-dark pt-16">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">{t.educational.title}</h2>
              <div className="h-1 w-12 bg-accent mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  {t.educational.compTitle}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t.educational.compDesc}
                </p>
                <div className="p-4 bg-bg-dark border border-border-dark rounded-xl">
                  <InlineMath math="A_{m \times \mathbf{n}} \cdot B_{\mathbf{n} \times p} = C_{m \times p}" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  {t.educational.dotTitle}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t.educational.dotDesc}
                </p>
                <div className="p-4 bg-bg-dark border border-border-dark rounded-xl overflow-x-auto">
                  <InlineMath math="c_{ij} = a_{i1}b_{1j} + a_{i2}b_{2j} + \dots + a_{in}b_{nj}" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border-dark text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-bold">
          {t.footer}
        </p>
      </footer>

      {/* Global Success Indicator */}
      <AnimatePresence>
        {copyStatus && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-accent text-bg-dark font-bold rounded-full shadow-2xl flex items-center gap-2 z-50 transition-all"
          >
            <Check className="w-4 h-4" />
            <span className="text-sm">{t.result.copied.replace('{label}', copyStatus)}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

