/**
 * Game Prototype Framework
 * Testing QNCE Engine with different game mechanics
 */

import React, { useState } from 'react';
import useQNCEEngine from '../hooks/useQNCEEngine';

export type GameType = 'strategy' | 'puzzle' | 'rpg' | 'action';

interface GamePrototypeProps {
  gameType: GameType;
}

const GamePrototype: React.FC<GamePrototypeProps> = ({ gameType }) => {
  const qnce = useQNCEEngine();
  const [gameState, setGameState] = useState({
    score: 0,
    level: 1,
    resources: { gold: 100, wood: 50, stone: 25 },
    inventory: [] as string[],
    playerStats: { health: 100, mana: 50, experience: 0 }
  });

  const gameConfigs = {
    strategy: {
      title: "🏰 QNCE Strategy Builder",
      description: "Build your kingdom while navigating political intrigue",
      mechanics: "Resource management + narrative choices"
    },
    puzzle: {
      title: "🧩 QNCE Logic Nexus", 
      description: "Solve puzzles that unlock new story branches",
      mechanics: "Logic puzzles + branching narratives"
    },
    rpg: {
      title: "⚔️ QNCE Adventure Chronicles",
      description: "Character progression driven by story choices",
      mechanics: "RPG progression + dynamic questing"
    },
    action: {
      title: "🎯 QNCE Action Saga",
      description: "Real-time action with narrative consequences",
      mechanics: "Action gameplay + story integration"
    }
  };

  const config = gameConfigs[gameType];

  const handleGameAction = (actionType: string, value?: any) => {
    setGameState(prev => {
      const newState = { ...prev };
      
      switch (actionType) {
        case 'spend_gold':
          newState.resources.gold = Math.max(0, prev.resources.gold - (value || 10));
          newState.score += 5;
          break;
        case 'gain_experience':
          newState.playerStats.experience += value || 10;
          if (newState.playerStats.experience >= newState.level * 100) {
            newState.level++;
            newState.playerStats.health += 20;
            newState.playerStats.mana += 10;
          }
          break;
        case 'add_item':
          newState.inventory.push(value || 'Mystery Item');
          break;
        default:
          break;
      }
      
      return newState;
    });
  };

  const renderGameSpecificUI = () => {
    switch (gameType) {
      case 'strategy':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-yellow-900/30 p-4 rounded">
              <h4 className="font-bold text-yellow-400">Resources</h4>
              <div className="text-sm">
                <div>Gold: {gameState.resources.gold}</div>
                <div>Wood: {gameState.resources.wood}</div>
                <div>Stone: {gameState.resources.stone}</div>
              </div>
            </div>
            <div className="bg-blue-900/30 p-4 rounded">
              <h4 className="font-bold text-blue-400">Kingdom</h4>
              <div className="text-sm">
                <div>Level: {gameState.level}</div>
                <div>Score: {gameState.score}</div>
              </div>
            </div>
            <div className="bg-purple-900/30 p-4 rounded">
              <h4 className="font-bold text-purple-400">Actions</h4>
              <button 
                onClick={() => handleGameAction('spend_gold', 25)}
                className="bg-purple-600 px-2 py-1 rounded text-sm"
              >
                Build Structure (-25 gold)
              </button>
            </div>
          </div>
        );

      case 'puzzle':
        return (
          <div className="bg-green-900/30 p-4 rounded">
            <h4 className="font-bold text-green-400">Logic Challenge</h4>
            <p className="text-sm mb-3">Complete puzzles to unlock story paths</p>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => handleGameAction('gain_experience', 15)}
                  className="bg-green-600 p-2 rounded hover:bg-green-500"
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        );

      case 'rpg':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-900/30 p-4 rounded">
              <h4 className="font-bold text-red-400">Player Stats</h4>
              <div className="text-sm">
                <div>Health: {gameState.playerStats.health}</div>
                <div>Mana: {gameState.playerStats.mana}</div>
                <div>Experience: {gameState.playerStats.experience}</div>
                <div>Level: {gameState.level}</div>
              </div>
            </div>
            <div className="bg-orange-900/30 p-4 rounded">
              <h4 className="font-bold text-orange-400">Inventory</h4>
              <div className="text-sm mb-2">
                Items: {gameState.inventory.length}
              </div>
              <button
                onClick={() => handleGameAction('add_item', `Sword +${gameState.level}`)}
                className="bg-orange-600 px-2 py-1 rounded text-sm"
              >
                Find Loot
              </button>
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="bg-indigo-900/30 p-4 rounded">
            <h4 className="font-bold text-indigo-400">Action Arena</h4>
            <p className="text-sm mb-3">Fast-paced decisions with lasting consequences</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleGameAction('gain_experience', 5)}
                className="bg-indigo-600 px-3 py-2 rounded"
              >
                Quick Strike
              </button>
              <button
                onClick={() => handleGameAction('spend_gold', 5)}
                className="bg-purple-600 px-3 py-2 rounded"
              >
                Power Attack
              </button>
            </div>
          </div>
        );

      default:
        return <div>Game type not implemented</div>;
    }
  };

  return (
    <div className="bg-white/10 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2 text-qnce-accent">{config.title}</h2>
        <p className="text-gray-300 mb-1">{config.description}</p>
        <p className="text-sm text-gray-400">{config.mechanics}</p>
      </div>

      {/* Game-specific UI */}
      <div className="mb-6">
        {renderGameSpecificUI()}
      </div>

      {/* QNCE Integration Panel */}
      <div className="border-t border-white/20 pt-4">
        <h3 className="text-lg font-semibold mb-3">QNCE Story Integration</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded p-3">
            <h4 className="font-semibold mb-2">Current Narrative</h4>
            <p className="text-sm text-gray-300">{qnce.currentNode.text}</p>
          </div>
          <div className="bg-white/5 rounded p-3">
            <h4 className="font-semibold mb-2">Story Actions</h4>
            <div className="space-y-2">
              {qnce.currentNode.choices.map((choice, index) => (
                <button
                  key={index}
                  onClick={() => {
                    qnce.makeChoice(index);
                    // Game actions can trigger based on story choices
                    if (choice.text.toLowerCase().includes('fight')) {
                      handleGameAction('gain_experience', 20);
                    } else if (choice.text.toLowerCase().includes('trade')) {
                      handleGameAction('spend_gold', 10);
                    }
                  }}
                  className="w-full text-left bg-blue-600/50 hover:bg-blue-600/70 p-2 rounded text-sm transition-colors"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex justify-between text-sm text-gray-400">
          <span>QNCE Performance: {qnce.performance.lastTransitionTime.toFixed(2)}ms</span>
          <span>Game State Updates: Instant</span>
          <span>Memory: {(qnce.performance.memoryUsage / 1024 / 1024).toFixed(1)}MB</span>
        </div>
      </div>
    </div>
  );
};

export default GamePrototype;
