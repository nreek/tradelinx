export default class ConnectionError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.name = 'ConnectionError';
  }
}
