/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Minus, Copy, Calculator, AlertCircle, Check,
  FileJson, FileCode, Mail, Download, Info, Zap,
  ArrowRight, ChevronRight, Lightbulb
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

type Matrix = number[][];

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

  const resultMatrix = useMemo(() => {
    if (!isValid) return null;
    const res: Matrix = Array(rowsA).fill(0).map(() => Array(colsB).fill(0));
    for (let i = 0; i < rowsA; i++) {
      for (let j = 0; j < colsB; j++) {
        let sum = 0;
        for (let k = 0; k < colsA; k++) {
          sum += (matrixA[i]?.[k] ?? 0) * (matrixB[k]?.[j] ?? 0);
        }
        res[i][j] = sum;
      }
    }
    return res;
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
      {/* Hero Section */}
      <header className="relative py-16 px-6 overflow-hidden border-b border-border-dark bg-[radial-gradient(circle_at_50%_-20%,_#10b98122,_transparent_50%)]">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium mb-6 uppercase tracking-widest"
          >
            <Zap className="w-3 h-3" />
            <span>High-Precision Computation Engine</span>
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-bold tracking-tighter text-white mb-6">
            Matrix<span className="text-accent italic">Flow</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Eliminate calculation errors with our professional-grade matrix product calculator. 
            Real-time visual feedback, LaTeX integration, and academic-ready exports.
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
                    <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Matrix A Dimensions</h3>
                    <span className="text-accent font-mono text-sm">{rowsA} × {colsA}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 w-8 uppercase">Rows</span>
                      <input 
                        type="range" min="1" max="10" value={rowsA} 
                        onChange={(e) => setRowsA(parseInt(e.target.value))}
                        className="flex-1 accent-accent"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 w-8 uppercase">Cols</span>
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
                    <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Matrix B Dimensions</h3>
                    <span className="text-accent font-mono text-sm">{rowsB} × {colsB}</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] text-slate-500 w-8 uppercase">Rows</span>
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
                      <span className="text-[10px] text-slate-500 w-8 uppercase">Cols</span>
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
                  <p>Incompatible dimensions! Matrix A columns ({colsA}) must equal Matrix B rows ({rowsB}).</p>
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
                    Product Result <span className="opacity-30">C = A × B</span>
                  </h2>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopy(resultMatrix.map(r => r.join('\t')).join('\n'), 'Result')}
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
                        <h4 className="text-[10px] uppercase tracking-widest text-slate-500 mb-2 font-bold">Operation Visualization</h4>
                        <div className="math-rendered text-sm">
                          {hoveredCell ? (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <p className="text-xs text-slate-400 mb-4">Computing cell <span className="font-mono text-accent">C[{hoveredCell.r},{hoveredCell.c}]</span></p>
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
                            <p className="text-xs text-slate-500 italic">Hover over a result cell to visualize the dot product calculation.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Tools & Conversions */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Export Cards */}
            <div className="bg-surface-dark border border-border-dark rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Export Tools</h3>
              
              <button 
                onClick={() => handleCopy(JSON.stringify({ A: matrixA.slice(0, rowsA).map(r => r.slice(0, colsA)), B: matrixB.slice(0, rowsB).map(r => r.slice(0, colsB)), C: resultMatrix }, null, 2), 'JSON')}
                className="w-full flex items-center justify-between p-4 bg-bg-dark/50 border border-border-dark rounded-2xl hover:bg-accent/5 hover:border-accent/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <FileJson className="w-5 h-5 text-slate-400 group-hover:text-accent" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">Copy as JSON</p>
                    <p className="text-[10px] text-slate-500">Perfect for programmatic usage</p>
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
                    <p className="text-sm font-semibold">Copy as LaTeX</p>
                    <p className="text-[10px] text-slate-500">For research & publications</p>
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
                Free Cheat Sheet
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Unlock our exclusive <strong>Advanced Linear Algebra Cheat Sheet</strong>. Covers Matrix Properties, Eigenvalues, and Decompositions.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="name@university.edu"
                  className="w-full bg-bg-dark border border-border-dark rounded-xl p-3 text-xs focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                />
                <button className="w-full bg-accent hover:bg-accent/90 text-bg-dark font-bold py-3 rounded-xl text-xs transition-transform active:scale-95 flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Get Cheat Sheet
                </button>
              </div>
            </div>

            {/* Educational Tooltip */}
            <div className="bg-surface-dark border border-border-dark rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-slate-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Quick Rule</h3>
              </div>
              <div className="math-rendered text-sm text-slate-300">
                <BlockMath math="(m \times n) \times (n \times p) = (m \times p)" />
                <p className="text-[10px] text-slate-500 mt-2 italic text-center">The inner dimensions must match for multiplication to be defined.</p>
              </div>
            </div>
          </aside>
        </div>

        {/* SEO / Educational Footer Content */}
        <section className="mt-24 border-t border-border-dark pt-16">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Understanding Matrix Multiplication</h2>
              <div className="h-1 w-12 bg-accent mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  The Compatibility Rule
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  For the product $AB$ to exist, the number of columns in the first matrix ($A$) must be equal to the number of rows in the second matrix ($B$). If $A$ is an $m \times n$ matrix and $B$ is an $n \times p$ matrix, the resulting matrix $C$ will have dimensions $m \times p$.
                </p>
                <div className="p-4 bg-bg-dark border border-border-dark rounded-xl">
                  <InlineMath math="A_{m \times \mathbf{n}} \cdot B_{\mathbf{n} \times p} = C_{m \times p}" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-accent flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  The Dot Product Calculation
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Each element <InlineMath math="c_{ij}" /> of the product matrix is calculated by taking the <strong>dot product</strong> of the $i$-th row of $A$ and the $j$-th column of $B$. 
                </p>
                <div className="p-4 bg-bg-dark border border-border-dark rounded-xl overflow-x-auto">
                  <InlineMath math="c_{ij} = a_{i1}b_{1j} + a_{i2}b_{2j} + \dots + a_{in}b_{nj}" />
                </div>
              </div>
            </div>

            <div className="bg-surface-dark border border-border-dark p-8 rounded-3xl text-center space-y-4">
              <h3 className="text-xl font-bold">Why Order Matters</h3>
              <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                Unlike scalar multiplication, matrix multiplication is <strong>not commutative</strong>. This means that $AB \neq BA$ in most cases. Swapping the order can lead to entirely different results, or even make the operation undefined if dimensions no longer match.
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
          MatrixFlow Technical calculator © 2024 • Powered by AI Studio
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
            <span className="text-sm">Copied {copyStatus} to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

