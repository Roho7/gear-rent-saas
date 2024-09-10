class ServerError extends Error {
  functionName: string;
  errorMessage?: string;
  constructor(message: string, functionName: string, errorMessage?: string) {
    super(message);
    this.name = "ServerError";
    this.functionName = functionName;
    this.errorMessage = errorMessage;
  }
}

export class UnknownError extends ServerError {
  constructor(message: string, functionName: string, errorMessage?: string) {
    super(message, functionName, errorMessage);
    this.name = "UnknownError";
  }
}

export class DatabaseError extends ServerError {
  constructor(message: string, functionName: string, errorMessage?: string) {
    super(message, functionName, errorMessage);
    this.name = "DatabaseError";
    this.errorMessage = errorMessage;
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends ServerError {
  constructor(message: string, functionName: string) {
    super(message, functionName);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends Error {
  level?: string;
  constructor(message: string, level?: string) {
    super(message);
    this.name = "AuthorizationError";
    this.level = level;
  }
}
