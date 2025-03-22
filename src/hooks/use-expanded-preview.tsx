
import { useState, useCallback, useEffect } from "react";

export function useExpandedPreview() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);
  
  const toggleExpanded = useCallback(() => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    // When expanded, hide the form and show hamburger menu
    if (newExpandedState) {
      setIsFormVisible(false);
    } else {
      setIsFormVisible(true);
    }
  }, [isExpanded]);

  // Auto-expand on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsExpanded(true);
        setIsFormVisible(false);
      }
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    isExpanded,
    toggleExpanded,
    setIsExpanded,
    isFormVisible,
    setIsFormVisible
  };
}
