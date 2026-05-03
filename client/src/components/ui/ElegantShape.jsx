import React from 'react';
import { motion } from 'framer-motion';

const ElegantShape = ({ className, delay = 0, width = 400, height = 100, rotate = 0, gradient = "from-white/[0.08]" }) => (
    <motion.div
        initial={{ opacity: 0, y: -150, rotate: rotate - 15 }}
        whileInView={{ opacity: 1, y: 0, rotate: rotate }}
        viewport={{ once: true }}
        transition={{ duration: 2.4, delay, ease: [0.23, 0.86, 0.39, 0.96] }}
        className={`absolute ${className} pointer-events-none`}
    >
        <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            style={{ width, height }}
            className="relative"
        >
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border-2 border-white/[0.05] shadow-[0_8px_32px_0_rgba(255,255,255,0.03)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]`} />
        </motion.div>
    </motion.div>
);

export default ElegantShape;
