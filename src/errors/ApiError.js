export default class ApiError extends Error {
  constructor({ message, stack }, status) {
    super(message, stack);
    this.status = status;
  }
}
