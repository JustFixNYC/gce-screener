import { useState, useEffect } from "react";

// https://medium.com/@serifcolakel/utilizing-intersection-observer-with-custom-react-hook-in-typescript-5a27575ee154

function useInViewPort<T extends HTMLElement>(
  ref: React.RefObject<T>,
  options?: IntersectionObserverInit
) {
  const [inViewport, setInViewport] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInViewport(entry.isIntersecting);
    }, options);
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options, ref]);
  return inViewport;
}
export default useInViewPort;
