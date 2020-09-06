export default class NS {
  /**
   * Create a point.
   * @param {'INIT'|'LOADING'|'SUCCESS'|'ERROR'} status
   * @param {string|null} message
   */
  constructor(status, message, statusCode = 0, responseTime = 0, requestId, cached = false, hasData = false, token) {
    this.code = status;
    this.message = message;
    this.statusCode = statusCode;
    this.hasData = hasData;
    this.responseTime = responseTime;
    this.requestId = requestId;
    this.cached = cached;
    this.token = token;
  }

  get isInit() {
    return this.code === "INIT";
  }

  get isLoading() {
    return this.code === "LOADING";
  }

  get isError() {
    return this.code === "ERROR";
  }

  get isSuccess() {
    return this.code === "SUCCESS";
  }

  toString() {
    return this.code;
  }
}
