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

type Matrix = number[][];

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
    footer: "Calculatrice technique MatrixFlow © 2024 • Propulsé par AI Studio"
  }
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
            {/* Export Cards */}
            <div className="bg-surface-dark border border-border-dark rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">{t.export.title}</h3>
              
              <button 
                onClick={() => handleCopy(JSON.stringify({ A: matrixA.slice(0, rowsA).map(r => r.slice(0, colsA)), B: matrixB.slice(0, rowsB).map(r => r.slice(0, colsB)), C: resultMatrix }, null, 2), 'JSON')}
                className="w-full flex items-center justify-between p-4 bg-bg-dark/50 border border-border-dark rounded-2xl hover:bg-accent/5 hover:border-accent/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FileJson className="w-5 h-5 text-slate-400 group-hover:text-accent" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">{t.export.json}</p>
                    <p className="text-[10px] text-slate-500">{t.export.jsonDesc}</p>
                  </div>
                </div>
                {copyStatus === 'JSON' ? <Check className="w-4 h-4 text-accent" /> : <ChevronRight className="w-4 h-4 text-slate-700" />}
              </button>

              <button 
                onClick={() => {
                  if (!resultMatrix) return;
                  const latex = `\\begin{pmatrix}\n${resultMatrix.map(row => row.join(' & ')).join(' \\\\ \n')}\n\\end{pmatrix}`;
                  handleCopy(latex, 'LaTeX');
                }}
                className="w-full flex items-center justify-between p-4 bg-bg-dark/50 border border-border-dark rounded-2xl hover:bg-accent/5 hover:border-accent/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FileCode className="w-5 h-5 text-slate-400 group-hover:text-accent" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">{t.export.latex}</p>
                    <p className="text-[10px] text-slate-500">{t.export.latexDesc}</p>
                  </div>
                </div>
                {copyStatus === 'LaTeX' ? <Check className="w-4 h-4 text-accent" /> : <ChevronRight className="w-4 h-4 text-slate-700" />}
              </button>
            </div>

            {/* Lead Capture Widget */}
            <div className="bg-accent/5 border border-accent/20 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 blur-3xl rounded-full translate-x-12 -translate-y-12"></div>
              <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
                <Download className="w-4 h-4 text-accent" />
                {t.guide.title}
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                {t.guide.desc}
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder={t.guide.placeholder}
                  className="w-full bg-bg-dark border border-border-dark rounded-xl p-3 text-xs focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
                <button className="w-full bg-accent hover:bg-accent/90 text-bg-dark font-bold py-3 rounded-xl text-xs transition-transform active:scale-95 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t.guide.cta}
                </button>
              </div>
            </div>

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

            <div className="bg-surface-dark border border-border-dark p-8 rounded-3xl text-center space-y-4">
              <h3 className="text-xl font-bold">{t.educational.orderTitle}</h3>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                {t.educational.orderDesc}
              </p>
              <div className="text-accent font-bold text-lg italic mt-4">
                $AB \neq BA$
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

