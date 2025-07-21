import React, { useState, useEffect, useRef } from 'react'
import useTypingStore from '../store/typingStore'

const RhythmGame = () => {
  const { mode } = useTypingStore()
  const [fallingChars, setFallingChars] = useState([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [judgmentHistory, setJudgmentHistory] = useState([])
  const [currentJudgment, setCurrentJudgment] = useState(null)
  const gameAreaRef = useRef(null)
  const animationRef = useRef(null)
  const isAnimatingRef = useRef(false)

  // 评分配置
  const SCORE_CONFIG = {
    perfect: 100,
    good: 70,
    bad: 30,
    miss: 0
  }

  // 判定区域配置（相对于判定线的像素距离）
  const JUDGMENT_ZONES = {
    perfect: 15,  // ±15px
    good: 30,     // ±30px
    bad: 50       // ±50px
  }

  // 条件渲染检查
  if (mode !== 'rhythm') return null

  // 生成随机矩形类型
  const generateRandomBlock = () => {
    const blockTypes = ['normal', 'special', 'bonus', 'combo']
    return blockTypes[Math.floor(Math.random() * blockTypes.length)]
  }

  // 生成随机颜色
  const generateRandomColor = () => {
    const colors = [
      'text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500',
      'text-purple-500', 'text-pink-500', 'text-indigo-500', 'text-cyan-500',
      'text-orange-500', 'text-teal-500'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  // 判定函数
  const judgeHit = (block, gameArea) => {
    const judgmentLineY = gameArea.offsetHeight - 56 // 判定线位置（bottom-14 = 56px）
    const blockCenterY = block.y + block.height / 2
    const distance = Math.abs(blockCenterY - judgmentLineY)

    if (distance <= JUDGMENT_ZONES.perfect) {
      return 'perfect'
    } else if (distance <= JUDGMENT_ZONES.good) {
      return 'good'
    } else if (distance <= JUDGMENT_ZONES.bad) {
      return 'bad'
    } else {
      return 'miss'
    }
  }

  // 处理键盘输入
  const handleKeyPress = (key) => {
    const gameArea = gameAreaRef.current
    if (!gameArea) return

    // 查找匹配的下落块（最接近判定线的）
    const matchingBlocks = fallingChars.filter(block =>
      block.char.toLowerCase() === key.toLowerCase()
    )

    if (matchingBlocks.length === 0) return

    // 找到最接近判定线的块
    const judgmentLineY = gameArea.offsetHeight - 56
    const closestBlock = matchingBlocks.reduce((closest, current) => {
      const closestDistance = Math.abs((closest.y + closest.height / 2) - judgmentLineY)
      const currentDistance = Math.abs((current.y + current.height / 2) - judgmentLineY)
      return currentDistance < closestDistance ? current : closest
    })

    // 判定
    const judgment = judgeHit(closestBlock, gameArea)

    // 更新分数和连击
    const points = SCORE_CONFIG[judgment]
    setScore(prevScore => prevScore + points)

    if (judgment !== 'miss') {
      setCombo(prevCombo => prevCombo + 1)
    } else {
      setCombo(0)
    }

    // 显示判定结果
    setCurrentJudgment({
      type: judgment,
      points: points,
      timestamp: Date.now()
    })

    // 记录判定历史
    setJudgmentHistory(prev => [...prev.slice(-9), judgment])

    // 移除被击中的块
    setFallingChars(prevChars =>
      prevChars.filter(block => block.id !== closestBlock.id)
    )
  }

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isAnimatingRef.current) return

      const key = event.key.toUpperCase()
      // 处理特殊键
      const keyMap = {
        'SEMICOLON': ';',
        'COMMA': ',',
        'PERIOD': '.',
        'SLASH': '/'
      }

      const mappedKey = keyMap[key] || key
      handleKeyPress(mappedKey)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [fallingChars])

  // 清除判定显示
  useEffect(() => {
    if (currentJudgment) {
      const timer = setTimeout(() => {
        setCurrentJudgment(null)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [currentJudgment])

  // 创建新的下落矩形块
  const createFallingBlock = () => {
    if (!gameAreaRef.current) return null

    const gameArea = gameAreaRef.current
    const blockType = generateRandomBlock()

    // 所有键盘字符 - 按QWERTY布局排列
    const allKeys = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '0',
      'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P',
      'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';',
      'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'
    ]

    // 随机选择一个字符
    const randomKey = allKeys[Math.floor(Math.random() * allKeys.length)]

    // 计算按键在底部的位置 - 40个字符均匀分布
    const keyWidth = 24
    const keyHeight = 24
    const totalKeys = allKeys.length
    const keyIndex = allKeys.indexOf(randomKey)

    // 计算可用宽度和间距
    const gameWidth = gameArea.offsetWidth
    const totalKeysWidth = totalKeys * keyWidth
    const availableSpace = gameWidth - 40 // 左右各留20px边距
    const spacing = Math.max(2, (availableSpace - totalKeysWidth) / (totalKeys - 1))

    // 计算目标位置
    const targetX = 20 + keyIndex * (keyWidth + spacing)
    const targetY = gameArea.offsetHeight - keyHeight - 10

    // 起始位置：从顶部对应位置开始
    const startX = targetX
    const startY = -keyHeight

    // 根据类型设置不同的样式
    const blockStyles = {
      normal: {
        bgColor: 'bg-blue-500',
        borderColor: 'border-blue-600',
        glowColor: 'rgba(59, 130, 246, 0.5)'
      },
      special: {
        bgColor: 'bg-purple-500',
        borderColor: 'border-purple-600',
        glowColor: 'rgba(147, 51, 234, 0.5)'
      },
      bonus: {
        bgColor: 'bg-yellow-500',
        borderColor: 'border-yellow-600',
        glowColor: 'rgba(234, 179, 8, 0.5)'
      },
      combo: {
        bgColor: 'bg-pink-500',
        borderColor: 'border-pink-600',
        glowColor: 'rgba(236, 72, 153, 0.5)'
      }
    }

    return {
      id: Date.now() + Math.random(),
      type: blockType,
      char: randomKey,
      x: startX,
      y: startY,
      targetX: targetX,
      targetY: targetY,
      speed: 4 + Math.random() * 3, // 随机速度 4-7
      width: keyWidth,
      height: keyHeight,
      style: blockStyles[blockType]
    }
  }

  // 使用定时器驱动的动画系统，避免requestAnimationFrame的页面焦点问题
  useEffect(() => {
    isAnimatingRef.current = true

    // 主动画循环 - 使用setInterval替代requestAnimationFrame
    const animationInterval = setInterval(() => {
      if (!isAnimatingRef.current) return

      setFallingChars(prevChars => {
        const gameArea = gameAreaRef.current
        if (!gameArea) return prevChars

        const gameHeight = gameArea.offsetHeight

        // 更新现有矩形块位置
        let updatedBlocks = prevChars
          .map(block => {
            let newX = block.x
            let newY = block.y

            // 垂直下落到底部判定线
            newY = block.y + block.speed

            return {
              ...block,
              x: newX,
              y: newY
            }
          })
          .filter(block => {
            // 检查是否超出判定区域（Miss）
            const judgmentLineY = gameHeight - 56
            const blockCenterY = block.y + block.height / 2
            const gameWidth = gameArea.offsetWidth

            // 如果方块已经超出最大判定区域，记录为Miss
            if (blockCenterY > judgmentLineY + JUDGMENT_ZONES.bad) {
              // 记录Miss
              setScore(prevScore => prevScore + SCORE_CONFIG.miss)
              setCombo(0)
              setJudgmentHistory(prev => [...prev.slice(-9), 'miss'])

              // 显示Miss判定
              setCurrentJudgment({
                type: 'miss',
                points: SCORE_CONFIG.miss,
                timestamp: Date.now()
              })

              return false // 移除这个方块
            }

            // 移除超出屏幕的矩形块
            return block.y < gameHeight + 60 &&
              block.x > -block.width &&
              block.x < gameWidth + block.width
          })

        // 随机添加新矩形块
        if (Math.random() < 0.12) { // 12%概率生成新矩形块
          const newBlock = createFallingBlock()
          if (newBlock) {
            updatedBlocks.push(newBlock)
          }
        }

        return updatedBlocks
      })
    }, 50) // 每50ms更新一次，约20FPS

    // 矩形块生成器 - 确保始终有足够的矩形块
    const blockGeneratorInterval = setInterval(() => {
      if (!isAnimatingRef.current) return

      setFallingChars(prevChars => {
        // 如果矩形块太少，强制生成新矩形块
        if (prevChars.length < 1) {
          const newBlock = createFallingBlock()
          return newBlock ? [...prevChars, newBlock] : prevChars
        }
        return prevChars
      })
    }, 200) // 每200ms检查一次

    return () => {
      isAnimatingRef.current = false
      clearInterval(animationInterval)
      clearInterval(blockGeneratorInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-purple-50 to-blue-50">
      {/* 标题区域 */}
      <div className="text-center py-6 bg-white/80 backdrop-blur-sm border-b border-purple-200">
        <h3 className="text-2xl font-bold text-senren-purple">
          🎹 键盘音游模式
        </h3>
        <p className="text-sm text-purple-600 mt-2">
          全键盘练习 - 40个字符精确下落体验
        </p>
      </div>

      {/* 游戏区域 - 真正的全屏 */}
      <div
        ref={gameAreaRef}
        className="relative bg-gradient-to-b from-purple-50 to-blue-50 overflow-hidden"
        style={{
          height: 'calc(100vh - 120px)',
          width: '100vw'
        }}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-20 text-4xl">🎵</div>
          <div className="absolute top-4 right-20 text-4xl">🎶</div>
          <div className="absolute bottom-20 left-20 text-4xl">🎼</div>
          <div className="absolute bottom-20 right-20 text-4xl">🎹</div>
        </div>



        {/* 下落的矩形块 */}
        {fallingChars.map(block => (
          <div
            key={block.id}
            className={`absolute ${block.style.bgColor} ${block.style.borderColor} border-2 rounded-lg select-none pointer-events-none transition-all duration-75 flex items-center justify-center font-bold text-white text-sm shadow-lg`}
            style={{
              left: `${block.x}px`,
              top: `${block.y}px`,
              width: `${block.width}px`,
              height: `${block.height}px`,
              boxShadow: `0 4px 8px ${block.style.glowColor}, 0 0 12px ${block.style.glowColor}`,
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}
          >
            {block.char}
          </div>
        ))}

        {/* 底部判定线区域 */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-200/80 to-transparent pointer-events-none">
          {/* 主判定线 */}
          <div className="absolute bottom-14 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 judgment-line">
            {/* 判定线光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 blur-sm opacity-60"></div>
            {/* 额外的光晕效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 blur-md opacity-40"></div>
          </div>

          {/* 判定线装饰 */}
          <div className="absolute bottom-16 left-20 right-20 flex justify-between items-center">
            <div className="text-purple-600 text-lg font-bold">♪</div>
            <div className="text-pink-600 text-lg font-bold">PERFECT</div>
            <div className="text-purple-600 text-lg font-bold">♫</div>
          </div>

          {/* 底部键盘提示区域 - 所有字符 */}
          <div className="absolute bottom-2 left-5 right-5 flex justify-between items-center">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/'].map((key, index) => (
              <div
                key={key}
                className="w-6 h-6 bg-white/60 border border-purple-300 rounded text-xs flex items-center justify-center text-purple-700 font-bold flex-shrink-0"
                style={{
                  animation: `keyGlow ${2 + index * 0.02}s ease-in-out infinite alternate`
                }}
              >
                {key}
              </div>
            ))}
          </div>
        </div>

        {/* 游戏状态面板 */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-10">
          {/* 左侧：分数和连击 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-purple-200 shadow-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-800 mb-1">
                {score.toLocaleString()}
              </div>
              <div className="text-xs text-purple-600 mb-3">SCORE</div>

              <div className="text-xl font-bold text-pink-600 mb-1">
                {combo}
              </div>
              <div className="text-xs text-pink-500">COMBO</div>
            </div>
          </div>

          {/* 右侧：判定历史 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-purple-200 shadow-lg">
            <div className="text-xs text-purple-600 mb-2 text-center">JUDGMENT</div>
            <div className="flex gap-1">
              {judgmentHistory.slice(-10).map((judgment, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${judgment === 'perfect' ? 'bg-green-500' :
                    judgment === 'good' ? 'bg-blue-500' :
                      judgment === 'bad' ? 'bg-yellow-500' :
                        'bg-red-500'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 判定结果显示 */}
        {currentJudgment && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
            <div className={`text-center animate-bounce ${currentJudgment.type === 'perfect' ? 'text-green-500' :
              currentJudgment.type === 'good' ? 'text-blue-500' :
                currentJudgment.type === 'bad' ? 'text-yellow-500' :
                  'text-red-500'
              }`}>
              <div className="text-4xl font-bold mb-2 drop-shadow-lg">
                {currentJudgment.type.toUpperCase()}
              </div>
              <div className="text-2xl font-bold drop-shadow-lg">
                +{currentJudgment.points}
              </div>
            </div>
          </div>
        )}

        {/* 游戏提示（缩小并移到右下角） */}
        <div className="absolute bottom-24 right-4 pointer-events-none">
          <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-purple-200 shadow-lg">
            <div className="text-xl mb-1">🎹</div>
            <h4 className="font-semibold text-purple-800 text-sm mb-1">音游模式</h4>
            <p className="text-xs text-purple-600">
              按键击中下落方块！
            </p>
          </div>
        </div>
      </div>


      {/* 退出按钮 */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm border border-purple-300 rounded-lg text-purple-700 font-medium transition-all duration-200 hover:scale-105"
        >
          退出音游
        </button>
      </div>
    </div>
  )
}

export default RhythmGame