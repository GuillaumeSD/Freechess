import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState(() => ({
    width: 500,
    height: 500,
  }));

  useEffect(() => {
    const mainDiv = document?.querySelector(".MuiGrid-root");
    if (!mainDiv) return;

    setScreenSize((prev) => ({
      ...prev,
      width: mainDiv.clientWidth,
    }));
    const observer = new ResizeObserver(() =>
      setScreenSize((prev) => ({ ...prev, width: mainDiv.clientWidth }))
    );
    observer.observe(mainDiv);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize((prev) => ({
        ...prev,
        height: window.innerHeight - 120,
      }));
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};
