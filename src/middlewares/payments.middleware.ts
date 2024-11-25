import { NextFunction,Response,Request} from "express";
import { paymentProcessingSchema, paymentRetrievalSchema } from "../utils/validations/payments";

export const validateProcessPayment = (req: Request, res: Response, next: NextFunction) => {

  const { error } = paymentProcessingSchema.validate(req.body, { abortEarly: false });

  if (!!error) {
    const errors = error.details.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    res.status(400).json({
      message:"Bad request",
      details: errors,
    });

    return;
  }

  next(); 
}

export const validateRetrievePayment =  (req: Request, res: Response, next: NextFunction) => {
  const {error} =  paymentRetrievalSchema.validate(req.body, { abortEarly: false });


  if(!!error){

    const errors = error.details.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));

    res.status(400).json({
      message:"Bad Request",
      details:errors
    })

    return;
  }



  next();
}