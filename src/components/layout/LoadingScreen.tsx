import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function LoadingScreen() {
  const text = 'For with God nothing shall be impossible." — Luke 1:37';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cursorIndex, setCursorIndex] = useState(0);
  
  // Animate cursor position along with typing
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorIndex(prev => Math.min(prev + 1, text.length));
    }, 30);
    return () => clearInterval(interval);
  }, [text.length]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    // StarBurst configuration
    const color = '#FFFFFF';
    const starCount = 136;
    const speed = 0.3;
    const starSize = 1.5;
    const opacity = 0.8;
    const flowerIntensity = 0.5;
    const twinkleSpeed = 0.2;
    const centerX = 0.5;
    const centerY = 0.5;
    
    // Parse color
    const parseColor = (input: string): [number, number, number] => {
      if (!input) return [255, 255, 255];
      const s = input.trim();
      if (s.startsWith('#')) {
        let hex = s.slice(1);
        if (hex.length === 3) {
          hex = hex.split('').map((c) => c + c).join('');
        }
        const num = parseInt(hex, 16);
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
      }
      return [255, 255, 255];
    };
    
    const cStar = parseColor(color);
    const nSpokes = starCount;
    const pulsesPerSpoke = 12;
    const particleCount = nSpokes * pulsesPerSpoke;
    
    // Spoke angles
    const spokeAngle = new Float32Array(nSpokes);
    const spokeCos = new Float32Array(nSpokes);
    const spokeSin = new Float32Array(nSpokes);
    for (let i = 0; i < nSpokes; i++) {
      const baseAngle = (i / Math.max(1, nSpokes)) * Math.PI * 2;
      spokeAngle[i] = baseAngle;
      spokeCos[i] = Math.cos(spokeAngle[i]);
      spokeSin[i] = Math.sin(spokeAngle[i]);
    }
    
    // Particle buffers
    const pSpokeIdx = new Uint16Array(particleCount);
    const pT = new Float32Array(particleCount);
    const pSpeed = new Float32Array(particleCount);
    const pSize = new Float32Array(particleCount);
    const pPhase = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      pSpokeIdx[i] = i % nSpokes;
      pT[i] = Math.random() * 1.1;
      pSpeed[i] = (0.5 + Math.random() * 1.0) * 0.25;
      pSize[i] = 0.7 + Math.random() * 0.8;
      pPhase[i] = Math.random() * Math.PI * 2;
    }
    
    // Streak sprite
    const SPRITE_LEN = 64;
    const streak = document.createElement('canvas');
    streak.width = SPRITE_LEN;
    streak.height = 2;
    const sctx = streak.getContext('2d');
    if (sctx) {
      const g = sctx.createLinearGradient(0, 0, SPRITE_LEN, 0);
      g.addColorStop(0, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},0)`);
      g.addColorStop(0.7, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},0.6)`);
      g.addColorStop(1, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},1)`);
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, SPRITE_LEN, 2);
    }
    
    let timeSec = 0;
    let lastT = performance.now();
    
    const drawFrame = (t: number) => {
      const deltaSec = (t - lastT) / 1000;
      lastT = t;
      timeSec += deltaSec;
      
      const dt = Math.max(0.001, Math.min(0.05, deltaSec));
      
      const cx = centerX * width;
      const cy = centerY * height;
      const R = Math.sqrt(width * width + height * height);
      
      // Background
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#08080C';
      ctx.fillRect(0, 0, width, height);
      
      // Additive for glow
      ctx.globalCompositeOperation = 'lighter';
      
      // Center flower bloom
      const bloomAlpha = flowerIntensity * opacity;
      if (bloomAlpha > 0.001) {
        const minDim = Math.min(width, height);
        const bloomR = Math.max(8, minDim * 0.18 * (flowerIntensity * 0.5 + 0.5) * (0.6 + starSize * 0.4));
        const a = Math.min(1, bloomAlpha);
        const fGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, bloomR);
        fGrad.addColorStop(0, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},${a})`);
        fGrad.addColorStop(0.3, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},${a * 0.5})`);
        fGrad.addColorStop(0.7, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},${a * 0.15})`);
        fGrad.addColorStop(1, `rgba(${cStar[0]},${cStar[1]},${cStar[2]},0)`);
        ctx.fillStyle = fGrad;
        ctx.fillRect(cx - bloomR, cy - bloomR, bloomR * 2, bloomR * 2);
      }
      
      // Pulse particles
      for (let i = 0; i < particleCount; i++) {
        pT[i] += pSpeed[i] * speed * dt;
        if (pT[i] > 1.1) {
          pT[i] = -0.05 - Math.random() * 0.05;
          pSize[i] = 0.7 + Math.random() * 0.8;
          pPhase[i] = Math.random() * Math.PI * 2;
        }
        
        const t = pT[i];
        if (t < 0 || t >= 1.0) continue;
        
        const twinkle = 0.7 + 0.3 * Math.sin(timeSec * twinkleSpeed * 6 + pPhase[i]);
        
        let fade: number;
        if (t < 0.06) {
          fade = t / 0.06;
        } else if (t < 0.85) {
          fade = 1;
        } else {
          fade = 1 - (t - 0.85) / 0.15;
        }
        
        const a = Math.min(1, twinkle * fade * (1 + 0.5 * t) * opacity);
        if (a < 0.005) continue;
        
        const dist = t * R;
        const sIdx = pSpokeIdx[i];
        const cosA = spokeCos[sIdx];
        const sinA = spokeSin[sIdx];
        
        const px = cx + cosA * dist;
        const py = cy + sinA * dist;
        const speedFactor = pSpeed[i] / 0.25;
        const lineLen = (8 + 12 * speedFactor) * (0.7 + 0.6 * pSize[i] * starSize);
        
        ctx.setTransform(cosA, sinA, -sinA, cosA, px, py);
        ctx.globalAlpha = a;
        ctx.drawImage(streak, -lineLen, -0.5, lineLen, 1);
      }
      
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      
      requestAnimationFrame(drawFrame);
    };
    
    requestAnimationFrame(drawFrame);
    
    return () => {
      // Cleanup handled by component unmount
    };
  }, []);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08080C] relative overflow-hidden">
      {/* StarBurst background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full"
      />
      
      <div className="relative z-10 w-full max-w-md px-4 sm:px-6">
        <div className="bg-[#0a0f1c] border border-white/20 text-white font-mono text-[10px] sm:text-[10px] p-3 rounded-md w-full h-16 flex flex-col justify-end overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.1)] mx-auto">
          <div className="flex text-gray-400 mb-1 leading-none">
            <span>$</span>
            <span className="ml-2">loading...</span>
          </div>
          <div className="flex items-center leading-none">
            <span className="text-emerald-400">&gt;</span>
            <div className="ml-2 flex relative">
              {text.split('').map((char, index) => (
                <motion.span
                  key={index}
                  className="text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.05, delay: index * 0.03 }}
                >
                  {char}
                </motion.span>
              ))}
              {/* Single cursor that follows the typing */}
              <motion.span
                className="w-1.5 h-2.5 bg-white block"
                animate={{ 
                  opacity: [1, 0, 1],
                  x: cursorIndex * 6 // Move cursor along with typing
                }}
                transition={{ 
                  opacity: { duration: 0.8, repeat: Infinity, ease: "linear" },
                  x: { duration: 0.03 }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
