import React, { useState, useEffect, useRef } from 'react'
import useTypingStore from '../store/typingStore'

const RhythmGame = () => {
  const { mode } = useTypingStore()
  const [fallingChars, setFallingChars] = useState([])
  const gameAreaRef = useRef(null)
  const animationRef = useRef(null)
  const isAnimatingRef = useRef(false)

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

  // 创建新的下落矩形块
  const createFallingBlock = () => {
    if (!gameAreaRef.current) return null

    const gameArea = gameAreaRef.current
    const blockWidth = 50
    const maxX = gameArea.offsetWidth - blockWidth

    const blockType = generateRandomBlock()

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
      x: Math.random() * maxX,
      y: -60,
      speed: 2 + Math.random() * 2, // 随机速度 2-4
      width: blockWidth,
      height: 40,
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
          .map(block => ({
            ...block,
            y: block.y + block.speed
          }))
          .filter(block => block.y < gameHeight + 60) // 移除超出屏幕的矩形块

        // 随机添加新矩形块
        if (Math.random() < 0.3) { // 30%概率生成新矩形块
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
        if (prevChars.length < 3) {
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
    <div className="kawaii-card">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-senren-purple mb-6 text-center">
          音游模式
        </h3>

        {/* 游戏区域 */}
        <div
          ref={gameAreaRef}
          className="relative bg-gradient-to-b from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200 overflow-hidden"
          style={{ height: '400px', width: '100%' }}
        >
          {/* 背景装饰 */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-20 text-4xl">🎵</div>
            <div className="absolute top-4 right-20 text-4xl">🎶</div>
            <div className="absolute bottom-20 left-20 text-4xl">🎼</div>
            <div className="absolute bottom-20 right-20 text-4xl">🎹</div>
          </div>

          {/* 左侧判定线区域 */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-purple-200/80 to-transparent pointer-events-none">
            {/* 左侧判定线 */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 judgment-line">
              {/* 判定线光效 */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-400 via-pink-400 to-purple-400 blur-sm opacity-60"></div>
              {/* 额外的光晕效果 */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-300 via-pink-300 to-purple-300 blur-md opacity-40"></div>
            </div>

            {/* 左侧键盘提示区域 */}
            <div className="absolute left-1 top-0 bottom-0 flex flex-col justify-center space-y-2">
              {['A', 'S', 'D', 'F', 'G'].map((key, index) => (
                <div
                  key={key}
                  className="w-6 h-6 bg-white/60 border border-purple-300 rounded text-xs flex items-center justify-center text-purple-700 font-bold"
                  style={{
                    animation: `keyGlow ${2.5 + index * 0.1}s ease-in-out infinite alternate`
                  }}
                >
                  {key}
                </div>
              ))}
            </div>
          </div>

          {/* 右侧判定线区域 */}
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-purple-200/80 to-transparent pointer-events-none">
            {/* 右侧判定线 */}
            <div className="absolute right-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-purple-500 judgment-line">
              {/* 判定线光效 */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-400 via-pink-400 to-purple-400 blur-sm opacity-60"></div>
              {/* 额外的光晕效果 */}
              <div className="absolute inset-0 bg-gradient-to-b from-purple-300 via-pink-300 to-purple-300 blur-md opacity-40"></div>
            </div>

            {/* 右侧键盘提示区域 */}
            <div className="absolute right-1 top-0 bottom-0 flex flex-col justify-center space-y-2">
              {['H', 'J', 'K', 'L', ';'].map((key, index) => (
                <div
                  key={key}
                  className="w-6 h-6 bg-white/60 border border-purple-300 rounded text-xs flex items-center justify-center text-purple-700 font-bold"
                  style={{
                    animation: `keyGlow ${3 + index * 0.1}s ease-in-out infinite alternate`
                  }}
                >
                  {key}
                </div>
              ))}
            </div>
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
              {block.type.toUpperCase()}
            </div>
          ))}

          {/* 判定线区域 */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-purple-200/80 to-transparent pointer-events-none">
            {/* 主判定线 */}
            <div className="absolute bottom-8 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 judgment-line">
              {/* 判定线光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 blur-sm opacity-60"></div>
              {/* 额外的光晕效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 blur-md opacity-40"></div>
            </div>

            {/* 判定线装饰 */}
            <div className="absolute bottom-6 left-20 right-20 flex justify-between items-center">
              <div className="text-purple-600 text-sm font-bold">♪</div>
              <div className="text-pink-600 text-sm font-bold">PERFECT</div>
              <div className="text-purple-600 text-sm font-bold">♫</div>
            </div>

            {/* 底部键盘提示区域 */}
            <div className="absolute bottom-1 left-16 right-16 flex justify-center space-x-2">
              {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key, index) => (
                <div
                  key={key}
                  className="w-6 h-6 bg-white/60 border border-purple-300 rounded text-xs flex items-center justify-center text-purple-700 font-bold"
                  style={{
                    animation: `keyGlow ${2 + index * 0.1}s ease-in-out infinite alternate`
                  }}
                >
                  {key}
                </div>
              ))}
            </div>
          </div>

          {/* 游戏提示 - 调整位置避免遮挡判定线 */}
          <div className="absolute top-0 left-16 right-16 bottom-20 flex items-center justify-center pointer-events-none">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
              <div className="text-2xl mb-2">🎮</div>
              <h4 className="font-semibold text-purple-800 mb-2">音游模式演示</h4>
              <p className="text-sm text-purple-600">
                矩形块正在下落中...
              </p>
              <p className="text-xs text-purple-500 mt-2">
                三面判定线已就位！
              </p>
            </div>
          </div>
        </div>

        {/* 控制面板 */}
        <div className="mt-6 text-center">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-purple-700">
              这是一个矩形块下落动画演示，包含四种不同类型的游戏块
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RhythmGame