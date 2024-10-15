'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface TransitionWrapperProps {
    children: React.ReactNode;
}

const transitionVariants = {
    initial: { opacity: 0, y: 50, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: 50, filter: 'blur(10px)' },
};

export default function TransitionWrapper({
    children,
}: TransitionWrapperProps) {
    const pathname = usePathname();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        setIsReady(true);
    }, [pathname]);

    return (
        <motion.div
            key={pathname}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={transitionVariants}
            transition={{ duration: 0.6, ease: [0, 0, 0, 1] }}
            style={{ overflow: 'hidden' }}
        >
            {isReady && children}
        </motion.div>
    );
}
