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
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          ✨ 经典
        </h3>
        
        {/* 经典模式子选项 */}
        <ClassicSubModeSelector />
        
        {/* 文本显示区域 */}
        <div className="typing-text p-6 bg-gray-50 rounded-2xl border-2 border-gray-200 min-h-[200px] leading-loose whitespace-pre-wrap break-words">
          {renderText()}
          
          {/* 光标 */}
          {currentIndex < currentText.length && (
            <span className="inline-block w-0.5 h-8 bg-kawaii-orange animate-pulse ml-1"></span>
          )}
        </div>
      </div>
      
      {/* 隐藏的输入框 */}
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={handleInputChange}
        className="w-full p-4 border-2 border-kawaii-orange rounded-xl text-lg focus:outline-none focus:ring-4 focus:ring-kawaii-orange/30 transition-all duration-200"
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
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          {classicSubMode === 'chinese' && '💡 提示：中文模式下，英文标点符号会自动匹配中文标点'}
          {classicSubMode === 'english' && '💡 Tip: Focus on accuracy first, then speed will follow'}
          {classicSubMode === 'code' && '💡 提示：注意代码的语法符号和缩进'}
        </p>
      </div>
    </div>
  )
}

export default TypingArea