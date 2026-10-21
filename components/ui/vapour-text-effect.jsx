"use client"

import { useEffect, useRef } from "react"

export function Component({
  texts = ["21st.dev Is Cool"],
  fontSize = 90,
  fontWeight = 700,
  color = "#ffffff",
  backgroundColor = "#000000",
  vaporDuration = 2600,
  holdDuration = 1800,
}) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current

    if (!container || !canvas) return

    const ctx = canvas.getContext("2d")

    if (!ctx) return

    let particles = []
    let textIndex = 0
    let startTime = performance.now()

    let width = 0
    let height = 0

    const DPR = Math.min(
      window.devicePixelRatio || 1,
      2
    )

    // ---------------------------------------------------------
    // Resize
    // ---------------------------------------------------------

    const resize = () => {
      const bounds =
        container.getBoundingClientRect()

      width = bounds.width
      height = bounds.height

      canvas.width = width * DPR
      canvas.height = height * DPR

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.setTransform(
        DPR,
        0,
        0,
        DPR,
        0,
        0
      )

      createTextParticles()
    }

    // ---------------------------------------------------------
    // Create particles from text
    // ---------------------------------------------------------

    const createTextParticles = () => {
      if (!width || !height) return

      const textCanvas =
        document.createElement("canvas")

      const textCtx =
        textCanvas.getContext("2d")

      if (!textCtx) return

      textCanvas.width = width
      textCanvas.height = height

      textCtx.clearRect(
        0,
        0,
        width,
        height
      )

      const responsiveFontSize =
        Math.min(
          fontSize,
          width / 9
        )

      textCtx.font = `${fontWeight} ${responsiveFontSize}px Arial, Helvetica, sans-serif`

      textCtx.textAlign = "center"
      textCtx.textBaseline = "middle"

      textCtx.fillStyle = color

      const currentText =
        texts[textIndex] ||
        "21st.dev Is Cool"

      textCtx.fillText(
        currentText,
        width / 2,
        height / 2
      )

      const imageData =
        textCtx.getImageData(
          0,
          0,
          width,
          height
        )

      const data =
        imageData.data

      particles = []

      // Higher = fewer particles / better performance
      const gap =
        width < 700 ? 4 : 3

      for (
        let y = 0;
        y < height;
        y += gap
      ) {
        for (
          let x = 0;
          x < width;
          x += gap
        ) {
          const index =
            (y * width + x) * 4

          const alpha =
            data[index + 3]

          if (alpha > 120) {
            particles.push({
              // Original position
              originX: x,
              originY: y,

              // Current position
              x,
              y,

              // Vapor movement
              vx:
                (Math.random() -
                  0.5) *
                0.35,

              vy:
                -0.25 -
                Math.random() *
                  0.75,

              drift:
                (Math.random() -
                  0.5) *
                1.5,

              wave:
                Math.random() *
                Math.PI *
                2,

              waveSpeed:
                0.01 +
                Math.random() *
                  0.02,

              size:
                0.8 +
                Math.random() *
                  1.6,

              opacity:
                0.7 +
                Math.random() *
                  0.3,

              delay:
                Math.random() *
                0.35,

              life:
                Math.random(),

              speed:
                0.6 +
                Math.random() *
                  1.2,
            })
          }
        }
      }

      startTime =
        performance.now()
    }

    // ---------------------------------------------------------
    // Draw particle
    // ---------------------------------------------------------

    const drawParticle = (
      particle,
      opacity
    ) => {
      if (opacity <= 0) return

      ctx.beginPath()

      ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      )

      ctx.fillStyle = `rgba(255,255,255,${opacity})`

      ctx.fill()
    }

    // ---------------------------------------------------------
    // Animation
    // ---------------------------------------------------------

    const animate = (time) => {
      ctx.clearRect(
        0,
        0,
        width,
        height
      )

      ctx.fillStyle =
        backgroundColor

      ctx.fillRect(
        0,
        0,
        width,
        height
      )

      const elapsed =
        time - startTime

      const totalDuration =
        holdDuration +
        vaporDuration

      // -------------------------------------------------------
      // Text stays solid first
      // -------------------------------------------------------

      if (
        elapsed <
        holdDuration
      ) {
        particles.forEach(
          (particle) => {
            particle.x =
              particle.originX

            particle.y =
              particle.originY

            drawParticle(
              particle,
              particle.opacity
            )
          }
        )
      } else {
        // -----------------------------------------------------
        // Vapor phase
        // -----------------------------------------------------

        const vaporTime =
          elapsed -
          holdDuration

        const globalProgress =
          Math.min(
            vaporTime /
              vaporDuration,
            1
          )

        particles.forEach(
          (particle) => {
            const localProgress =
              Math.max(
                0,
                Math.min(
                  1,
                  (globalProgress -
                    particle.delay) /
                    (1 -
                      particle.delay)
                )
              )

            // Keep particle in original position
            // until its individual delay begins.
            if (
              localProgress <= 0
            ) {
              particle.x =
                particle.originX

              particle.y =
                particle.originY

              drawParticle(
                particle,
                particle.opacity
              )

              return
            }

            particle.wave +=
              particle.waveSpeed

            // Horizontal smoke movement
            const waveMovement =
              Math.sin(
                particle.wave +
                  particle.originY *
                    0.015
              ) *
              1.3

            particle.x +=
              particle.vx *
                particle.speed +
              waveMovement *
                localProgress

            // Mostly move upward
            particle.y +=
              particle.vy *
              particle.speed *
              (0.8 +
                localProgress *
                  2.5)

            // Extra random drifting
            particle.x +=
              particle.drift *
              localProgress *
              0.15

            const fade =
              Math.pow(
                1 -
                  localProgress,
                1.7
              )

            const opacity =
              particle.opacity *
              fade

            drawParticle(
              particle,
              opacity
            )
          }
        )
      }

      // -------------------------------------------------------
      // Change text and restart
      // -------------------------------------------------------

      if (
        elapsed >
        totalDuration
      ) {
        textIndex =
          (textIndex + 1) %
          texts.length

        createTextParticles()
      }

      animationRef.current =
        requestAnimationFrame(
          animate
        )
    }

    resize()

    window.addEventListener(
      "resize",
      resize
    )

    animationRef.current =
      requestAnimationFrame(
        animate
      )

    return () => {
      window.removeEventListener(
        "resize",
        resize
      )

      if (
        animationRef.current
      ) {
        cancelAnimationFrame(
          animationRef.current
        )
      }
    }
  }, [
    texts,
    fontSize,
    fontWeight,
    color,
    backgroundColor,
    vaporDuration,
    holdDuration,
  ])

  return (
    <div
      ref={containerRef}
      className="flex h-screen w-screen items-center justify-center bg-black"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          minWidth: "30px",
          minHeight: "20px",
          pointerEvents: "none",
          display: "block",
        }}
      />

      <h1
        style={{
          position: "absolute",
          width: "0px",
          height: "0px",
          overflow: "hidden",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {texts.join(" ")}
      </h1>
    </div>
  )
}

export default Component