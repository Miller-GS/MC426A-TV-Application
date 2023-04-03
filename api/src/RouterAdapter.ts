import { Controller } from "./controller/Controller";
import { Request, Response } from "express";

export const adaptRoute = (controller: Controller<any>) => {
    return async (request: Request, response: Response) => {
      const requestWithMergedParams = {
        ...(request.body || {}),
        ...(request.params || {}),
        ...(request.query || {}),
      };
  
      const httpResponse = await controller.handle(requestWithMergedParams);
  
      if (
        (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) ||
        httpResponse.statusCode === 400
      ) {
        return response.status(httpResponse.statusCode).json(httpResponse.body);
      }
  
      console.error("Application Error", httpResponse.body);
      return response.status(httpResponse.statusCode).json({
        error: httpResponse.body.message,
      });
    };
}