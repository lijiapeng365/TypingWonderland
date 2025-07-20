import React from 'react'
import useTypingStore from '../store/typingStore'

const StatsPanel = () => {
  const { wpm, cpm, accuracy, mode, isTyping, startTime } = useTypingStore()
  
  const [elapsedTime, setElapsedTime] = React.useState(0)
  
  React.useEffect(() => {
    let interval
    if (isTyping && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } else {
      setElapsedTime(0)
    }
    
    return () => clearInterval(interval)
  }, [isTyping, startTime])
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {/* 速度统计 - 千恋万花风格 */}
      <div className="stats-card bg-gradient-to-br from-senren-sakura/20 to-senren-purple/20 border-senren-sakura/30">
        <div className="text-3xl font-bold text-senren-gold mb-2" style={{textShadow: '0 2px 4px rgba(244, 208, 63, 0.3)'}}>
          {mode === 'chinese' ? cpm : wpm}
        </div>
        <div className="text-sm text-senren-purple font-medium">
          {mode === 'chinese' ? 'CPM' : 'WPM'}
        </div>
        <div className="text-xs text-senren-sakura mt-1">
          {mode === 'chinese' ? '字/分钟' : '词/分钟'}
        </div>
        <div className="absolute top-2 right-2 text-senren-gold">⚡</div>
      </div>
      
      {/* 准确率 - 千恋万花风格 */}
      <div className="stats-card bg-gradient-to-br from-senren-lavender/20 to-senren-rose/20 border-senren-purple/30">
        <div className="text-3xl font-bold text-senren-purple mb-2" style={{textShadow: '0 2px 4px rgba(200, 162, 200, 0.3)'}}>
          {accuracy}%
        </div>
        <div className="text-sm text-senren-purple font-medium">准确率</div>
        <div className="text-xs text-senren-sakura mt-1">Accuracy</div>
        <div className="absolute top-2 right-2 text-senren-purple">🎯</div>
      </div>
      
      {/* 用时 - 千恋万花风格 */}
      <div className="stats-card bg-gradient-to-br from-senren-cream/30 to-senren-amber/20 border-senren-gold/30">
        <div className="text-3xl font-bold text-senren-amber mb-2" style={{textShadow: '0 2px 4px rgba(255, 191, 0, 0.3)'}}>
          {formatTime(elapsedTime)}
        </div>
        <div className="text-sm text-senren-purple font-medium">用时</div>
        <div className="text-xs text-senren-sakura mt-1">Time</div>
        <div className="absolute top-2 right-2 text-senren-amber">⏰</div>
      </div>
      
      {/* 进度条 - 千恋万花风格 */}
      <div className="stats-card flex-1 min-w-[240px] bg-gradient-to-br from-senren-rose/20 to-senren-lavender/20 border-senren-sakura/30">
        <div className="text-sm text-senren-purple font-medium mb-3 flex items-center">
          <span className="mr-2">🌸</span>
          练习进度
        </div>
        <div className="w-full bg-senren-mist/50 rounded-full h-4 overflow-hidden shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-senren-sakura via-senren-gold to-senren-purple transition-all duration-500 ease-out rounded-full shadow-lg"
            style={{ 
              width: `${useTypingStore.getState().currentText ? 
                (useTypingStore.getState().currentIndex / useTypingStore.getState().currentText.length * 100) : 0}%`,
              boxShadow: '0 0 8px rgba(255, 183, 197, 0.4)'
            }}
          ></div>
        </div>
        <div className="text-xs text-senren-sakura mt-2 flex justify-between">
          <span>{useTypingStore.getState().currentIndex}</span>
          <span>/</span>
          <span>{useTypingStore.getState().currentText.length}</span>
        </div>
      </div>
    </div>
  )
}

export default StatsPanel