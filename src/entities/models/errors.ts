import { AuthError, PostgrestError } from "@supabase/supabase-js";

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
    this.message = "Unknown error";
    this.name = "UnknownError";
  }
}

export class DatabaseError extends ServerError {
  error?: PostgrestError;
  constructor(message: string, functionName: string, error?: PostgrestError) {
    super(message, functionName);
    this.name = "DatabaseError";
    this.error = error;
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends ServerError {
  error?: AuthError;
  constructor(message: string, functionName: string, error?: AuthError) {
    super(message, functionName);
    this.name = "AuthenticationError";
    this.error = error;
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
