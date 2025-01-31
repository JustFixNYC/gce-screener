// This file is copied form signature-dashboard

interface GTMDataLayer {
  push(obj: GTMDataLayerObject): void;
}

declare global {
  interface Window {
    /**
     * A reference to the dataLayer global object, provided by the GTM snippet.
     *
     * However, it won't exist if the app hasn't been configured to support GTM.
     */
    dataLayer: GTMDataLayer | undefined;
  }
}

/** Data layer event to send with optional params */
type GTMDataLayerObject = {
  event: string;
  eventModel?: {
    [key: string]: unknown;
  };
};

function getDataLayer(): GTMDataLayer {
  return window.dataLayer || [];
}

export const gtmPush = (
  event: string,
  params?: { [key: string]: unknown }
): void => {
  const dataLayer = getDataLayer();
  dataLayer.push({ event: event, eventModel: { ...params } });
};
