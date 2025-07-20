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
    classicSubMode,
    isFinished, 
    characterMood, 
    setCurrentText, 
    resetTyping 
  } = useTypingStore()
  
  const [showResult, setShowResult] = React.useState(false)
  
  // 初始化文本
  React.useEffect(() => {
    const textMode = mode === 'classic' ? classicSubMode : mode
    setCurrentText(getRandomText(textMode))
  }, [mode, classicSubMode, setCurrentText])
  
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
    const textMode = mode === 'classic' ? classicSubMode : mode
    setCurrentText(getRandomText(textMode))
    resetTyping()
    setShowResult(false)
  }
  
  // 关闭结果弹窗
  const handleCloseResult = () => {
    setShowResult(false)
  }
  
  return (
    <div className="min-h-screen">
      {/* 千恋万花风格背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl text-senren-sakura/40 animate-bounce-slow">🌸</div>
        <div className="absolute top-20 right-20 text-3xl text-senren-purple/40 animate-pulse">🌺</div>
        <div className="absolute bottom-20 left-20 text-5xl text-senren-gold/30 animate-wiggle">🌙</div>
        <div className="absolute bottom-10 right-10 text-4xl text-senren-amber/40 animate-bounce">✨</div>
        <div className="absolute top-1/2 left-10 text-2xl text-senren-rose/40 animate-pulse">🌸</div>
        <div className="absolute top-1/3 right-10 text-3xl text-senren-lavender/40 animate-bounce-slow">🦋</div>
        <div className="absolute top-1/4 left-1/4 text-2xl text-senren-sakura/30 animate-pulse">🌸</div>
        <div className="absolute bottom-1/4 right-1/4 text-2xl text-senren-purple/30 animate-bounce-slow">🌸</div>
        <div className="absolute top-3/4 left-3/4 text-3xl text-senren-gold/20 animate-wiggle">🌟</div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 标题 */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4" style={{textShadow: '0 4px 8px rgba(200, 162, 200, 0.3)'}}>
            <span className="text-senren-sakura">Typing</span>
            <span className="text-senren-purple mx-2">Practice</span>
          </h1>
          <p className="text-lg text-senren-purple font-medium">
            在线打字练习平台
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
            
            {/* 控制按钮 - 千恋万花风格 */}
            <div className="flex justify-center gap-6">
              <button
                onClick={handleRetry}
                className="kawaii-button text-senren-purple hover:text-white"
              >
                <span className="mr-2">🌸</span>
                重新开始
              </button>
              
              <button
                onClick={handleNext}
                className="kawaii-button text-senren-purple hover:text-white"
              >
                <span className="mr-2">🌺</span>
                换一篇
              </button>
            </div>
          </div>
        </div>
        
        {/* 页脚 */}
        <footer className="text-center mt-16 text-senren-purple/70">
          <div className="bg-gradient-to-r from-senren-cream/30 via-senren-rose/20 to-senren-lavender/30 rounded-3xl p-6 border border-senren-purple/20 backdrop-blur-sm">
            <p className="text-sm mb-2">
              Made with 💖 by Typing Practice Team
            </p>
            <p className="text-xs text-senren-purple/60">
              © 2024 Typing Practice. All rights reserved.
            </p>
          </div>
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