import React, { useState, useEffect, useRef, useCallback } from 'react'
import useTypingStore from '../store/typingStore'

const RhythmGame = () => {
  const { mode, isFinished } = useTypingStore()
  const [gameState, setGameState] = useState({
    score: 0,
    combo: 0,
    maxCombo: 0,
    totalNotes: 0,
    hitNotes: 0,
    missedNotes: 0,
    isPlaying: false,
    gameTime: 0
  })
  
  // 新的状态驱动动画系统
  const [fallingNotes, setFallingNotes] = useState([])
  const [recentHits, setRecentHits] = useState([])
  const gameAreaRef = useRef(null)
  const animationRef = useRef(null)
  const lastNoteTime = useRef(0)
  const gameStartTime = useRef(null)
  const noteIdCounter = useRef(0)
  const isPlayingRef = useRef(false) // 添加这个ref来避免依赖问题
  
  // 游戏配置
  const GAME_CONFIG = {
    noteSpeed: 200, // 像素/秒
    judgeLinePosition: 0.8, // 判定线位置（相对于游戏区域高度）
    spawnInterval: 800, // 音符生成间隔（毫秒）- 稍微加快
    perfectRange: 30, // Perfect判定范围（像素）
    goodRange: 60, // Good判定范围（像素）
    badRange: 100, // Bad判定范围（像素）
    gameDuration: 60000 // 游戏时长（毫秒）
  }
  
  // 可能的按键 - 包含所有键盘可打字字符
  const KEYS = [
    // 字母
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    // 数字
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    // 常用标点符号
    '.', ',', '?', '!', ';', ':', "'", '"', '-', '_', '(', ')', '[', ']', 
    '{', '}', '/', '\\', '|', '@', '#', '$', '%', '^', '&', '*', '+', '=',
    '`', '~', '<', '>', ' '
  ]
  
  // 生成随机音符 - 新的状态驱动版本
  const generateNote = useCallback(() => {
    const key = KEYS[Math.floor(Math.random() * KEYS.length)]
    noteIdCounter.current += 1
    return {
      id: `note_${noteIdCounter.current}`,
      key,
      x: Math.random() * 70 + 15, // 随机位置，留出边距
      y: 0, // 从游戏区域顶部开始
      timestamp: performance.now()
    }
  }, [])
  
  // 开始游戏 - 新的状态驱动版本
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      score: 0,
      combo: 0,
      maxCombo: 0,
      totalNotes: 0,
      hitNotes: 0,
      missedNotes: 0,
      gameTime: 0
    }))
    setFallingNotes([])
    setRecentHits([])
    const now = performance.now()
    gameStartTime.current = now
    lastNoteTime.current = now
    noteIdCounter.current = 0
    isPlayingRef.current = true // 同步更新ref
  }
  
  // 结束游戏 - 新的状态驱动版本
  const endGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false }))
    isPlayingRef.current = false // 同步更新ref
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])
  
  // 判定音符命中
  const judgeHit = (note, currentTime) => {
    if (!gameAreaRef.current) return null
    
    const gameHeight = gameAreaRef.current.clientHeight
    const judgeLineY = gameHeight * GAME_CONFIG.judgeLinePosition
    const distance = Math.abs(note.y - judgeLineY)
    
    let judgment = null
    let score = 0
    
    if (distance <= GAME_CONFIG.perfectRange) {
      judgment = 'PERFECT'
      score = 300
    } else if (distance <= GAME_CONFIG.goodRange) {
      judgment = 'GOOD'
      score = 200
    } else if (distance <= GAME_CONFIG.badRange) {
      judgment = 'BAD'
      score = 100
    }
    
    return { judgment, score, distance }
  }
  
  // 处理按键 - 新的状态驱动版本
  const handleKeyPress = useCallback((event) => {
    if (!gameState.isPlaying) return
    
    // 获取按下的键
    let pressedKey = event.key
    
    // 处理特殊键
    if (pressedKey === ' ') {
      pressedKey = ' ' // 空格键
    } else if (pressedKey.length === 1) {
      pressedKey = pressedKey.toUpperCase() // 字母转大写
    } else {
      return // 忽略功能键等
    }
    
    if (!KEYS.includes(pressedKey)) return
    
    event.preventDefault()
    
    // 查找最接近判定线的对应按键音符
    const currentTime = performance.now()
    const targetNotes = fallingNotes.filter(note => note.key === pressedKey)
    
    if (targetNotes.length === 0) {
      // 没有对应音符，扣分
      setGameState(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 50),
        combo: 0
      }))
      
      setRecentHits(prev => [...prev, {
        id: `miss_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        judgment: 'MISS',
        x: 50, // 居中显示
        timestamp: currentTime
      }])
      return
    }
    
    // 找到最接近判定线的音符
    const gameHeight = gameAreaRef.current?.clientHeight || 450
    const judgeLineY = gameHeight * GAME_CONFIG.judgeLinePosition
    
    const closestNote = targetNotes.reduce((closest, note) => {
      const currentDistance = Math.abs(note.y - judgeLineY)
      const closestDistance = Math.abs(closest.y - judgeLineY)
      return currentDistance < closestDistance ? note : closest
    })
    
    const hitResult = judgeHit(closestNote, currentTime)
    
    if (hitResult && hitResult.judgment) {
      // 命中音符
      setFallingNotes(prev => prev.filter(note => note.id !== closestNote.id))
      
      const newCombo = gameState.combo + 1
      const comboBonus = Math.floor(newCombo / 10) * 50
      const totalScore = hitResult.score + comboBonus
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + totalScore,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo),
        hitNotes: prev.hitNotes + 1
      }))
      
      setRecentHits(prev => [...prev, {
        id: `hit_${closestNote.id}`,
        judgment: hitResult.judgment,
        x: closestNote.x,
        timestamp: currentTime,
        score: totalScore
      }])
    }
  }, [gameState.isPlaying, gameState.combo, fallingNotes])
  
  // 设置键盘监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])
  
  // 全新的状态驱动游戏循环 - 修复版本
  useEffect(() => {
    if (!gameState.isPlaying) return

    const gameLoop = () => {
      // 使用ref检查状态，避免依赖问题
      if (!isPlayingRef.current || !gameStartTime.current) return

      const currentTime = performance.now()
      const gameTime = currentTime - gameStartTime.current

      // 检查游戏是否结束
      if (gameTime >= GAME_CONFIG.gameDuration) {
        endGame()
        return
      }

      // 生成新音符
      if (currentTime - lastNoteTime.current >= GAME_CONFIG.spawnInterval) {
        const newNote = generateNote()
        setFallingNotes(prev => [...prev, newNote])
        setGameState(prev => ({ ...prev, totalNotes: prev.totalNotes + 1 }))
        lastNoteTime.current = currentTime
      }

      // 更新音符位置和移除超出屏幕的音符
      setFallingNotes(prev => {
        const gameHeight = gameAreaRef.current?.clientHeight || 450
        const moveDistance = GAME_CONFIG.noteSpeed / 60 // 60fps

        const updatedNotes = prev.map(note => ({
          ...note,
          y: note.y + moveDistance
        }))

        // 过滤掉超出屏幕的音符
        const visibleNotes = updatedNotes.filter(note => note.y <= gameHeight + 20)
        const missedNotes = updatedNotes.length - visibleNotes.length

        // 如果有音符被错过，重置连击
        if (missedNotes > 0) {
          setGameState(prevState => ({
            ...prevState,
            combo: 0,
            missedNotes: prevState.missedNotes + missedNotes
          }))
        }

        return visibleNotes
      })

      // 清理旧的命中效果
      setRecentHits(prev => prev.filter(hit => currentTime - hit.timestamp < 1000))

      // 更新游戏时间
      setGameState(prev => ({ ...prev, gameTime }))

      // 继续循环 - 使用ref检查状态
      if (isPlayingRef.current) {
        animationRef.current = requestAnimationFrame(gameLoop)
      }
    }

    animationRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameState.isPlaying]) // 保持最小依赖
  
  // 条件渲染检查必须在所有hooks之后
  if (mode !== 'rhythm') return null
  
  return (
    <div className="kawaii-card">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          ♪ 音游模式
        </h3>
        
        {/* 游戏统计 */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex space-x-4">
            <span>得分: <strong className="text-kawaii-orange">{gameState.score}</strong></span>
            <span>连击: <strong className="text-kawaii-yellow">{gameState.combo}</strong></span>
            <span>时间: <strong>{Math.ceil((GAME_CONFIG.gameDuration - gameState.gameTime) / 1000)}s</strong></span>
            <span>音符: <strong className="text-blue-500">{fallingNotes.length}</strong></span>
          </div>
          <div className="text-xs text-gray-500">
            命中率: {gameState.totalNotes > 0 ? Math.round((gameState.hitNotes / gameState.totalNotes) * 100) : 100}%
          </div>
        </div>
        
        {/* 游戏区域 */}
        <div 
          ref={gameAreaRef}
          className="relative bg-gradient-to-b from-purple-100 to-pink-100 rounded-2xl border-2 border-gray-200 overflow-hidden"
          style={{ height: '450px' }}
        >
          {/* 判定线 */}
          <div 
            className="absolute left-0 right-0 h-1 bg-kawaii-orange shadow-lg z-10"
            style={{ top: `${GAME_CONFIG.judgeLinePosition * 100}%` }}
          />
          
          {/* 下落的音符 */}
          {fallingNotes.map(note => (
            <div
              key={note.id}
              className="rhythm-note"
              style={{
                left: `${note.x}%`,
                top: `${note.y}px`
              }}
            >
              {note.key === ' ' ? '␣' : note.key}
            </div>
          ))}
          
          {/* 命中效果 */}
          {recentHits.map(hit => (
            <div
              key={hit.id}
              className={`rhythm-hit-effect ${
                hit.judgment === 'PERFECT' ? 'rhythm-perfect' :
                hit.judgment === 'GOOD' ? 'rhythm-good' :
                hit.judgment === 'BAD' ? 'rhythm-bad' :
                'rhythm-miss'
              }`}
              style={{
                left: `${hit.x}%`,
                top: `${GAME_CONFIG.judgeLinePosition * 100 - 10}%`
              }}
            >
              {hit.judgment}
              {hit.score && <div className="text-sm">+{hit.score}</div>}
            </div>
          ))}
          
          {/* 游戏开始/结束界面 */}
          {!gameState.isPlaying && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                {gameState.totalNotes > 0 ? (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">游戏结束！</h3>
                    <div className="space-y-2">
                      <p>最终得分: <span className="text-kawaii-yellow">{gameState.score}</span></p>
                      <p>最高连击: <span className="text-kawaii-orange">{gameState.maxCombo}</span></p>
                      <p>命中率: <span className="text-green-400">{Math.round((gameState.hitNotes / gameState.totalNotes) * 100)}%</span></p>
                    </div>
                    <button
                      onClick={startGame}
                      className="kawaii-button"
                    >
                      再来一局
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold">音游模式</h3>
                    <p>使用键盘上所有可打字的字符</p>
                    <p>包括字母、数字、标点符号和空格</p>
                    <p>根据下落音符显示的字符按对应按键</p>
                    <p>当音符到达判定线时按下对应按键</p>
                    <button
                      onClick={startGame}
                      className="kawaii-button"
                    >
                      开始游戏
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* 键盘提示 */}
        <div className="mt-4">
          <div className="text-center text-sm text-gray-600 mb-2">
            <strong>支持的字符类型：</strong>
          </div>
          <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
            <div className="text-center">
              <div className="font-semibold mb-1">字母</div>
              <div>A-Z (26个)</div>
            </div>
            <div className="text-center">
              <div className="font-semibold mb-1">数字</div>
              <div>0-9 (10个)</div>
            </div>
            <div className="text-center">
              <div className="font-semibold mb-1">符号</div>
              <div>标点符号、空格等</div>
            </div>
          </div>
        </div>
        
        {/* 操作提示 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            💡 提示：看到下落的字符，在音符接近判定线时按对应的键！连击可以获得额外分数
          </p>
        </div>
      </div>
    </div>
  )
}

export default RhythmGame