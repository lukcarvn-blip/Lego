import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faces = [
  // 0: Smile
  <g key="smile">
    <circle cx="9" cy="11" r="1.5" fill="#000"/>
    <circle cx="15" cy="11" r="1.5" fill="#000"/>
    <path d="M9 15C9 15 10.5 17 12 17C13.5 17 15 15 15 15" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
  </g>,
  // 1: Surprised
  <g key="surprised">
    <circle cx="9" cy="10" r="1.5" fill="#000"/>
    <circle cx="15" cy="10" r="1.5" fill="#000"/>
    <circle cx="12" cy="15" r="2" fill="#000" />
  </g>,
  // 2: Wink
  <g key="wink">
    <path d="M7 11L11 11" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="15" cy="11" r="1.5" fill="#000"/>
    <path d="M9 15C9 15 10.5 17 12 17C13.5 17 15 15 15 15" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
  </g>,
  // 3: Cool
  <g key="cool">
    <path d="M7 10H17V12C17 13.1 16.1 14 15 14H14C12.9 14 12 13.1 12 12V11V12C12 13.1 11.1 14 10 14H9C7.9 14 7 13.1 7 12V10Z" fill="#000"/>
    <path d="M10 16H14" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
  </g>,
  // 4: Mustache
  <g key="mustache">
    <circle cx="9" cy="11" r="1.5" fill="#000"/>
    <circle cx="15" cy="11" r="1.5" fill="#000"/>
    <path d="M8 15C8 15 9.5 14 12 14C14.5 14 16 15 16 15C16 15 14.5 16.5 12 16.5C9.5 16.5 8 15 8 15Z" fill="#000"/>
  </g>
];

export const LegoHeadIcon = ({ size = 32, isLoading = false }: { size?: number, isLoading?: boolean }) => {
  const [faceIdx, setFaceIdx] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isLoading) {
        setFaceIdx((prev) => (prev + 1) % faces.length);
      } else {
        setFaceIdx(Math.floor(Math.random() * faces.length));
      }
    }, isLoading ? 200 : 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 4V2H17V4M5 4H19C20.1046 4 21 4.89543 21 6V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V6C3 4.89543 3.89543 4 5 4Z" fill="#FDE047"/>
      <AnimatePresence mode="wait">
        <motion.g
          key={faceIdx}
          initial={{ opacity: 0, y: 2 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          {faces[faceIdx]}
        </motion.g>
      </AnimatePresence>
    </svg>
  );
};
