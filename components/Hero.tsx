/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState } from 'react';
import { HomeIcon, CubeTransparentIcon, MapIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';
import { CubeIcon, ViewColumnsIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/solid';

// Component that simulates drawing a wireframe then filling it with life
const DrawingTransformation = ({ 
  initialIcon: InitialIcon, 
  finalIcon: FinalIcon, 
  label,
  delay, 
  x, 
  y,
  rotation = 0
}: { 
  initialIcon: React.ElementType, 
  finalIcon: React.ElementType, 
  label: string,
  delay: number,
  x: string,
  y: string,
  rotation?: number
}) => {
  const [stage, setStage] = useState(0); // 0: Hidden, 1: Drawing, 2: Alive

  useEffect(() => {
    const cycle = () => {
      setStage(0);
      setTimeout(() => setStage(1), 500); // Start drawing
      setTimeout(() => setStage(2), 3500); // Come alive
    };

    // Initial delay
    const startTimeout = setTimeout(() => {
      cycle();
      // Repeat cycle
      const interval = setInterval(cycle, 9000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay]);

  return (
    <div 
      className="absolute transition-all duration-1000 ease-in-out z-0 pointer-events-none"
      style={{ top: y, left: x, transform: `rotate(${rotation}deg)` }}
    >
      <div className={`relative w-24 h-32 md:w-32 md:h-44 rounded-lg backdrop-blur-md transition-all duration-1000 ${stage === 2 ? 'bg-zinc-800/40 border-zinc-500/50 shadow-xl scale-110 -translate-y-4' : 'bg-zinc-900/10 border-zinc-800 scale-100 border border-dashed'}`}>
        
        {/* Label tag that appears in stage 2 */}
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-900/80 text-blue-200 border border-blue-700/50 text-[8px] md:text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm transition-all duration-500 ${stage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            {label}
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          
          {/* Stage 1: Wireframe Drawing Effect */}
          <div className={`absolute transition-all duration-1000 ${stage === 1 ? 'opacity-100' : 'opacity-0'}`}>
             <InitialIcon className="w-10 h-10 md:w-16 md:h-16 text-zinc-600 stroke-1" />
             {/* Technical corner markers */}
             <div className="absolute -inset-3 border border-blue-500/10 opacity-50"></div>
             <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-blue-500/50"></div>
             <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-blue-500/50"></div>
             <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-blue-500/50"></div>
             <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-blue-500/50"></div>
          </div>

          {/* Stage 2: Alive/Interactive */}
          <div className={`absolute transition-all duration-700 flex flex-col items-center ${stage === 2 ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-75 blur-sm'}`}>
             <FinalIcon className="w-12 h-12 md:w-20 md:h-20 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
             {stage === 2 && (
               <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-zinc-950/80 rounded border border-blue-500/20">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <div className="text-[9px] font-mono text-blue-200 tracking-wider">RENDERING</div>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Hero: React.FC = () => {
  return (
    <>
      {/* Background Transformation Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top Left: Blueprint -> 3D Model */}
        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={MapIcon} 
            finalIcon={CubeIcon} 
            label="MODEL"
            delay={0} 
            x="5%" 
            y="10%"
            rotation={-2} 
            />
        </div>

        {/* Bottom Right: Sketch -> Elevation */}
        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={HomeIcon} 
            finalIcon={BuildingOffice2Icon} 
            label="ELEVATION"
            delay={3000} 
            x="85%" 
            y="70%"
            rotation={2} 
            />
        </div>

        {/* Top Right: Wireframe -> Render */}
        <div className="hidden lg:block">
            <DrawingTransformation 
            initialIcon={CubeTransparentIcon} 
            finalIcon={ViewColumnsIcon} 
            label="RENDER"
            delay={6000} 
            x="85%" 
            y="15%"
            rotation={1} 
            />
        </div>

        {/* Bottom Left: Plan -> Construction */}
        <div className="hidden md:block">
            <DrawingTransformation 
            initialIcon={ClipboardDocumentCheckIcon} 
            finalIcon={HomeIcon} 
            label="FLOORPLAN"
            delay={4500} 
            x="6%" 
            y="65%"
            rotation={-1} 
            />
        </div>
      </div>

      {/* Hero Text Content */}
      <div className="text-center relative z-10 max-w-5xl mx-auto px-4 pt-12">
        <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs font-mono text-blue-300 tracking-wider">ARCHITECTURAL INTELLIGENCE v1.0</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-6 leading-[1.1]">
          House Vision <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Studio</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
          Generate complete architectural packages from text or images.
          <br className="hidden sm:block" />
          <span className="text-zinc-500">Floorplans • Elevations • 3D Models • Orbit Animations</span>
        </p>
      </div>
    </>
  );
};