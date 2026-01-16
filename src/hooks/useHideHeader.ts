import { useEffect, useState } from "react";

/** Hook to get value for whether to hide top nav fixed header */
// https://stackoverflow.com/a/62497293/7051239
// https://medium.com/@mariusc23/hide-header-on-scroll-down-show-on-scroll-up-67bbaae9a78c
export const useHideHeader = (
  headerRef: React.RefObject<HTMLElement>,
  threshold: number = 10
): boolean => {
  const [hideHeader, setHideHeader] = useState<boolean>(false);
  const pageBottomProximity = 100;

  useEffect(() => {
    const mainElement = document.getElementById("main");
    if (!mainElement) {
      return;
    }

    let lastScrollY = mainElement.scrollTop;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = mainElement.scrollTop;

      // Prevents possible jitter from tiny scroll changes
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      const headerHeight = headerRef?.current?.offsetHeight;
      const closeToPageBottom =
        scrollY + mainElement.clientHeight >
        mainElement.scrollHeight - pageBottomProximity;

      if (headerHeight && scrollY < headerHeight) {
        // prevents seeing "behind" the header
        setHideHeader(false);
      } else if (closeToPageBottom) {
        // do nothing to prevent jitter at bottom of the page
      } else {
        // hide on scroll down, show on scroll up
        setHideHeader(scrollY > lastScrollY);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    mainElement.addEventListener("scroll", onScroll);

    return () => {
      mainElement.removeEventListener("scroll", onScroll);
    };
  }, [headerRef, threshold]);

  return hideHeader;
};
