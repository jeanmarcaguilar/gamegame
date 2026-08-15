import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    animate,
    type SpringOptions,
} from "framer-motion"

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

    const arrowSpring = useMemo<SpringOptions>(
        () => ({ stiffness: 200, damping: 40, mass: 0.8 }), // Reduced stiffness for better performance
        []
    )
    const labelSpringCfg = useMemo<SpringOptions>(
        () => ({ stiffness: 150, damping: 30, mass: 0.9 }), // Reduced stiffness for better performance
        []
    )

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

    const mouseX = useMotionValue(-9999)
    const mouseY = useMotionValue(-9999)

    const arrowX = useSpring(mouseX, arrowSpring)
    const arrowY = useSpring(mouseY, arrowSpring)
    const labelX = useSpring(mouseX, labelSpringCfg)
    const labelY = useSpring(mouseY, labelSpringCfg)

    const scaleMV = useMotionValue(1)
    useEffect(() => {
        const controls = animate(scaleMV, pressed ? (pressScale || 0.92) : 1, {
            type: "spring",
            stiffness: 500,
            damping: 28,
            mass: 0.5,
        })
        return () => controls.stop()
    }, [pressed, pressScale, scaleMV])

    const labelTiltTarget = useMotionValue(0)
    const labelRotation = useSpring(labelTiltTarget, {
        stiffness: 200,
        damping: 24,
        mass: 0.6,
    })

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

            mouseX.set(x + resolvedOffset.x)
            mouseY.set(y + resolvedOffset.y)

            const speed = Math.hypot(vx, vy)
            const norm = Math.min(1, speed / 1500)
            const sign = vx === 0 ? 0 : vx > 0 ? 1 : -1
            labelTiltTarget.set(sign * norm * (labelTiltStrength || 25))

            if (fullScreen) setHovering(true)
        }

        const onDown = () => setPressed(true)
        const onUp = () => setPressed(false)

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
                labelTiltTarget.set(0)
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
                    labelTiltTarget.set(0)
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
        mouseX,
        mouseY,
        labelTiltTarget,
    ])

    const visible = useMemo(() => {
        if (isTouchDevice) return false
        return hovering
    }, [isTouchDevice, hovering])

    const labelTranslateX = useTransform(labelX, (v) => v + resolvedLabelOffset.x)
    const labelTranslateY = useTransform(labelY, (v) => v + resolvedLabelOffset.y)

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
                    <motion.div
                        className={classNames?.label}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            x: labelTranslateX,
                            y: labelTranslateY,
                            rotate: labelRotation,
                            scale: scaleMV,
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
                        }}
                    >
                        {labelContent}
                    </motion.div>
                )}

                <motion.div
                    className={classNames?.cursor}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        x: arrowX,
                        y: arrowY,
                        scale: scaleMV,
                        width: size,
                        height: size,
                        opacity: visible ? 1 : 0,
                        transformOrigin: "0% 0%",
                        transition: "opacity 140ms ease",
                        willChange: "transform, opacity",
                        pointerEvents: "none",
                    }}
                >
                    <div className={classNames?.arrow} style={{ width: size, height: size }}>
                        {arrowContent}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default function UserCursor(props: Props = {}) {
    return <__OriginkitBase_UserCursor {...props} />
}
