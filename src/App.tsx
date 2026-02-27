import React, { useState } from 'react';
import './index.css';
import { GuaResult } from './types';
import { calculateGua } from './yijing';
import GuaDisplay from './components/GuaDisplay';
import FortuneAnalysis from './components/FortuneAnalysis';

function App() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('12:00');
  const [result, setResult] = useState<GuaResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate) return;

    setIsCalculating(true);
    
    // Simulate calculation delay for dramatic effect
    setTimeout(() => {
      const guaResult = calculateGua(name, birthDate, birthTime);
      setResult(guaResult);
      setIsCalculating(false);
    }, 1500);
  };

  const resetForm = () => {
    setResult(null);
    setName('');
    setBirthDate('');
    setBirthTime('12:00');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <header className="text-center mb-12 animate-fade-in">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center animate-pulse-glow">
            <span className="text-4xl">☯</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4">
          易经算命
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          探索古老智慧，解读命运密码
        </p>
      </header>

      {!result ? (
        /* Input Form */
        <div className="max-w-md mx-auto glass rounded-2xl p-8 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-amber-300 text-sm font-medium mb-2">
                姓名
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的姓名"
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-amber-500/30 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-amber-300 text-sm font-medium mb-2">
                出生日期
              </label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-amber-500/30 text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="birthTime" className="block text-amber-300 text-sm font-medium mb-2">
                出生时辰
              </label>
              <input
                type="time"
                id="birthTime"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-amber-500/30 text-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-lg shadow-lg hover:from-amber-400 hover:to-amber-500 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isCalculating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  正在推算...
                </span>
              ) : (
                '开始算命'
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Results Display */
        <div className="animate-fade-in space-y-8">
          <GuaDisplay result={result} />
          <FortuneAnalysis result={result} />
          
          <div className="text-center">
            <button
              onClick={resetForm}
              className="px-8 py-3 rounded-lg border-2 border-amber-500 text-amber-400 font-medium hover:bg-amber-500 hover:text-white transition-all"
            >
              重新测算
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center mt-16 text-gray-500 text-sm">
        <p>本应用仅供娱乐参考，命运掌握在自己手中</p>
      </footer>
    </div>
  );
}

export default App;
