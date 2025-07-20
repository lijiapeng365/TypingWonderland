import React from 'react'
import useTypingStore from './store/typingStore'
import { getRandomText } from './data/texts'
import Character from './components/Character'
import StatsPanel from './components/StatsPanel'
import ModeSelector from './components/ModeSelector'
import TypingArea from './components/TypingArea'
import ResultModal from './components/ResultModal'

function App() {
  const { 
    mode, 
    isFinished, 
    characterMood, 
    setCurrentText, 
    resetTyping 
  } = useTypingStore()
  
  const [showResult, setShowResult] = React.useState(false)
  
  // 初始化文本
  React.useEffect(() => {
    setCurrentText(getRandomText(mode))
  }, [mode, setCurrentText])
  
  // 监听完成状态
  React.useEffect(() => {
    if (isFinished) {
      setTimeout(() => setShowResult(true), 500)
    }
  }, [isFinished])
  
  // 重新开始
  const handleRetry = () => {
    resetTyping()
    setShowResult(false)
  }
  
  // 下一篇
  const handleNext = () => {
    setCurrentText(getRandomText(mode))
    resetTyping()
    setShowResult(false)
  }
  
  // 关闭结果弹窗
  const handleCloseResult = () => {
    setShowResult(false)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-kawaii-pink via-kawaii-blue to-kawaii-mint">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl text-kawaii-orange/30 animate-bounce-slow">🌸</div>
        <div className="absolute top-20 right-20 text-3xl text-kawaii-purple/30 animate-pulse">⭐</div>
        <div className="absolute bottom-20 left-20 text-5xl text-kawaii-mint/30 animate-wiggle">🌙</div>
        <div className="absolute bottom-10 right-10 text-4xl text-kawaii-yellow/30 animate-bounce">☀️</div>
        <div className="absolute top-1/2 left-10 text-2xl text-kawaii-pink/30 animate-pulse">💫</div>
        <div className="absolute top-1/3 right-10 text-3xl text-kawaii-blue/30 animate-bounce-slow">🦋</div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 标题 */}
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <span className="text-kawaii-orange">Typing</span>{' '}
            <span className="text-kawaii-purple">Wonderland</span>
          </h1>
          <p className="text-lg text-gray-600">
            🌟 可爱二次元风格打字练习 🌟
          </p>
        </header>
        
        {/* 模式选择器 */}
        <div className="mb-8">
          <ModeSelector />
        </div>
        
        {/* 主要内容区域 */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左侧：角色互动区 */}
          <div className="lg:col-span-1">
            <div className="kawaii-card h-fit">
              <Character mood={characterMood} />
            </div>
          </div>
          
          {/* 右侧：统计和打字区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 统计面板 */}
            <StatsPanel />
            
            {/* 打字区域 */}
            <TypingArea />
            
            {/* 控制按钮 */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRetry}
                className="kawaii-button"
              >
                <span className="mr-2">🔄</span>
                重新开始
              </button>
              
              <button
                onClick={handleNext}
                className="kawaii-button"
              >
                <span className="mr-2">📝</span>
                换一篇
              </button>
            </div>
          </div>
        </div>
        
        {/* 页脚 */}
        <footer className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            Made with 💖 by Typing Wonderland Team
          </p>
          <p className="text-xs mt-2">
            © 2024 Typing Wonderland. All rights reserved.
          </p>
        </footer>
      </div>
      
      {/* 结果弹窗 */}
      <ResultModal
        isOpen={showResult}
        onClose={handleCloseResult}
        onRetry={handleRetry}
        onNext={handleNext}
      />
    </div>
  )
}

export default App