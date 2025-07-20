import React from 'react'
import useTypingStore from '../store/typingStore'

const ModeSelector = () => {
  const { mode, setMode } = useTypingStore()
  
  const modes = [
    { id: 'chinese', label: '中文', icon: '中', description: '中文打字练习' },
    { id: 'english', label: 'English', icon: 'En', description: '英文打字练习' },
    { id: 'code', label: '代码', icon: '</>', description: '代码打字练习' },
    { id: 'rhythm', label: '音游', icon: '♪', description: '音游模式打字练习' }
  ]
  
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {modes.map((modeOption) => (
        <button
          key={modeOption.id}
          onClick={() => setMode(modeOption.id)}
          className={`
            relative px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95
            ${mode === modeOption.id 
              ? 'bg-kawaii-orange text-white shadow-lg border-2 border-kawaii-orange' 
              : 'bg-white text-gray-700 shadow-md border-2 border-gray-200 hover:border-kawaii-orange hover:bg-kawaii-orange/10'
            }
          `}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">{modeOption.icon}</span>
            <span>{modeOption.label}</span>
          </div>
          
          {/* 选中状态的装饰 */}
          {mode === modeOption.id && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-kawaii-yellow rounded-full flex items-center justify-center animate-pulse">
              <span className="text-xs">✨</span>
            </div>
          )}
          
          {/* 悬浮提示 */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            {modeOption.description}
          </div>
        </button>
      ))}
    </div>
  )
}

export default ModeSelector