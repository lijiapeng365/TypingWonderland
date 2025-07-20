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
    <div className="flex flex-wrap gap-4 justify-center">
      {/* 速度统计 */}
      <div className="stats-card">
        <div className="text-2xl font-bold text-kawaii-orange mb-1">
          {mode === 'chinese' ? cpm : wpm}
        </div>
        <div className="text-sm text-gray-600">
          {mode === 'chinese' ? 'CPM' : 'WPM'}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {mode === 'chinese' ? '字/分钟' : '词/分钟'}
        </div>
      </div>
      
      {/* 准确率 */}
      <div className="stats-card">
        <div className="text-2xl font-bold text-kawaii-purple mb-1">
          {accuracy}%
        </div>
        <div className="text-sm text-gray-600">准确率</div>
        <div className="text-xs text-gray-500 mt-1">Accuracy</div>
      </div>
      
      {/* 用时 */}
      <div className="stats-card">
        <div className="text-2xl font-bold text-kawaii-blue mb-1">
          {formatTime(elapsedTime)}
        </div>
        <div className="text-sm text-gray-600">用时</div>
        <div className="text-xs text-gray-500 mt-1">Time</div>
      </div>
      
      {/* 进度条 */}
      <div className="stats-card flex-1 min-w-[200px]">
        <div className="text-sm text-gray-600 mb-2">练习进度</div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-kawaii-orange to-kawaii-yellow transition-all duration-300 ease-out rounded-full"
            style={{ 
              width: `${useTypingStore.getState().currentText ? 
                (useTypingStore.getState().currentIndex / useTypingStore.getState().currentText.length * 100) : 0}%` 
            }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {useTypingStore.getState().currentIndex} / {useTypingStore.getState().currentText.length}
        </div>
      </div>
    </div>
  )
}

export default StatsPanel