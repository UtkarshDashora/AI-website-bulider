import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import NET from 'vanta/dist/vanta.net.min';

const VantaBackground = ({ children }) => {
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    // Vanta often needs THREE to be global 
    window.THREE = THREE;

    let effect = null;
    if (!vantaEffect && vantaRef.current) {
      try {
        // Handle different export styles of Vanta
        const vantaInit = NET.default || NET;
        
        if (typeof vantaInit === 'function') {
          effect = vantaInit({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x8a2be2,
            backgroundColor: 0x050505,
            points: 10.0,
            maxDistance: 20.0,
            spacing: 16.0,
          });
          setVantaEffect(effect);
        } else {
          console.error("Vanta NET is not a function:", vantaInit);
        }
      } catch (err) {
        console.error("Vanta initialization failed in component:", err);
      }
    }
    return () => {
      if (effect && typeof effect.destroy === 'function') {
        effect.destroy();
      }
    };
  }, [vantaRef]);

  return (
    <div ref={vantaRef} className="fixed inset-0 z-0 overflow-hidden bg-[#050505]">
      <div className="relative z-10 h-full w-full overflow-auto scrollbar-hide">
        {children}
      </div>
    </div>
  );
};

export default VantaBackground;
