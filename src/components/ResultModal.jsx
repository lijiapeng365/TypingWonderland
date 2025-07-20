import React from 'react'
import useTypingStore from '../store/typingStore'

const ResultModal = ({ isOpen, onClose, onRetry, onNext }) => {
  const { 
    wpm, 
    cpm, 
    accuracy, 
    correctChars, 
    incorrectChars, 
    startTime, 
    endTime, 
    mode 
  } = useTypingStore()
  
  if (!isOpen) return null
  
  const totalTime = endTime && startTime ? (endTime - startTime) / 1000 : 0
  
  // 计算评级
  const getGrade = () => {
    if (accuracy >= 98 && (mode === 'chinese' ? cpm >= 80 : wpm >= 60)) return 'S'
    if (accuracy >= 95 && (mode === 'chinese' ? cpm >= 60 : wpm >= 45)) return 'A'
    if (accuracy >= 90 && (mode === 'chinese' ? cpm >= 40 : wpm >= 30)) return 'B'
    if (accuracy >= 80) return 'C'
    return 'D'
  }
  
  const grade = getGrade()
  
  const getGradeColor = () => {
    switch (grade) {
      case 'S': return 'text-yellow-500'
      case 'A': return 'text-green-500'
      case 'B': return 'text-blue-500'
      case 'C': return 'text-orange-500'
      default: return 'text-red-500'
    }
  }
  
  const getGradeMessage = () => {
    switch (grade) {
      case 'S': return '完美！你是打字大师！'
      case 'A': return '优秀！继续保持！'
      case 'B': return '不错！还有进步空间！'
      case 'C': return '加油！多练习会更好！'
      default: return '别灰心，慢慢来！'
    }
  }
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}分${secs}秒`
  }
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 标题和评级 */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">练习完成！</h2>
          <div className={`text-8xl font-bold ${getGradeColor()} mb-2`}>
            {grade}
          </div>
          <p className="text-lg text-gray-600">{getGradeMessage()}</p>
        </div>
        
        {/* 详细统计 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-kawaii-pink/20 rounded-xl">
            <div className="text-2xl font-bold text-kawaii-orange">
              {mode === 'chinese' ? cpm : wpm}
            </div>
            <div className="text-sm text-gray-600">
              {mode === 'chinese' ? '字/分钟' : '词/分钟'}
            </div>
          </div>
          
          <div className="text-center p-4 bg-kawaii-blue/20 rounded-xl">
            <div className="text-2xl font-bold text-kawaii-purple">{accuracy}%</div>
            <div className="text-sm text-gray-600">准确率</div>
          </div>
          
          <div className="text-center p-4 bg-kawaii-mint/20 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{formatTime(totalTime)}</div>
            <div className="text-sm text-gray-600">总用时</div>
          </div>
          
          <div className="text-center p-4 bg-kawaii-yellow/20 rounded-xl">
            <div className="text-2xl font-bold text-red-500">{incorrectChars}</div>
            <div className="text-sm text-gray-600">错误字数</div>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 kawaii-button bg-kawaii-orange text-white hover:bg-kawaii-orange/90"
          >
            <span className="mr-2">🔄</span>
            再来一次
          </button>
          
          <button
            onClick={onNext}
            className="flex-1 kawaii-button bg-kawaii-purple text-white hover:bg-kawaii-purple/90"
          >
            <span className="mr-2">➡️</span>
            下一篇
          </button>
        </div>
        
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
        >
          ✕
        </button>
        
        {/* 装饰性元素 */}
        <div className="absolute -top-4 -left-4 text-2xl animate-bounce">🌟</div>
        <div className="absolute -top-4 -right-4 text-2xl animate-pulse">✨</div>
        <div className="absolute -bottom-4 -left-4 text-2xl animate-wiggle">🎊</div>
        <div className="absolute -bottom-4 -right-4 text-2xl animate-bounce-slow">🎈</div>
      </div>
    </div>
  )
}

export default ResultModal