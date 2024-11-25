import { NextFunction,Response,Request} from "express";
import squarePaymentService from "../services/square.service";

export const postProcessPayment = async (req:Request,res:Response,next:NextFunction) => {
  const body = req.body;

  try {
    
  } catch (error) {
    
  }
}

export const getRetrievePaymentDetails = async (req:Request,res:Response,next:NextFunction) => {

}