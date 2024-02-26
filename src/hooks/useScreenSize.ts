import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: document?.querySelector(".MuiGrid-root")?.clientWidth ?? 500,
    height: window?.innerHeight - 120 ?? 500,
  });

  useEffect(() => {
    const mainDiv = document?.querySelector(".MuiGrid-root");
    if (!mainDiv) return;

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

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getBoardSize = () => {
    const width = screenSize.width;
    const height = screenSize.height;

    // 1200 is the lg layout breakpoint
    if (window?.innerWidth < 1200) {
      return Math.min(width, height - 150);
    }

    return Math.min(width - 600, height * 0.95);
  };

  return { ...screenSize, boardSize: getBoardSize() };
};
