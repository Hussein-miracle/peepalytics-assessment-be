import { NextFunction,Response,Request} from "express";
import LoggerMiddleware from "./logger.middleware";

export function errorHandler(err:Error,req:Request,res:Response,next:NextFunction){
  const statusCode = res?.statusCode !== 200 ? res?.statusCode : 500;

  const responseBody = {
    message: err?.message,
    stack:process.env.NODE_ENV === "production" ? "💥💥💥" : err?.stack,
  }

  LoggerMiddleware.errorLogger(err,req,res,next);
  res.status(statusCode).json(responseBody);
}


export function notFoundHandler(req:Request,res:Response,next:NextFunction){
  const err = new Error("Route does not exist")
  LoggerMiddleware.errorLogger(err,req,res,next);
  res.status(404).json({message:"Api route does not exist"});
}