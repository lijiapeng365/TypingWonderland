import React from 'react'

const Character = ({ mood = 'happy', className = '' }) => {
  const getMoodEmoji = () => {
    switch (mood) {
      case 'happy':
        return '🌸'
      case 'neutral':
        return '🌺'
      case 'sad':
        return '🥀'
      default:
        return '🌸'
    }
  }

  const getMoodMessage = () => {
    switch (mood) {
      case 'happy':
        return '太棒了！继续保持！'
      case 'neutral':
        return '加油，你可以做得更好！'
      case 'sad':
        return '别担心，慢慢来～'
      default:
        return '开始你的打字练习吧！'
    }
  }

  return (
    <div className={`flex flex-col items-center space-y-6 ${className}`}>
      {/* 角色头像区域 - 千恋万花风格 */}
      <div className="relative">
        <div className="w-40 h-40 bg-gradient-to-br from-senren-sakura via-senren-rose to-senren-purple rounded-full flex items-center justify-center shadow-2xl border-4 border-senren-gold/50"
             style={{
               boxShadow: '0 12px 24px rgba(255, 183, 197, 0.4), 0 6px 12px rgba(200, 162, 200, 0.3), inset 0 4px 8px rgba(255, 255, 255, 0.3)'
             }}>
          <div className="text-7xl animate-bounce-slow" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}}>
            {getMoodEmoji()}
          </div>
        </div>
        
        {/* 装饰性元素 - 千恋万花风格 */}
        <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-senren-gold to-senren-amber rounded-full flex items-center justify-center animate-pulse shadow-lg">
          <span className="text-xl">✨</span>
        </div>
        
        <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-gradient-to-r from-senren-lavender to-senren-cream rounded-full flex items-center justify-center animate-wiggle shadow-lg">
          <span className="text-lg">🌟</span>
        </div>
        
        {/* 额外的樱花装饰 */}
        <div className="absolute top-2 left-2 w-6 h-6 bg-senren-sakura/60 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-sm">🌸</span>
        </div>
        
        <div className="absolute bottom-2 right-2 w-6 h-6 bg-senren-purple/60 rounded-full flex items-center justify-center animate-bounce-slow">
          <span className="text-sm">🌺</span>
        </div>
      </div>
      
      {/* 对话气泡 - 千恋万花风格 */}
      <div className="relative bg-gradient-to-br from-senren-cream/90 via-white/95 to-senren-rose/80 rounded-3xl px-6 py-4 shadow-xl border-2 border-senren-purple/30 max-w-sm backdrop-blur-sm"
           style={{
             boxShadow: '0 8px 16px rgba(200, 162, 200, 0.2), 0 4px 8px rgba(255, 183, 197, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.5)'
           }}>
        <div className="text-sm text-senren-purple text-center font-medium leading-relaxed">
          {getMoodMessage()}
        </div>
        
        {/* 气泡尾巴 - 千恋万花风格 */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-senren-cream to-senren-rose border-r-2 border-b-2 border-senren-purple/30 rotate-45 shadow-lg"></div>
      </div>
      
      {/* 浮动的樱花装饰 - 千恋万花风格 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-6 left-10 text-senren-sakura/60 animate-pulse text-2xl">🌸</div>
        <div className="absolute top-16 right-8 text-senren-purple/60 animate-bounce-slow text-xl">🌺</div>
        <div className="absolute bottom-12 left-16 text-senren-gold/60 animate-wiggle text-lg">✨</div>
        <div className="absolute bottom-6 right-12 text-senren-rose/60 animate-pulse text-xl">🌸</div>
        <div className="absolute top-1/2 left-4 text-senren-lavender/50 animate-bounce-slow text-sm">🌟</div>
        <div className="absolute top-1/3 right-4 text-senren-amber/50 animate-wiggle text-sm">💫</div>
      </div>
    </div>
  )
}

export default Character