import { renderToStaticMarkup } from "react-dom/server";
import { setupI18n } from "@lingui/core";

import { GCELetterPostData } from "../../../types/APIDataTypes";
import { SupportedLocale } from "../../../i18n-base";
import { Letter } from "./Letter";

export const i18nLetter = setupI18n();

async function changeLetterLocale(locale: SupportedLocale) {
  const { messages } = await import(`../../../locales/${locale}/messages.po`);

  i18nLetter.load(locale, messages);
  i18nLetter.activate(locale);
}

export const buildLetterHtml = (
  letterData: Omit<GCELetterPostData, "html_content">,
  locale: SupportedLocale,
  isPdf: boolean
): Promise<string> => {
  return changeLetterLocale(locale).then(() => {
    return renderToStaticMarkup(
      <Letter letterData={letterData} isPdf={isPdf} />
    );
  });
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
