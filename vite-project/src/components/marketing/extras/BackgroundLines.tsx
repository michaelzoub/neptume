import React, { useRef, useEffect } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  opacity: number
}

const BackgroundLines: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const stars: Star[] = []
    const STARS_PER_PIXEL = 0.0001 // Adjust this to control star density
    let animationFrameId: number
    let scrollOpacity = 1

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    const calculateNumStars = () => {
      const screenArea = window.innerWidth * window.innerHeight
      return Math.floor(screenArea * STARS_PER_PIXEL)
    }

    const createStar = (): Star => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.5 + 0.5,
      vx: Math.random() * 0.2 - 0.1,
      vy: Math.random() * 0.2 - 0.1,
      opacity: Math.random()
    })

    const initStars = () => {
      stars.length = 0
      const numStars = calculateNumStars()
      for (let i = 0; i < numStars; i++) {
        stars.push(createStar())
      }
    }

    const drawStar = (star: Star) => {
      if (!ctx) return
      ctx.beginPath()
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * scrollOpacity})`
      ctx.fill()
    }

    const updateStar = (star: Star) => {
      star.x += star.vx
      star.y += star.vy
      star.opacity = Math.sin(Date.now() * 0.002 + star.x * 0.01) * 0.5 + 0.5

      // Wrap around screen edges
      if (star.x < 0) star.x = window.innerWidth
      if (star.x > window.innerWidth) star.x = 0
      if (star.y < 0) star.y = window.innerHeight
      if (star.y > window.innerHeight) star.y = 0
    }

    const handleScroll = () => {
      scrollOpacity = Math.max(0, 1 - window.scrollY / 700)
    }

    const animate = () => {
      ctx.fillStyle = '#000305'
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      
      stars.forEach((star) => {
        updateStar(star)
        drawStar(star)
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      resizeCanvas()
      initStars()
    }

    resizeCanvas()
    initStars()
    animate()

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0" />
}

export default BackgroundLines 