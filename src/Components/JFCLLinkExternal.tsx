import { Link, LinkProps } from "@justfixnyc/component-library";
import React from "react";

// Creating a version of our Component library's Link component that
// has the internal icon for passing into react router Links.

const JFCLLinkExternal: React.FC<LinkProps> = (props) => {
  return (
    <Link
      icon="external"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
};

export default JFCLLinkExternal;
