import React from 'react'

const Character = ({ mood = 'happy', className = '' }) => {
  const getMoodEmoji = () => {
    switch (mood) {
      case 'happy':
        return '😊'
      case 'neutral':
        return '😐'
      case 'sad':
        return '😟'
      default:
        return '😊'
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
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* 角色头像区域 */}
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-br from-kawaii-pink to-kawaii-purple rounded-full flex items-center justify-center shadow-lg border-4 border-white">
          <div className="text-6xl animate-bounce-slow">
            {getMoodEmoji()}
          </div>
        </div>
        
        {/* 装饰性元素 */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-kawaii-yellow rounded-full flex items-center justify-center animate-pulse">
          <span className="text-lg">✨</span>
        </div>
        
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-kawaii-mint rounded-full flex items-center justify-center animate-wiggle">
          <span className="text-sm">💫</span>
        </div>
      </div>
      
      {/* 对话气泡 */}
      <div className="relative bg-white rounded-2xl px-4 py-2 shadow-md border-2 border-kawaii-orange max-w-xs">
        <div className="text-sm text-gray-700 text-center font-medium">
          {getMoodMessage()}
        </div>
        
        {/* 气泡尾巴 */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-kawaii-orange rotate-45"></div>
      </div>
      
      {/* 浮动的心形装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-8 text-kawaii-pink animate-pulse">💖</div>
        <div className="absolute top-12 right-6 text-kawaii-blue animate-bounce-slow">💙</div>
        <div className="absolute bottom-8 left-12 text-kawaii-mint animate-wiggle">💚</div>
      </div>
    </div>
  )
}

export default Character