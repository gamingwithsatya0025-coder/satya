import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CursorSpotlight = () => {
    const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
    const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            style={{
                x: mouseX,
                y: mouseY,
                translateX: '-50%',
                translateY: '-50%',
            }}
            className="fixed top-0 left-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-[9999] opacity-50 mix-blend-screen"
        />
    );
};

export default CursorSpotlight;
