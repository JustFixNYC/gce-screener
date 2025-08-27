import { renderToStaticMarkup } from "react-dom/server";
import { GCELetterPostData } from "../../../types/APIDataTypes";

import pdfStyles from "./letter-styles-pdf.css?raw";

export const buildLetterHtml = (
  letterData: Omit<GCELetterPostData, "html_content">,
  isPdf: boolean
): string => {
  const { user_details: user, landlord_details: landlord } = letterData;
  const cssPdf = pdfStyles.replace(/\s+/g, "");
  return renderToStaticMarkup(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>Good Cause Eviction Letter</title>
        {isPdf ? (
          <style dangerouslySetInnerHTML={{ __html: cssPdf }} />
        ) : (
          <link rel="stylesheet" href="/letter-styles-html.css" />
        )}
      </head>
      <body>
        <main id="letter">
          <h1>Good Cause Eviction Letter</h1>
          <section>
            From:
            <br />
            {user.first_name} {user.last_name}
            <br />
            {user.primary_line}
            {!!user.secondary_line && (
              <>
                <br />
                {user.secondary_line}
              </>
            )}
            <br />
            <br />
            To:
            <br />
            {landlord.name}
            <br />
            {landlord.primary_line}
            {!!landlord.secondary_line && (
              <>
                <br />
                {landlord.secondary_line}
              </>
            )}
          </section>
          <br />
          <br />
          <section>Asserting Good Cause rights...</section>
        </main>
      </body>
    </html>
  );
};

export function base64ToBlob(base64Data: string, contentType: string): Blob {
  const byteCharacters = atob(base64Data);
  const byteArrays: BlobPart[] = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}
