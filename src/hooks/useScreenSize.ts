import { useEffect, useState } from "react";

export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: document?.querySelector(".MuiGrid2-root")?.clientWidth ?? 500,
    height: window ? window.innerHeight - 120 : 500,
  });

  useEffect(() => {
    const mainDiv = document?.querySelector(".MuiGrid2-root");
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
        height: window.innerHeight - 100,
      }));
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};
