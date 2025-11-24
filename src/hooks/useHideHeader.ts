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
    let lastScrollY = window.scrollY || window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.scrollY || window.pageYOffset;

      console.log({
        scrollY,
        // headerScrollTop: headerRef.current?.scrollTop,
        // bodyOffsetHeight: window.document.body.offsetHeight,
        innerHeight: window.innerHeight,
        combinedScroll: scrollY + window.innerHeight,
        scrollHeight: document.documentElement.scrollHeight,
        // pageYOffset: window.pageYOffset
      });

      // Prevents possible jitter from tiny scroll changes
      if (Math.abs(scrollY - lastScrollY) < threshold) {
        ticking = false;
        return;
      }

      const headerHeight = headerRef?.current?.offsetHeight;
      const closeToPageBottom =
        scrollY + window.innerHeight >
        document.documentElement.scrollHeight - pageBottomProximity;

      if (headerHeight && scrollY < headerHeight) {
        // prevents seeing "behind" the header
        setHideHeader(false);
      } else if (closeToPageBottom) {
        // do nothing to prevent jitter at bottom of the page
      } else {
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

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, [headerRef, threshold]);

  return hideHeader;
};
