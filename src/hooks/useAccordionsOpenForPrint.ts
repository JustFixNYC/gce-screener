import { useEffect } from "react";

const openAccordionsPrint = () => {
  const accordions: NodeListOf<HTMLDetailsElement> =
    document.body.querySelectorAll("details:not([open])");
  accordions.forEach((e) => {
    e.setAttribute("open", "");
    e.dataset.wasclosed = "";
  });
};

const closeAccordionsPrint = () => {
  const accordions: NodeListOf<HTMLDetailsElement> =
    document.body.querySelectorAll("details[data-wasclosed]");
  accordions.forEach((e) => {
    e.removeAttribute("open");
    delete e.dataset.wasclosed;
  });
};

export const useAccordionsOpenForPrint = () => {
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    window.addEventListener("beforeprint", openAccordionsPrint, { signal });
    window.addEventListener("afterprint", closeAccordionsPrint, { signal });
    return () => {
      controller.abort();
    };
  }, []);
};
