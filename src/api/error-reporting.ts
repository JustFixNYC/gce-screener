/**
 * A generic network error. It could be because the network is down, or because
 * a server returned a HTTP response like 404 or 500.
 *
 * Note that we need to define this ourselves because `fetch()` will actually
 * reject with a `TypeError` on network failure, which is awfully ambiguous.
 */
export class NetworkError extends Error {
  constructor(
    message: string,
    readonly shouldReport: boolean = false,
  ) {
    super(message);
  }
}

/**
 * A network error that happened because the HTTP status code is not in
 * the range 200-299.
 */
export class HTTPError extends NetworkError {
  statusText: string;
  status: number;
  info: object | undefined;

  constructor(readonly response: Response) {
    super(
      `HTTP Error ${response.statusText}`,
      // If the response status is 4xx, we want to report it
      // because it's our "fault" as a client--i.e., we should change
      // our client-side code to never make the request in the
      // first place.
      response.status >= 400 && response.status < 500,
    );
    this.statusText = response.statusText;
    this.status = response.status;
  }
}
