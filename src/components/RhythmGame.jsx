import React, { useState, useEffect, useRef, useCallback } from 'react'
import useTypingStore from '../store/typingStore'

const RhythmGame = () => {
  const { mode } = useTypingStore()

  // 浏览器检测
  const isFirefox = () => {
    return navigator.userAgent.toLowerCase().includes('firefox')
  }

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

  // 使用ref存储音符数据，避免频繁状态更新
  const fallingNotesRef = useRef([])
  const recentHitsRef = useRef([])
  const [, forceUpdate] = useState({}) // 用于强制更新UI
  
  const gameAreaRef = useRef(null)
  const animationRef = useRef(null)
  const lastNoteTime = useRef(0)
  const gameStartTime = useRef(null)
  const noteIdCounter = useRef(0)
  const isPlayingRef = useRef(false)
  const lastFrameTime = useRef(0)

  // 游戏配置 - 优化后的参数
  const GAME_CONFIG = {
    noteSpeed: 200, // 像素/秒 - 提高速度确保流畅
    judgeLinePosition: 0.8, // 判定线位置（相对于游戏区域高度）
    spawnInterval: 800, // 音符生成间隔（毫秒）
    perfectRange: 40, // Perfect判定范围（像素）
    goodRange: 80, // Good判定范围（像素）
    badRange: 120, // Bad判定范围（像素）
    gameDuration: 60000, // 游戏时长（毫秒）
    noteLifetime: 3000 // 音符生存时间（毫秒）
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

  // 强制更新UI的函数
  const triggerUpdate = useCallback(() => {
    forceUpdate({})
  }, [])

  // 生成随机音符 - 优化版本
  const generateNote = useCallback(() => {
    const key = KEYS[Math.floor(Math.random() * KEYS.length)]
    noteIdCounter.current += 1

    // 简化的位置分配 - 使用固定网格避免重叠
    const gridPositions = [15, 25, 35, 45, 55, 65, 75, 85] // 8个固定位置
    const availablePositions = gridPositions.filter(gridX => {
      // 检查该位置是否有音符在安全距离内
      return !fallingNotesRef.current.some(note => {
        const horizontalDistance = Math.abs(note.x - gridX)
        const verticalDistance = note.y
        return horizontalDistance < 8 && verticalDistance < 80 // 减小检查范围提高性能
      })
    })

    const x = availablePositions.length > 0 
      ? availablePositions[Math.floor(Math.random() * availablePositions.length)]
      : gridPositions[Math.floor(Math.random() * gridPositions.length)]

    return {
      id: `note_${noteIdCounter.current}`,
      key,
      x,
      y: -50, // 从游戏区域上方开始，确保有足够时间到达判定线
      timestamp: performance.now(),
      speed: GAME_CONFIG.noteSpeed
    }
  }, [])

  // 开始游戏 - 优化版本
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
    
    // 清空ref数据
    fallingNotesRef.current = []
    recentHitsRef.current = []
    
    const now = performance.now()
    gameStartTime.current = now
    lastNoteTime.current = now
    lastFrameTime.current = now
    noteIdCounter.current = 0
    isPlayingRef.current = true
  }

  // 结束游戏 - 优化版本
  const endGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPlaying: false }))
    isPlayingRef.current = false
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

  // 处理按键 - 完全基于ref的版本
  const handleKeyPress = useCallback((event) => {
    if (!isPlayingRef.current) return

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
    const targetNotes = fallingNotesRef.current.filter(note => note.key === pressedKey)

    if (targetNotes.length === 0) {
      // 没有对应音符，扣分
      setGameState(prev => ({
        ...prev,
        score: Math.max(0, prev.score - 50),
        combo: 0
      }))

      recentHitsRef.current.push({
        id: `miss_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        judgment: 'MISS',
        x: 50, // 居中显示
        timestamp: currentTime
      })
      triggerUpdate()
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
      // 命中音符，从ref中移除
      fallingNotesRef.current = fallingNotesRef.current.filter(note => note.id !== closestNote.id)

      setGameState(prev => {
        const newCombo = prev.combo + 1
        const comboBonus = Math.floor(newCombo / 10) * 50
        const totalScore = hitResult.score + comboBonus

        return {
          ...prev,
          score: prev.score + totalScore,
          combo: newCombo,
          maxCombo: Math.max(prev.maxCombo, newCombo),
          hitNotes: prev.hitNotes + 1
        }
      })

      recentHitsRef.current.push({
        id: `hit_${closestNote.id}`,
        judgment: hitResult.judgment,
        x: closestNote.x,
        timestamp: currentTime,
        score: hitResult.score
      })

      triggerUpdate()
    }
  }, [triggerUpdate])

  // 设置键盘监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  // 游戏循环 - 完全基于ref的高性能版本
  useEffect(() => {
    if (!gameState.isPlaying) return

    let animationId = null

    const gameLoop = (currentTime) => {
      // 使用ref检查状态，避免依赖问题
      if (!isPlayingRef.current || !gameStartTime.current) return

      const gameTime = currentTime - gameStartTime.current
      const deltaTime = currentTime - lastFrameTime.current
      lastFrameTime.current = currentTime

      // 检查游戏是否结束
      if (gameTime >= GAME_CONFIG.gameDuration) {
        endGame()
        return
      }

      // 生成新音符
      if (currentTime - lastNoteTime.current >= GAME_CONFIG.spawnInterval) {
        const newNote = generateNote()
        fallingNotesRef.current.push(newNote)
        setGameState(prev => ({ ...prev, totalNotes: prev.totalNotes + 1 }))
        lastNoteTime.current = currentTime
      }

      // 更新音符位置和移除超出屏幕的音符
      const gameHeight = gameAreaRef.current?.clientHeight || 450
      const moveDistance = (GAME_CONFIG.noteSpeed * deltaTime) / 1000 // 基于实际时间差

      let missedCount = 0
      fallingNotesRef.current = fallingNotesRef.current.filter(note => {
        // 更新音符位置
        note.y += moveDistance

        // 检查是否超出屏幕
        if (note.y > gameHeight + 50) {
          missedCount++
          return false // 移除超出屏幕的音符
        }
        return true
      })

      // 如果有音符被错过，重置连击
      if (missedCount > 0) {
        setGameState(prevState => ({
          ...prevState,
          combo: 0,
          missedNotes: prevState.missedNotes + missedCount
        }))
      }

      // 清理旧的命中效果
      recentHitsRef.current = recentHitsRef.current.filter(hit => 
        currentTime - hit.timestamp < 1000
      )

      // 更新游戏时间
      setGameState(prev => ({ ...prev, gameTime }))

      // 强制更新UI以显示新的音符位置
      triggerUpdate()

      // 继续循环
      if (isPlayingRef.current) {
        animationId = requestAnimationFrame(gameLoop)
      }
    }

    // 启动游戏循环
    animationId = requestAnimationFrame(gameLoop)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [gameState.isPlaying, endGame, generateNote, triggerUpdate])

  // 条件渲染检查必须在所有hooks之后
  if (mode !== 'rhythm') return null

  // 如果不是 Firefox 浏览器，显示提示信息
  if (!isFirefox()) {
    return (
      <div className="kawaii-card">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
            ♪ 音游模式
          </h3>

          <div className="text-center py-12">
            <div className="mb-6">
              <div className="text-6xl mb-4">🦊</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">需要 Firefox 浏览器</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                音游模式由于动画兼容性问题，目前仅支持 Firefox 浏览器。<br />
                请使用 Firefox 浏览器来体验完整的音游打字练习功能。
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-6">
              <h4 className="font-semibold text-orange-800 mb-3">为什么需要 Firefox？</h4>
              <div className="text-sm text-orange-700 space-y-2">
                <p>• Chrome/Edge 等浏览器在处理高频率动画时存在性能问题</p>
                <p>• Firefox 对 requestAnimationFrame 的优化更适合音游场景</p>
                <p>• 确保最佳的游戏体验和流畅的音符下落动画</p>
              </div>
            </div>

            <div className="space-y-4">
              <a
                href="https://www.mozilla.org/firefox/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block kawaii-button bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
              >
                下载 Firefox 浏览器
              </a>
              <p className="text-sm text-gray-500">
                或者您可以尝试其他打字练习模式：中文、英文、代码模式
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="kawaii-card">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-senren-purple mb-6 text-center">
          音游模式
        </h3>

        {/* 游戏统计 - 千恋万花风格 */}
        <div className="flex justify-between items-center mb-6 text-sm bg-gradient-to-r from-senren-cream/50 to-senren-rose/30 rounded-2xl p-4 border border-senren-purple/20">
          <div className="flex space-x-6">
            <span className="flex items-center">
              <span className="text-senren-purple mr-1">🌸</span>
              得分: <strong className="text-senren-gold ml-1">{gameState.score}</strong>
            </span>
            <span className="flex items-center">
              <span className="text-senren-purple mr-1">⚡</span>
              连击: <strong className="text-senren-amber ml-1">{gameState.combo}</strong>
            </span>
            <span className="flex items-center">
              <span className="text-senren-purple mr-1">⏰</span>
              时间: <strong className="text-senren-purple ml-1">{Math.ceil((GAME_CONFIG.gameDuration - gameState.gameTime) / 1000)}s</strong>
            </span>
            <span className="flex items-center">
              <span className="text-senren-purple mr-1">🎵</span>
              音符: <strong className="text-senren-sakura ml-1">{fallingNotesRef.current.length}</strong>
            </span>
          </div>
          <div className="text-xs text-senren-purple bg-senren-lavender/30 px-3 py-1 rounded-full">
            命中率: {gameState.totalNotes > 0 ? Math.round((gameState.hitNotes / gameState.totalNotes) * 100) : 100}%
          </div>
        </div>

        {/* 游戏区域 - 千恋万花风格 */}
        <div
          ref={gameAreaRef}
          className="relative bg-gradient-to-b from-senren-lavender/40 via-senren-rose/30 to-senren-cream/50 rounded-3xl border-2 border-senren-purple/30 overflow-hidden shadow-2xl"
          style={{
            height: '450px',
            backgroundImage: `
              radial-gradient(circle at 20% 20%, rgba(255, 183, 197, 0.2) 0%, transparent 40%),
              radial-gradient(circle at 80% 80%, rgba(200, 162, 200, 0.2) 0%, transparent 40%)
            `
          }}
        >
          {/* 判定线 - 千恋万花风格 - 只在游戏进行时显示 */}
          {gameState.isPlaying && (
            <div
              className="absolute left-0 right-0 h-2 bg-gradient-to-r from-senren-gold via-senren-amber to-senren-gold shadow-2xl z-10 rounded-full"
              style={{
                top: `${GAME_CONFIG.judgeLinePosition * 100}%`,
                boxShadow: '0 0 20px rgba(244, 208, 63, 0.6), 0 0 40px rgba(255, 191, 0, 0.3)'
              }}
            />
          )}

          {/* 下落的音符 */}
          {fallingNotesRef.current.map(note => (
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
          {recentHitsRef.current.map(hit => (
            <div
              key={hit.id}
              className={`rhythm-hit-effect ${hit.judgment === 'PERFECT' ? 'rhythm-perfect' :
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

          {/* 游戏开始/结束界面 - 千恋万花风格 */}
          {!gameState.isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-br from-senren-purple/80 via-senren-sakura/70 to-senren-lavender/80 backdrop-blur-md flex items-center justify-center">
              <div className="text-center text-white bg-gradient-to-br from-senren-cream/20 to-senren-rose/20 rounded-3xl p-8 border border-white/30 backdrop-blur-sm shadow-2xl">
                {gameState.totalNotes > 0 ? (
                  <div className="space-y-6">
                    <div className="text-4xl mb-4">🌸</div>
                    <h3 className="text-3xl font-bold text-senren-gold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      游戏结束！
                    </h3>
                    <div className="space-y-3 text-lg">
                      <p className="flex items-center justify-center">
                        <span className="mr-2">🌟</span>
                        最终得分: <span className="text-senren-gold font-bold ml-2">{gameState.score}</span>
                      </p>
                      <p className="flex items-center justify-center">
                        <span className="mr-2">⚡</span>
                        最高连击: <span className="text-senren-amber font-bold ml-2">{gameState.maxCombo}</span>
                      </p>
                      <p className="flex items-center justify-center">
                        <span className="mr-2">🎯</span>
                        命中率: <span className="text-senren-cream font-bold ml-2">{Math.round((gameState.hitNotes / gameState.totalNotes) * 100)}%</span>
                      </p>
                    </div>
                    <button
                      onClick={startGame}
                      className="kawaii-button text-senren-purple hover:text-white"
                    >
                      再来一局
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-5xl mb-4">🌸🎵🌸</div>
                    <h3 className="text-3xl font-bold text-senren-gold" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                      音游模式
                    </h3>
                    <div className="space-y-3 text-base text-senren-cream">
                      <p>🎹 使用键盘上所有可打字的字符</p>
                      <p>🎼 包括字母、数字、标点符号和空格</p>
                      <p>🎵 根据下落音符显示的字符按对应按键</p>
                      <p>⏰ 当音符到达判定线时按下对应按键</p>
                    </div>
                    <button
                      onClick={startGame}
                      className="kawaii-button text-senren-purple hover:text-white"
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
        <div className="mt-6">
          <div className="text-center text-base text-senren-purple mb-4 font-medium">
            支持的字符类型
          </div>
          <div className="grid grid-cols-3 gap-6 text-sm">
            <div className="text-center bg-gradient-to-br from-senren-cream/40 to-senren-rose/30 rounded-2xl p-4 border border-senren-purple/20">
              <div className="font-semibold mb-2 text-senren-purple">🔤 字母</div>
              <div className="text-senren-sakura">A-Z (26个)</div>
            </div>
            <div className="text-center bg-gradient-to-br from-senren-lavender/40 to-senren-cream/30 rounded-2xl p-4 border border-senren-purple/20">
              <div className="font-semibold mb-2 text-senren-purple">🔢 数字</div>
              <div className="text-senren-sakura">0-9 (10个)</div>
            </div>
            <div className="text-center bg-gradient-to-br from-senren-rose/40 to-senren-lavender/30 rounded-2xl p-4 border border-senren-purple/20">
              <div className="font-semibold mb-2 text-senren-purple">🎭 符号</div>
              <div className="text-senren-sakura">标点符号、空格等</div>
            </div>
          </div>
        </div>

        {/* 操作提示 */}
        <div className="mt-6 text-center bg-gradient-to-r from-senren-gold/20 via-senren-amber/10 to-senren-gold/20 rounded-2xl p-4 border border-senren-gold/30">
          <p className="text-sm text-senren-purple leading-relaxed">
            💡 <strong>操作提示：</strong>观察下落的音符，当它们接近判定线时按下对应按键
          </p>
          <p className="text-xs text-senren-sakura mt-2">
            连续命中可获得连击奖励
          </p>
        </div>
      </div>
    </div>
  )
}

export default RhythmGame