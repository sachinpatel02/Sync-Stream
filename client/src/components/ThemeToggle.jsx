import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full p-1 focus-ring"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md"
        animate={{
          x: isDark ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      />
      
      <div className="flex justify-between items-center h-full px-1">
        <FiSun 
          className={`w-3 h-3 ${!isDark ? 'text-yellow-500' : 'text-gray-400'}`} 
        />
        <FiMoon 
          className={`w-3 h-3 ${isDark ? 'text-blue-400' : 'text-gray-400'}`} 
        />
      </div>
    </motion.button>
  );
};

export default ThemeToggle; 