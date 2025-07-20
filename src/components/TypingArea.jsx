import React from 'react'
import useTypingStore from '../store/typingStore'
import RhythmGame from './RhythmGame'
import ClassicSubModeSelector from './ClassicSubModeSelector'

const TypingArea = () => {
  const { 
    currentText, 
    userInput, 
    currentIndex, 
    mode, 
    classicSubMode,
    updateInput, 
    isFinished 
  } = useTypingStore()
  
  const inputRef = React.useRef(null)
  
  // 自动聚焦输入框
  React.useEffect(() => {
    if (inputRef.current && !isFinished) {
      inputRef.current.focus()
    }
  }, [currentText, isFinished])
  
  // 如果是音游模式，在所有hooks之后返回音游组件
  if (mode === 'rhythm') {
    return <RhythmGame />
  }
  
  // 处理输入
  const handleInputChange = (e) => {
    if (!isFinished) {
      updateInput(e.target.value)
    }
  }
  
  // 渲染文本字符
  const renderText = () => {
    if (!currentText) return null
    
    return currentText.split('').map((char, index) => {
      let className = 'character-pending'
      
      if (index < userInput.length) {
        // 已输入的字符
        const userChar = userInput[index]
        const isCorrect = checkCharacterMatch(userChar, char, classicSubMode)
        className = isCorrect ? 'character-correct' : 'character-incorrect'
      } else if (index === currentIndex) {
        // 当前要输入的字符
        className = 'character-current'
      }
      
      return (
        <span key={index} className={className}>
          {char === ' ' ? '␣' : char}
        </span>
      )
    })
  }
  
  // 检查字符匹配
  const checkCharacterMatch = (userChar, sourceChar, currentMode) => {
    if (currentMode === 'chinese') {
      // 中文模式：英文标点符号与中文标点符号视为相同
      const punctuationMap = {
        ',': '，',
        '.': '。',
        '?': '？',
        '!': '！',
        ':': '：',
        ';': '；',
        '(': '（',
        ')': '）',
        '"': '"',
        "'": "'"
      }
      
      if (punctuationMap[userChar] === sourceChar || userChar === sourceChar) {
        return true
      }
    }
    
    return userChar === sourceChar
  }
  
  return (
    <div className="kawaii-card">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-senren-purple mb-6 text-center">
          经典模式
        </h3>
        
        {/* 经典模式子选项 */}
        <ClassicSubModeSelector />
        
        {/* 文本显示区域 - 千恋万花风格 */}
        <div className="typing-text p-8 bg-gradient-to-br from-senren-cream/50 via-white/80 to-senren-rose/30 rounded-3xl border-2 border-senren-purple/30 min-h-[240px] leading-loose whitespace-pre-wrap break-words shadow-inner"
             style={{
               backgroundImage: `
                 radial-gradient(circle at 10% 20%, rgba(255, 183, 197, 0.1) 0%, transparent 30%),
                 radial-gradient(circle at 90% 80%, rgba(200, 162, 200, 0.1) 0%, transparent 30%)
               `,
               boxShadow: 'inset 0 4px 8px rgba(200, 162, 200, 0.1), 0 4px 16px rgba(255, 183, 197, 0.2)'
             }}>
          {renderText()}
          
          {/* 光标 - 千恋万花风格 */}
          {currentIndex < currentText.length && (
            <span className="inline-block w-1 h-8 bg-gradient-to-b from-senren-gold to-senren-amber animate-pulse ml-1 rounded-full shadow-lg"
                  style={{boxShadow: '0 0 8px rgba(244, 208, 63, 0.6)'}}></span>
          )}
        </div>
      </div>
      
      {/* 输入框 - 千恋万花风格 */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="w-full p-6 border-2 border-senren-purple/40 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-senren-gold/30 transition-all duration-300 bg-gradient-to-r from-senren-cream/80 to-senren-rose/60 text-senren-purple placeholder-senren-purple/60"
        style={{
          boxShadow: '0 4px 12px rgba(200, 162, 200, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(8px)'
        }}
        placeholder={
          classicSubMode === 'chinese' 
            ? '开始输入中文...' 
            : classicSubMode === 'english'
            ? 'Start typing in English...'
            : '开始输入代码...'
        }
        disabled={isFinished}
        autoComplete="off"
        spellCheck="false"
      />
      
      {/* 提示信息 */}
      <div className="mt-6 text-center bg-gradient-to-r from-senren-lavender/30 via-senren-cream/20 to-senren-rose/30 rounded-2xl p-4 border border-senren-purple/20">
        <p className="text-sm text-senren-purple leading-relaxed">
          {classicSubMode === 'chinese' && '💡 提示：中文模式下，英文标点符号会自动匹配中文标点'}
          {classicSubMode === 'english' && '💡 Tip: Focus on accuracy first, then speed will follow'}
          {classicSubMode === 'code' && '💡 提示：注意代码的语法符号和缩进'}
        </p>
      </div>
    </div>
  )
}

export default TypingArea