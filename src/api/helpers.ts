import { HTTPError, NetworkError } from "./error-reporting";

/**
 * Rebase a url like `/api/boop` to start with our API base URL
 */
function apiURL(url: string): string {
  return `${import.meta.env.VITE_JUSTFIX_API_BASE_URL}${url}`;
}

export const apiFetcher = async (url: string) => {
  const res = await fetch(apiURL(url), {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_JUSTFIX_API_TOKEN}`,
    },
  });

  const contentType = res.headers.get("Content-Type");
  if (!(contentType && /^application\/json/.test(contentType))) {
    throw new NetworkError(
      `Expected JSON response but got ${contentType} from ${res.url}`,
      true,
    );
  }

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new HTTPError(res);
    // Attach extra info to the error object.
    error.info = await res.json();
    throw error;
  }
  try {
    await new Promise(resolve => setTimeout(resolve, 20000))
    return await res.json();
  } catch (e) {
    if (e instanceof Error) {
      throw new NetworkError(e.message);
    } else {
      throw new Error("Unexpected error");
    }
  }
};
