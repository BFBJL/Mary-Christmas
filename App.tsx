
import React, { useState, useRef, useEffect, useCallback } from 'react';
import Scene3D from './components/Scene3D';
import { TreeState, PhotoItem } from './types';
import * as THREE from 'three';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.CLOSED);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [instructionsVisible, setInstructionsVisible] = useState(true);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const loader = new THREE.TextureLoader();
        loader.load(url, (texture) => {
          // Set color space to SRGB for vibrant, non-distorted colors
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.minFilter = THREE.LinearFilter;
          
          setPhotos((prev) => [
            ...prev,
            { id: Math.random().toString(36).substr(2, 9), url, texture }
          ]);
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const toggleCamera = () => setCameraActive(!cameraActive);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      {/* 3D Scene */}
      <Scene3D 
        state={treeState} 
        onStateChange={setTreeState}
        photos={photos}
        cameraActive={cameraActive}
      />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 z-10">
        
        {/* Header - Advanced Glassmorphism */}
        <div className="flex justify-between items-start pointer-events-auto">
          <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl shadow-black">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-600 to-yellow-300 tracking-tighter uppercase leading-none">
              Aureum Pine
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-medium">Neural Rendering Active</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={toggleCamera}
              className={`px-6 py-3 rounded-2xl font-bold text-sm tracking-wide transition-all duration-500 transform active:scale-95 border shadow-xl ${
                cameraActive 
                  ? 'bg-red-500/80 border-red-400 text-white backdrop-blur-md' 
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10 backdrop-blur-md'
              }`}
            >
              {cameraActive ? 'DISCONNECT HANDS' : 'CONNECT HANDS'}
            </button>
            <button 
              onClick={() => setInstructionsVisible(true)}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md transition-all shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
          </div>
        </div>

        {/* Modal Overlay */}
        {instructionsVisible && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-neutral-900 to-black border border-yellow-500/20 p-10 rounded-[2.5rem] pointer-events-auto max-w-lg w-full shadow-2xl shadow-yellow-900/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-8 text-center">
                <div className="inline-block px-3 py-1 bg-yellow-500/10 rounded-full text-yellow-500 text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Onboarding</div>
                <h2 className="text-4xl font-bold text-white mb-2">Celestial Gestures</h2>
                <p className="text-neutral-400 text-sm">Command the golden particles with your hands.</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-yellow-500/30 transition-all group">
                   <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✊</div>
                   <div className="font-bold text-white text-sm mb-1 uppercase tracking-tight">Form Pine</div>
                   <div className="text-neutral-500 text-xs leading-relaxed">Close your fist to gather all elements into a tree.</div>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-yellow-500/30 transition-all group">
                   <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🖐️</div>
                   <div className="font-bold text-white text-sm mb-1 uppercase tracking-tight">Explode</div>
                   <div className="text-neutral-500 text-xs leading-relaxed">Open your palm to scatter into the gold cloud.</div>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-yellow-500/30 transition-all group">
                   <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🤏</div>
                   <div className="font-bold text-white text-sm mb-1 uppercase tracking-tight">Exhibit</div>
                   <div className="text-neutral-500 text-xs leading-relaxed">Pinch to pull a photo closer. Release to return.</div>
                </div>
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-yellow-500/30 transition-all group">
                   <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔄</div>
                   <div className="font-bold text-white text-sm mb-1 uppercase tracking-tight">Orbit</div>
                   <div className="text-neutral-500 text-xs leading-relaxed">Move your hand to navigate the 3D space.</div>
                </div>
              </div>

              <button 
                onClick={() => setInstructionsVisible(false)}
                className="w-full py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-yellow-900/40 active:scale-95"
              >
                Enter Experience
              </button>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="flex justify-between items-end pointer-events-auto">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-green-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <label className="relative bg-black text-white border border-white/10 hover:border-yellow-500/50 font-bold py-4 px-8 rounded-full cursor-pointer transition-all flex items-center gap-3 shadow-2xl">
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span className="text-sm tracking-widest uppercase">Seed Memories</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
            <div className="mt-3 ml-2 flex gap-1 items-center">
              <div className="w-1 h-1 rounded-full bg-yellow-500"></div>
              <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">{photos.length} Entities in Cloud</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
               <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">System Status</div>
            </div>
            <div className="text-4xl font-black text-white tracking-tighter uppercase italic">{treeState}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
