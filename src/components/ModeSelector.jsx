import React from 'react'
import useTypingStore from '../store/typingStore'

const ModeSelector = () => {
  const { mode, setMode } = useTypingStore()
  
  const modes = [
    { id: 'classic', label: '经典模式', icon: '🌸', description: '传统打字练习' },
    { id: 'rhythm', label: '音游模式', icon: '🎵', description: '音游风格打字练习' }
  ]
  
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {modes.map((modeOption) => (
        <button
          key={modeOption.id}
          onClick={() => setMode(modeOption.id)}
          className={`
            relative px-8 py-4 rounded-3xl font-medium transition-all duration-500 transform hover:scale-110 active:scale-95
            ${mode === modeOption.id 
              ? 'bg-gradient-to-r from-senren-sakura to-senren-purple text-white shadow-2xl border-2 border-senren-gold' 
              : 'bg-gradient-to-r from-senren-cream to-senren-rose text-senren-purple shadow-xl border-2 border-senren-purple/30 hover:border-senren-gold hover:from-senren-rose hover:to-senren-lavender'
            }
          `}
          style={{
            boxShadow: mode === modeOption.id 
              ? '0 12px 24px rgba(255, 183, 197, 0.4), 0 6px 12px rgba(200, 162, 200, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
              : '0 8px 16px rgba(200, 162, 200, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
          }}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{modeOption.icon}</span>
            <span className="text-lg font-semibold">{modeOption.label}</span>
          </div>
          
          {/* 选中状态的装饰 */}
          {mode === modeOption.id && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-senren-gold to-senren-amber rounded-full flex items-center justify-center animate-pulse shadow-lg">
              <span className="text-sm">✨</span>
            </div>
          )}
          
          {/* 悬浮提示 - 千恋万花风格 */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-2 bg-gradient-to-r from-senren-purple to-senren-sakura text-white text-sm rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
            {modeOption.description}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-senren-purple"></div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default ModeSelector