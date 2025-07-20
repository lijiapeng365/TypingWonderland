import { create } from 'zustand'

const useTypingStore = create((set, get) => ({
  // 基本状态
  mode: 'classic', // 'classic' | 'rhythm'
  classicSubMode: 'chinese', // 'chinese' | 'english' | 'code' - 经典模式下的子模式
  isTyping: false,
  isFinished: false,
  startTime: null,
  endTime: null,
  
  // 文本相关
  currentText: '',
  userInput: '',
  currentIndex: 0,
  
  // 统计数据
  correctChars: 0,
  incorrectChars: 0,
  totalChars: 0,
  wpm: 0,
  cpm: 0,
  accuracy: 100,
  
  // 角色状态
  characterMood: 'happy', // 'happy' | 'neutral' | 'sad'
  
  // 动作
  setMode: (mode) => set({ mode }),
  setClassicSubMode: (subMode) => set({ classicSubMode: subMode }),
  
  setCurrentText: (text) => set({ 
    currentText: text,
    userInput: '',
    currentIndex: 0,
    correctChars: 0,
    incorrectChars: 0,
    totalChars: 0,
    isTyping: false,
    isFinished: false,
    startTime: null,
    endTime: null,
    wpm: 0,
    cpm: 0,
    accuracy: 100
  }),
  
  startTyping: () => set({ 
    isTyping: true, 
    startTime: Date.now() 
  }),
  
  updateInput: (input) => {
    const state = get()
    if (!state.isTyping && input.length > 0) {
      state.startTyping()
    }
    
    const currentText = state.currentText
    const correctChars = input.split('').filter((char, index) => {
      if (index >= currentText.length) return false
      
      if (state.classicSubMode === 'chinese') {
        // 中文模式：英文标点符号与中文标点符号视为相同
        const sourceChar = currentText[index]
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
        
        return punctuationMap[char] === sourceChar || char === sourceChar
      } else {
        // 英文/代码模式：严格匹配
        const sourceChar = currentText[index]
        return char === sourceChar
      }
    }).length
    
    const incorrectChars = input.length - correctChars
    const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100
    
    // 计算WPM/CPM
    const timeElapsed = state.startTime ? (Date.now() - state.startTime) / 1000 / 60 : 0
    const wpm = timeElapsed > 0 ? Math.round((correctChars / 5) / timeElapsed) : 0
    const cpm = timeElapsed > 0 ? Math.round(correctChars / timeElapsed) : 0
    
    // 更新角色心情
    let characterMood = 'happy'
    if (accuracy < 80) {
      characterMood = 'sad'
    } else if (accuracy < 95) {
      characterMood = 'neutral'
    }
    
    // 检查是否完成
    const isFinished = input.length >= currentText.length && correctChars === currentText.length
    
    set({
      userInput: input,
      currentIndex: input.length,
      correctChars,
      incorrectChars,
      totalChars: input.length,
      accuracy,
      wpm,
      cpm,
      characterMood,
      isFinished,
      endTime: isFinished ? Date.now() : null
    })
  },
  
  resetTyping: () => {
    const state = get()
    set({
      userInput: '',
      currentIndex: 0,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      isTyping: false,
      isFinished: false,
      startTime: null,
      endTime: null,
      wpm: 0,
      cpm: 0,
      accuracy: 100,
      characterMood: 'happy'
    })
  }
}))

export default useTypingStore