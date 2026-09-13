import React from 'react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedButton = ({ children, className = 'btn-career', onClick, ...props }) => {
  const buttonRef = useRef();

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const tl = gsap.timeline({ paused: true });
    tl.to(button, {
      scale: 1.05,
      boxShadow: '0 20px 40px rgba(225, 29, 116, 0.45)',
      duration: 0.3,
      ease: 'power2.out'
    });

    button.addEventListener('mouseenter', () => tl.play());
    button.addEventListener('mouseleave', () => tl.reverse());

    return () => {
      button.removeEventListener('mouseenter', tl.play);
      button.removeEventListener('mouseleave', tl.reverse());
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`font-semibold text-lg px-10 py-4 rounded-2xl shadow-2xl ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;

