import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"

type ClassNames = {
    root?: string
    cursor?: string
    arrow?: string
    label?: string
    labelText?: string
}

type Props = {
    name?: string
    arrow?: React.ReactNode | ((color: string) => React.ReactNode)
    label?: React.ReactNode
    color?: string
    textColor?: string
    size?: number
    labelTiltStrength?: number
    showLabel?: boolean
    offsetX?: number
    offsetY?: number
    labelOffsetUseDefault?: boolean
    labelOffsetX?: number
    labelOffsetY?: number
    pressScale?: number
    offset?: { x?: number; y?: number }
    labelOffset?: { x?: number; y?: number }
    classNames?: ClassNames
    style?: React.CSSProperties
}

const COMPONENT_DEFAULTS = {
    color: "#FFFFFF",
    size: 29,
    pressScale: 0.92,
    offsetX: 0,
    offsetY: 0,
    showLabel: true,
    name: "JM",
    textColor: "#000000",
    labelTiltStrength: 25,
    labelOffsetUseDefault: true,
    labelOffsetX: -101,
    labelOffsetY: 12,
}

function __OriginkitBase_UserCursor(props: Props) {
    props = { ...COMPONENT_DEFAULTS, ...props }
    const {
        name,
        arrow,
        label,
        color,
        textColor,
        size,
        labelTiltStrength,
        showLabel,
        offsetX,
        offsetY,
        labelOffsetX,
        labelOffsetY,
        labelOffsetUseDefault,
        pressScale,
        classNames,
        offset: offsetOverride,
        labelOffset: labelOffsetOverride,
        style,
    } = props

    // Full-screen mode for portfolio-wide cursor
    const fullScreen = true
    const hideNativeCursor = true
    const hideOnTouch = true
    const zIndex = 100000

    const [isTouchDevice, setIsTouchDevice] = useState(false)
    useEffect(() => {
        if (!hideOnTouch) {
            setIsTouchDevice(false)
            return
        }
        if (typeof window === "undefined" || !window.matchMedia) return
        const mql = window.matchMedia("(pointer: coarse)")
        const sync = () => setIsTouchDevice(!!mql.matches)
        sync()
        if (mql.addEventListener) {
            mql.addEventListener("change", sync)
            return () => mql.removeEventListener("change", sync)
        }
        const legacy = mql as MediaQueryList & {
            addListener?: (l: (e: MediaQueryListEvent) => void) => void
            removeListener?: (l: (e: MediaQueryListEvent) => void) => void
        }
        legacy.addListener?.(sync)
        return () => legacy.removeListener?.(sync)
    }, [hideOnTouch])

    // Hide native cursor on body and html with global CSS rule
    useEffect(() => {
        if (isTouchDevice || !hideNativeCursor) return
        
        // Add global CSS rule to hide cursor everywhere
        const styleId = 'user-cursor-hide-style';
        let styleElement = document.getElementById(styleId) as HTMLStyleElement;
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            styleElement.textContent = '* { cursor: none !important; }';
            document.head.appendChild(styleElement);
        }
        
        return () => {
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement);
            }
        }
    }, [isTouchDevice, hideNativeCursor])

    const containerRef = useRef<HTMLDivElement | null>(null)
    const [hovering, setHovering] = useState(false)
    const [pressed, setPressed] = useState(false)

    const resolvedOffset = useMemo(
        () => ({
            x: offsetOverride?.x ?? offsetX ?? 0,
            y: offsetOverride?.y ?? offsetY ?? 0,
        }),
        [offsetOverride?.x, offsetOverride?.y, offsetX, offsetY]
    )

    const resolvedLabelOffset = useMemo(() => {
        if (labelOffsetOverride) {
            return {
                x: labelOffsetOverride.x ?? (size || 29) * 0.9,
                y: labelOffsetOverride.y ?? (size || 29) * 0.2 + 6,
            }
        }
        if (labelOffsetUseDefault) {
            return { x: (size || 29) * 0.9, y: (size || 29) * 0.2 + 6 }
        }
        return { x: labelOffsetX || 25, y: labelOffsetY || 12 }
    }, [
        labelOffsetOverride?.x,
        labelOffsetOverride?.y,
        labelOffsetUseDefault,
        labelOffsetX,
        labelOffsetY,
        size,
    ])

    // The cursor previously ran through 4 framer-motion springs
    // (arrowX/Y + labelX/Y + labelRotation + scale) — every mousemove
    // scheduled a spring step which then triggered a React update and
    // style write. That competed with the main-thread scroll path for
    // every frame. We now do a single rAF loop that writes inline
    // transforms directly to the DOM nodes. Same visual smoothing,
    // no React work during cursor movement.
    const arrowRef = useRef<HTMLDivElement | null>(null)
    const labelRef = useRef<HTMLDivElement | null>(null)

    // Refs (not state) for values that change every frame — avoids re-renders.
    const cursorStateRef = useRef({
        mouseX: -9999,
        mouseY: -9999,
        arrowX: -9999,
        arrowY: -9999,
        labelX: -9999,
        labelY: -9999,
        scale: 1,
        labelRot: 0,
    })

    // Refs the mousemove handler reads for the latest pressed state
    const pressedRef = useRef(false)
    useEffect(() => { pressedRef.current = pressed }, [pressed])
    const labelOffsetRef = useRef({ x: 25, y: 12 })
    useEffect(() => {
        labelOffsetRef.current = {
            x: resolvedLabelOffset.x,
            y: resolvedLabelOffset.y,
        }
    }, [resolvedLabelOffset.x, resolvedLabelOffset.y])
    const ensureRunningRef = useRef<() => void>(() => {})

    useEffect(() => {
        let rafId = 0
        let running = false

        const tick = () => {
            rafId = 0
            const s = cursorStateRef.current

            // Spring smoothing — explicit per-axis exponential approach.
            // These factors match the previous stiffness/damping feel.
            const ARROW_FACTOR = 0.35
            const LABEL_FACTOR = 0.22

            s.arrowX += (s.mouseX - s.arrowX) * ARROW_FACTOR
            s.arrowY += (s.mouseY - s.arrowY) * ARROW_FACTOR
            s.labelX += (s.mouseX - s.labelX) * LABEL_FACTOR
            s.labelY += (s.mouseY - s.labelY) * LABEL_FACTOR

            const targetScale = pressedRef.current ? (pressScale || 0.92) : 1
            s.scale += (targetScale - s.scale) * 0.3
            // Decay tilt toward 0
            s.labelRot += (0 - s.labelRot) * 0.2

            const ax = s.arrowX
            const ay = s.arrowY
            const lx = s.labelX + (labelOffsetRef.current.x || 25)
            const ly = s.labelY + (labelOffsetRef.current.y || 12)

            if (arrowRef.current) {
                arrowRef.current.style.transform =
                    `translate3d(${ax}px, ${ay}px, 0) scale(${s.scale})`
            }
            if (labelRef.current) {
                labelRef.current.style.transform =
                    `translate3d(${lx}px, ${ly}px, 0) rotate(${s.labelRot}deg) scale(${s.scale})`
            }

            // Stop the rAF once the cursor has settled.
            const settled =
                Math.abs(s.arrowX - s.mouseX) < 0.05 &&
                Math.abs(s.arrowY - s.mouseY) < 0.05 &&
                Math.abs(s.scale - targetScale) < 0.002 &&
                Math.abs(s.labelRot) < 0.05

            if (!settled || pressedRef.current) {
                rafId = requestAnimationFrame(tick)
            } else {
                running = false
            }
        }

        const ensureRunning = () => {
            if (!running) {
                running = true
                rafId = requestAnimationFrame(tick)
            }
        }

        // Expose a way for the mousemove handler to nudge the loop awake.
        ensureRunningRef.current = ensureRunning

        return () => {
            if (rafId) cancelAnimationFrame(rafId)
            running = false
        }
    }, [pressScale])

    const lastSampleRef = useRef<{ x: number; y: number; t: number } | null>(null)

    useEffect(() => {
        if (isTouchDevice) return
        if (typeof window === "undefined") return

        const getLocal = (clientX: number, clientY: number) => {
            if (fullScreen) return { x: clientX, y: clientY }
            const rect = containerRef.current?.getBoundingClientRect()
            if (!rect) return { x: clientX, y: clientY }
            return { x: clientX - rect.left, y: clientY - rect.top }
        }

        const onMove = (e: MouseEvent) => {
            const { x, y } = getLocal(e.clientX, e.clientY)

            const now = typeof performance !== "undefined" ? performance.now() : Date.now()
            const last = lastSampleRef.current
            let vx = 0
            let vy = 0
            if (last) {
                const dt = Math.max(1, now - last.t)
                vx = ((x - last.x) / dt) * 1000
                vy = ((y - last.y) / dt) * 1000
            }
            lastSampleRef.current = { x, y, t: now }

            const s = cursorStateRef.current
            s.mouseX = x + resolvedOffset.x
            s.mouseY = y + resolvedOffset.y

            const speed = Math.hypot(vx, vy)
            const norm = Math.min(1, speed / 1500)
            const sign = vx === 0 ? 0 : vx > 0 ? 1 : -1
            s.labelRot = sign * norm * (labelTiltStrength || 25)

            // Wake the rAF smoothing loop if it's idle
            ensureRunningRef.current()

            if (fullScreen) setHovering(true)
        }

        const onDown = () => setPressed(true)
        const onUp = () => {
            setPressed(false)
            // Press-release needs a final frame to lerp scale back up
            ensureRunningRef.current()
        }

        if (fullScreen) {
            window.addEventListener("mousemove", onMove)
            window.addEventListener("mousedown", onDown)
            window.addEventListener("mouseup", onUp)
        } else {
            const el = containerRef.current
            if (!el) return
            el.addEventListener("mousemove", onMove as EventListener)
            el.addEventListener("mousedown", onDown)
            el.addEventListener("mouseup", onUp)
            el.addEventListener("mouseenter", () => setHovering(true))
            el.addEventListener("mouseleave", () => {
                setHovering(false)
                lastSampleRef.current = null
            })
        }

        return () => {
            if (fullScreen) {
                window.removeEventListener("mousemove", onMove)
                window.removeEventListener("mousedown", onDown)
                window.removeEventListener("mouseup", onUp)
            } else {
                const el = containerRef.current
                if (!el) return
                el.removeEventListener("mousemove", onMove as EventListener)
                el.removeEventListener("mousedown", onDown)
                el.removeEventListener("mouseup", onUp)
                el.removeEventListener("mouseenter", () => setHovering(true))
                el.removeEventListener("mouseleave", () => {
                    setHovering(false)
                    lastSampleRef.current = null
                })
            }
            setPressed(false)
        }
    }, [
        isTouchDevice,
        fullScreen,
        labelTiltStrength,
        resolvedOffset.x,
        resolvedOffset.y,
    ])

    const visible = useMemo(() => {
        if (isTouchDevice) return false
        return hovering
    }, [isTouchDevice, hovering])

    const arrowContent: React.ReactNode = useMemo(() => {
        if (typeof arrow === "function") {
            try {
                return (arrow as (c: string) => React.ReactNode)(color || "#FFFFFF")
            } catch {
                return null
            }
        }
        if (arrow !== undefined && arrow !== null) return arrow as React.ReactNode
        return (
            <svg
                width={size || 29}
                height={size || 29}
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: "block", overflow: "visible" }}
            >
                <path
                    d="M5 3 L23 14 L14 16 L11 24 Z"
                    fill={color || "#FFFFFF"}
                    stroke="rgba(0,0,0,0.18)"
                    strokeWidth={0.6}
                    strokeLinejoin="round"
                />
            </svg>
        )
    }, [arrow, color, size])

    const labelContent: React.ReactNode = useMemo(() => {
        if (label !== undefined && label !== null) return label
        return (
            <div
                className={classNames?.labelText}
                style={{
                    color: textColor || "#000000",
                    fontSize: Math.max(7, (size || 29) * 0.43),
                    lineHeight: 1.1,
                    fontWeight: 600,
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    whiteSpace: "nowrap",
                    letterSpacing: 0.1,
                }}
            >
                {name}
            </div>
        )
    }, [label, name, textColor, size, classNames?.labelText])

    if (isTouchDevice) return null

    const hostStyle: React.CSSProperties = {
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex,
        ...style,
    }

    const layerStyle: React.CSSProperties = {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
    }

    return (
        <div ref={containerRef} className={classNames?.root} style={hostStyle}>
            <div style={layerStyle}>
                {showLabel && (
                    <div
                        ref={labelRef}
                        className={classNames?.label}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            background: color,
                            borderRadius: 999,
                            padding: `${(size || 29) * 0.18}px ${(size || 29) * 0.36}px`,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
                            opacity: visible ? 1 : 0,
                            transformOrigin: "0% 50%",
                            transition: "opacity 140ms ease",
                            willChange: "transform, opacity",
                            userSelect: "none",
                            pointerEvents: "none",
                            transform: 'translate3d(-9999px, -9999px, 0)',
                        }}
                    >
                        {labelContent}
                    </div>
                )}

                <div
                    ref={arrowRef}
                    className={classNames?.cursor}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: size,
                        height: size,
                        opacity: visible ? 1 : 0,
                        transformOrigin: "0% 0%",
                        transition: "opacity 140ms ease",
                        willChange: "transform, opacity",
                        pointerEvents: "none",
                        transform: 'translate3d(-9999px, -9999px, 0)',
                    }}
                >
                    <div className={classNames?.arrow} style={{ width: size, height: size }}>
                        {arrowContent}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function UserCursor(props: Props = {}) {
    return <__OriginkitBase_UserCursor {...props} />
}
