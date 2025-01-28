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
    window.addEventListener("beforeprint", openAccordionsPrint);
    window.addEventListener("afterprint", closeAccordionsPrint);
    return () => {
      window.removeEventListener("beforeprint", openAccordionsPrint);
      window.removeEventListener("afterprint", closeAccordionsPrint);
    };
  }, []);
};
