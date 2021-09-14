import { NextFunction, ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

type LogFunction = (message: string) => void;
export interface HttpError extends Error {
  statusCode?: StatusCodes;
  status?: StatusCodes;
}

export interface ErrorResponse {
  message: string;
  stacktrace?: string;
}

export const getErrorLogHandlerMiddleware: (log: LogFunction) => ErrorRequestHandler = (log) => {
  const mapColoniesErrorExpressHandler: ErrorRequestHandler = (
    err: HttpError,
    req,
    res,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ): void => {
    const responseStatusCode = err.statusCode ?? err.status ?? StatusCodes.INTERNAL_SERVER_ERROR;

    if (responseStatusCode >= StatusCodes.INTERNAL_SERVER_ERROR) {
      log(`${req.method} request to ${req.originalUrl} has failed with error: ${err.message}`);
    }
    next(err);
  };
  return mapColoniesErrorExpressHandler;
};
