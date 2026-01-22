import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Change 100 to the number of pixels you want to scroll down
    window.scrollTo({
      top: 0, 
      left: 0,
      behavior: 'smooth' // Use 'instant' for page jumps, 'smooth' for animated scrolling
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
