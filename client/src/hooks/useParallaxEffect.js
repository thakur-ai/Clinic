import { useState, useEffect } from 'react';

const useParallaxEffect = (strength = 40, active = true) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    if (!active) {
      setXOffset(0);
      setYOffset(0);
      return;
    }

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [active]);

  useEffect(() => {
    if (active) {
      setXOffset((mousePos.x - window.innerWidth / 2) / strength);
      setYOffset((mousePos.y - window.innerHeight / 2) / strength);
    }
  }, [mousePos, strength, active]);

  return { mousePos, xOffset, yOffset };
};

export default useParallaxEffect;
