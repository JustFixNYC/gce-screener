import React from "react";
import { PageFields } from "./content-types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import { Asset } from "contentful";
import { WithJsonifiedDocuments } from "./jsonified-document";

type ContentfulPageProps = {
  pageFields: WithJsonifiedDocuments<PageFields> | PageFields;
};

/**
 * A page defined and localized in Contentful.
 */
export const ContentfulPage: React.FC<ContentfulPageProps> = (props) => {
  const page = props.pageFields as PageFields;
  const result = documentToReactComponents(page.content, {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const asset = node.data.target as Asset;
        return (
          <aside className="contentful-asset">
            <img
              src={asset.fields.file?.url as string}
              alt={asset.fields.description as string}
              className="img-responsive"
            />
          </aside>
        );
      },
      [INLINES.HYPERLINK]: (node, children) => (
        <a href={node.data.uri} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
    },
  });

  return <>{result}</>;
};
