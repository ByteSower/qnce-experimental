import { useState } from 'react'
import './App.css'
import useQNCEEngine from './hooks/useQNCEEngine'
import { trackUIEvent } from './utils/analytics'

function App() {
  const [activeExperiment, setActiveExperiment] = useState<'intro' | 'engine' | 'performance' | 'features'>('intro')
  const engineQNCE = useQNCEEngine()

  const experiments = [
    { id: 'intro', name: '🏠 Introduction', description: 'Overview of experimental goals' },
    { id: 'engine', name: '🔬 Engine Test', description: 'QNCE engine integration testing' },
    { id: 'performance', name: '⚡ Performance', description: 'Real-time performance monitoring' },
    { id: 'features', name: '🚀 Features', description: 'Advanced capabilities exploration' },
  ]

  return (
    <div className="qnce-experimental min-h-screen p-8">
      <header className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 qnce-glow">🧪 QNCE Engine Experimental</h1>
        <p className="text-xl text-gray-200 mb-6">
          Dedicated environment for testing QNCE engine integration and performance optimization
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {experiments.map((exp) => (
            <button
              key={exp.id}
              onClick={() => {
                setActiveExperiment(exp.id as any)
                trackUIEvent.feature('experiment_tab', exp.id)
              }}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeExperiment === exp.id
                  ? 'bg-qnce-accent text-black font-bold qnce-glow'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {exp.name}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {activeExperiment === 'intro' && (
          <div className="bg-white/10 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-qnce-accent">🎯 Experimental Objectives</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">🔧 QNCE Engine Integration</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-200">
                  <li>Test standalone qnce-engine package</li>
                  <li>Compare with current implementation</li>
                  <li>Validate API compatibility</li>
                  <li>Assess migration complexity</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">⚡ Performance Optimization</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-200">
                  <li>90%+ memory allocation reduction</li>
                  <li>Sub-3.5ms state transitions</li>
                  <li>Real-time profiling</li>
                  <li>Background processing</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">🤖 Advanced Features</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-200">
                  <li>AI-driven content generation</li>
                  <li>Dynamic branch insertion</li>
                  <li>Multi-path narratives</li>
                  <li>Hot-reload capabilities</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">🛠️ Developer Experience</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-200">
                  <li>CLI tools integration</li>
                  <li>TypeScript-first design</li>
                  <li>Framework-agnostic usage</li>
                  <li>Comprehensive profiling</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeExperiment === 'engine' && (
          <div className="bg-white/10 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-qnce-accent">🔬 QNCE Engine Testing</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Current Node State</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div><span className="text-gray-400">ID:</span> {engineQNCE.currentNode.id}</div>
                  <div><span className="text-gray-400">Choices:</span> {engineQNCE.currentNode.choices.length}</div>
                  <div><span className="text-gray-400">History:</span> {engineQNCE.state.history.length} nodes</div>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">Variable State</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Curiosity: <span className="font-mono">{engineQNCE.state.variables.curiosity}</span></div>
                  <div>Coherence: <span className="font-mono">{engineQNCE.state.variables.coherence}</span></div>
                  <div>Disruption: <span className="font-mono">{engineQNCE.state.variables.disruption}</span></div>
                  <div>Synchrony: <span className="font-mono">{engineQNCE.state.variables.synchrony}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-3">Interactive Testing</h3>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => engineQNCE.makeChoice(0)}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  Choice 1: {engineQNCE.currentNode.choices[0]?.text}
                </button>
                <button
                  onClick={() => engineQNCE.makeChoice(1)}
                  className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors"
                >
                  Choice 2: {engineQNCE.currentNode.choices[1]?.text}
                </button>
                <button
                  onClick={() => engineQNCE.reset()}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors"
                >
                  Reset State
                </button>
              </div>
              <div className="text-sm text-gray-300">
                <strong>Current Text:</strong> {engineQNCE.currentNode.text}
              </div>
            </div>
          </div>
        )}

        {activeExperiment === 'performance' && (
          <div className="bg-white/10 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-qnce-accent">⚡ Performance Monitoring</h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-mono text-green-400">
                  {engineQNCE.performance.lastTransitionTime.toFixed(2)}ms
                </div>
                <div className="text-sm text-gray-400">Last Transition</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-mono text-blue-400">
                  {engineQNCE.performance.averageTransitionTime.toFixed(2)}ms
                </div>
                <div className="text-sm text-gray-400">Average Time</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-mono text-purple-400">
                  {engineQNCE.performance.totalTransitions}
                </div>
                <div className="text-sm text-gray-400">Total Transitions</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-mono text-orange-400">
                  {(engineQNCE.performance.memoryUsage / 1024 / 1024).toFixed(1)}MB
                </div>
                <div className="text-sm text-gray-400">Memory Usage</div>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">Performance Targets</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>State Transitions:</span>
                  <span className={`font-mono ${engineQNCE.performance.lastTransitionTime <= 3.5 ? 'text-green-400' : 'text-red-400'}`}>
                    {engineQNCE.performance.lastTransitionTime.toFixed(2)}ms / 3.5ms target
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Memory Optimization:</span>
                  <span className="font-mono text-blue-400">Baseline measurement</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cache Efficiency:</span>
                  <span className="font-mono text-purple-400">95%+ target</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeExperiment === 'features' && (
          <div className="bg-white/10 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold mb-6 text-qnce-accent">🚀 Advanced Features</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">🔄 Background Processing</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Test non-blocking cache preloading and optimization processes.
                </p>
                <button
                  onClick={() => engineQNCE.experimental.backgroundProcess()}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
                >
                  Trigger Background Process
                </button>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">🔥 Hot-Reload</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Sub-3.5ms live story updates without losing state.
                </p>
                <button
                  onClick={() => engineQNCE.experimental.enableHotReload()}
                  className="px-4 py-2 bg-orange-600 rounded hover:bg-orange-700 transition-colors"
                >
                  Enable Hot-Reload
                </button>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">🤖 AI Content Generation</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Dynamic story expansion with AI-driven content.
                </p>
                <button
                  onClick={() => engineQNCE.experimental.generateAIContent()}
                  className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors"
                >
                  Generate AI Content
                </button>
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">📊 Real-time Profiling</h3>
                <p className="text-gray-300 text-sm mb-3">
                  Comprehensive performance analysis and optimization.
                </p>
                <button
                  onClick={() => console.log('Profile Data:', engineQNCE.experimental.getProfileData())}
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                >
                  Get Profile Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center mt-8 text-gray-400">
        <p>🧪 QNCE Engine Experimental Environment | Built with React + TypeScript + Vite</p>
        <p className="text-sm mt-2">Safe testing environment for performance optimization and feature exploration</p>
      </footer>
    </div>
  )
}

export default App
