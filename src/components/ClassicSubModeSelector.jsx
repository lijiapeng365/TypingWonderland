import React from 'react'
import useTypingStore from '../store/typingStore'

const ClassicSubModeSelector = () => {
  const { classicSubMode, setClassicSubMode } = useTypingStore()
  
  const subModes = [
    { id: 'chinese', label: '中文', icon: '中', description: '中文打字练习' },
    { id: 'english', label: 'English', icon: 'En', description: '英文打字练习' },
    { id: 'code', label: '代码', icon: '</>', description: '代码打字练习' }
  ]
  
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      {subModes.map((subMode) => (
        <button
          key={subMode.id}
          onClick={() => setClassicSubMode(subMode.id)}
          className={`
            relative px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 text-sm
            ${classicSubMode === subMode.id 
              ? 'bg-kawaii-orange text-white shadow-md border-2 border-kawaii-orange' 
              : 'bg-white text-gray-600 shadow-sm border-2 border-gray-200 hover:border-kawaii-orange hover:bg-kawaii-orange/10'
            }
          `}
        >
          <div className="flex items-center space-x-1">
            <span className="text-sm font-bold">{subMode.icon}</span>
            <span>{subMode.label}</span>
          </div>
          
          {/* 选中状态的装饰 */}
          {classicSubMode === subMode.id && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-kawaii-yellow rounded-full flex items-center justify-center">
              <span className="text-xs">✨</span>
            </div>
          )}
        </button>
      ))}
    </div>
  )
}

export default ClassicSubModeSelector