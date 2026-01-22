import { useEffect, useState } from "react";
import "../styles/ScrollTopButton.css";

const ScrollTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    visible && (
      <button className="scroll-top-btn" onClick={scrollToTop}>
        <img src="/assets/up.png" alt="" />
      </button>
    )
  );
};

export default ScrollTopButton;
