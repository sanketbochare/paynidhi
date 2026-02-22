// frontend/src/components/BackToTop.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const BackToTop = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.pageYOffset || window.scrollY || 0;
      setVisible(y > 200);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <motion.button
      onClick={handleBackToTop}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={
        visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 40, scale: 0.9 }
      }
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.96 }}
      className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40
                 group
                 rounded-full p-[2px]
                 bg-gradient-to-br from-[#47C4B7] via-emerald-500 to-[#47C4B7]
                 shadow-lg shadow-slate-900/40
                 dark:shadow-slate-900/60"
      aria-label="Back to top"
    >
      {/* inner circle */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center
                   rounded-full
                   bg-slate-950 text-slate-50
                   border border-slate-800/70
                   dark:bg-slate-50 dark:text-slate-950 dark:border-slate-200"
      >
        <ArrowUpRight
          size={18}
          className="-rotate-90 transition-transform duration-200 group-hover:-translate-y-0.5 text-[#47C4B7]"
        />
      </motion.div>
    </motion.button>
  );
};

export default BackToTop;
