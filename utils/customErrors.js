class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message || 'Resource not found', 404);
  }
}

module.exports = { AppError, NotFoundError };
