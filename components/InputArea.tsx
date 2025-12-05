/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useRef } from 'react';
import { ArrowUpTrayIcon, SparklesIcon, PhotoIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

interface InputAreaProps {
  onGenerate: (prompt: string, file?: File) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isGenerating, disabled = false }) => {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [description, setDescription] = useState('');
  const [width, setWidth] = useState('12');
  const [depth, setDepth] = useState('10');
  const [floors, setFloors] = useState('2');
  const [rooms, setRooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('2');
  const [garage, setGarage] = useState(true);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
        setSelectedFile(file);
    } else {
        alert("Please upload an image file.");
    }
  };

  const handleSubmit = () => {
    // Construct the detailed prompt payload
    const specs = {
        width: `${width}m`,
        depth: `${depth}m`,
        floors,
        rooms,
        bathrooms,
        hasGarage: garage
    };

    let fullPrompt = "";
    
    if (mode === 'text') {
        if (!description.trim()) {
            alert("Please describe your house vision.");
            return;
        }
        fullPrompt = `
        TASK: GENERATE HOUSE DASHBOARD
        MODE: TEXT_TO_HOUSE
        
        USER DESCRIPTION: "${description}"
        
        SPECIFICATIONS:
        - Dimensions: ${specs.width} wide x ${specs.depth} deep
        - Floors: ${specs.floors}
        - Bedrooms: ${specs.rooms}
        - Bathrooms: ${specs.bathrooms}
        - Garage: ${specs.hasGarage ? 'Yes' : 'No'}
        
        REQUIREMENTS:
        1. Generate detailed 4-side elevations (CSS/SVG/3D).
        2. Create a to-scale floorplan.
        3. Render a 3D orbit view using Three.js (procedural generation based on dims).
        `;
        onGenerate(fullPrompt);
    } else {
        if (!selectedFile) {
            alert("Please upload an image first.");
            return;
        }
        fullPrompt = `
        TASK: GENERATE HOUSE DASHBOARD
        MODE: IMAGE_TO_HOUSE
        
        INPUT: The user has uploaded an image of a house (assumed Front View).
        
        SPECIFICATIONS:
        - Approx Dimensions: ${specs.width} wide x ${specs.depth} deep
        
        REQUIREMENTS:
        1. Analyze the image style and structure.
        2. Extrapolate the Back, Left, and Right views consistent with the Front.
        3. Infer a likely floorplan based on windows/doors visibility.
        4. Reconstruct a 3D model representation.
        `;
        onGenerate(fullPrompt, selectedFile);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Mode Toggles */}
      <div className="flex justify-center mb-6 space-x-4">
        <button
            onClick={() => setMode('text')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full border transition-all duration-300 ${
                mode === 'text' 
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
            }`}
        >
            <PencilSquareIcon className="w-5 h-5" />
            <span className="font-medium">Describe House</span>
        </button>
        <button
            onClick={() => setMode('image')}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full border transition-all duration-300 ${
                mode === 'image' 
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500'
            }`}
        >
            <PhotoIcon className="w-5 h-5" />
            <span className="font-medium">Upload Image</span>
        </button>
      </div>

      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative Technical Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        
        {mode === 'text' ? (
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">Architectural Vision</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="E.g. Modern minimalist two-storey house with flat roof, large glass windows facing the garden, white concrete facade..."
                        className="w-full bg-black/40 border border-zinc-700 rounded-lg p-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all h-32 resize-none text-sm"
                        disabled={isGenerating || disabled}
                    />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Floors</label>
                        <select 
                            value={floors} 
                            onChange={(e) => setFloors(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm text-zinc-300 focus:border-blue-500 outline-none"
                        >
                            {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Bedrooms</label>
                        <select 
                             value={rooms} 
                             onChange={(e) => setRooms(e.target.value)}
                             className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm text-zinc-300 focus:border-blue-500 outline-none"
                        >
                            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Bathrooms</label>
                        <select 
                             value={bathrooms} 
                             onChange={(e) => setBathrooms(e.target.value)}
                             className="w-full bg-zinc-900 border border-zinc-700 rounded p-2 text-sm text-zinc-300 focus:border-blue-500 outline-none"
                        >
                            {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                    <div className="flex items-end pb-2">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <div className={`w-4 h-4 border rounded transition-colors ${garage ? 'bg-blue-600 border-blue-600' : 'border-zinc-600 bg-transparent'}`}>
                                {garage && <svg className="w-3 h-3 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            <input type="checkbox" checked={garage} onChange={(e) => setGarage(e.target.checked)} className="hidden" />
                            <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">2-Car Garage</span>
                        </label>
                    </div>
                </div>
            </div>
        ) : (
            <div className="space-y-6">
                 <div 
                    className={`relative border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 bg-black/20 hover:border-zinc-500'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {selectedFile ? (
                        <div className="relative w-full h-full p-4 flex flex-col items-center justify-center">
                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="h-full object-contain rounded shadow-lg" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                <span className="text-white text-sm font-medium">Click to change</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center p-6">
                            <PhotoIcon className="w-10 h-10 text-zinc-500 mx-auto mb-2" />
                            <p className="text-sm text-zinc-300 font-medium">Click to upload or drag & drop</p>
                            <p className="text-xs text-zinc-500 mt-1">Recommended: Front view of the house</p>
                        </div>
                    )}
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => e.target.files && handleFile(e.target.files[0])} 
                    />
                </div>
            </div>
        )}

        {/* Common Dimensions */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-zinc-800">
            <div>
                 <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Lot Width (m)</label>
                 <input 
                    type="number" 
                    value={width} 
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-700 rounded p-2.5 text-zinc-200 font-mono text-sm focus:border-blue-500 outline-none"
                />
            </div>
            <div>
                 <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-1">Lot Depth (m)</label>
                 <input 
                    type="number" 
                    value={depth} 
                    onChange={(e) => setDepth(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-700 rounded p-2.5 text-zinc-200 font-mono text-sm focus:border-blue-500 outline-none"
                />
            </div>
        </div>

        {/* Generate Button */}
        <div className="mt-8">
            <button
                onClick={handleSubmit}
                disabled={isGenerating || disabled}
                className={`
                    w-full py-4 rounded-lg font-bold tracking-wider uppercase text-sm flex items-center justify-center space-x-2 transition-all duration-300
                    ${isGenerating || disabled 
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-blue-500/25'
                    }
                `}
            >
                {isGenerating ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Processing Architecture...</span>
                    </>
                ) : (
                    <>
                        <SparklesIcon className="w-5 h-5" />
                        <span>Generate House Vision</span>
                    </>
                )}
            </button>
        </div>

      </div>
    </div>
  );
};
