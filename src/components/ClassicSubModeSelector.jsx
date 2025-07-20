import React from 'react'
import useTypingStore from '../store/typingStore'

const ClassicSubModeSelector = () => {
  const { classicSubMode, setClassicSubMode } = useTypingStore()
  
  const subModes = [
    { id: 'chinese', label: '中文', icon: '🌸', description: '中文打字练习' },
    { id: 'english', label: 'English', icon: '🌺', description: '英文打字练习' },
    { id: 'code', label: '代码', icon: '🌟', description: '代码打字练习' }
  ]
  
  return (
    <div className="flex flex-wrap gap-4 justify-center mb-6">
      {subModes.map((subMode) => (
        <button
          key={subMode.id}
          onClick={() => setClassicSubMode(subMode.id)}
          className={`
            relative px-6 py-3 rounded-2xl font-medium transition-all duration-400 transform hover:scale-110 active:scale-95 text-sm
            ${classicSubMode === subMode.id 
              ? 'bg-gradient-to-r from-senren-sakura to-senren-purple text-white shadow-xl border-2 border-senren-gold' 
              : 'bg-gradient-to-r from-senren-cream to-senren-rose text-senren-purple shadow-lg border-2 border-senren-purple/30 hover:border-senren-gold hover:from-senren-rose hover:to-senren-lavender'
            }
          `}
          style={{
            boxShadow: classicSubMode === subMode.id 
              ? '0 8px 16px rgba(255, 183, 197, 0.3), 0 4px 8px rgba(200, 162, 200, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
              : '0 4px 8px rgba(200, 162, 200, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.4)'
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">{subMode.icon}</span>
            <span className="font-semibold">{subMode.label}</span>
          </div>
          
          {/* 选中状态的装饰 */}
          {classicSubMode === subMode.id && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-senren-gold to-senren-amber rounded-full flex items-center justify-center animate-pulse shadow-lg">
              <span className="text-xs">✨</span>
            </div>
          )}
          
          {/* 悬浮提示 */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gradient-to-r from-senren-purple to-senren-sakura text-white text-xs rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg">
            {subMode.description}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-senren-purple"></div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default ClassicSubModeSelector