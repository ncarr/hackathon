module.exports = class EducationError extends Error {
  constructor (message, status) {
    // Calling parent constructor of base Error class.
    super(message);

    // Capturing stack trace, excluding constructor call from it.
    Error.captureStackTrace(this, this.constructor);

    // Saving class name in the property of our custom error as a shortcut.
    this.name = this.constructor.name;

    // Default HTTP status is 403, but it can be overridden
    this.status = status || 403;
    this.url = "EducationError.html";
  }
};
