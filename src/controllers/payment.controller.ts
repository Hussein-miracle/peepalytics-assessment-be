import { NextFunction, Response, Request } from "express";
import squarePaymentService from "../services/square.service";
import { Payment } from "../models/payment.model";

export const postProcessPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;
  const { amount, sourceId, currency } = body;
  try {
    const response = await squarePaymentService.processPayment({
      amount,
      currency,
      sourceId,
    });

    const status = response?.success;
    const reference = response?.paymentDetails?.id;
    // Save payment record in the database
    const payment = await Payment.create({
      amount,
      currency,
      status,
      reference,
    });

    res.status(201).json({
      message: "Payment processed successfully.",
      data: { ...payment },
    });

  } catch (error:any) {
    res.status(500).json({ error: error?.message });
  }
};

export const getRetrievePaymentDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;
  const payment_id = body?.payment_id;

  try {
    // const paymentStoreInDb = await Payment.findByPk(payment_id);

    const response = await squarePaymentService.retrievePayment(payment_id);


    res.status(200).json({
      success:response?.success,
      message:"Payment retrieved successfully",
      data:{
        ...response?.data
      }
    })
  } catch (error:any) {


    res.status(500).json({ error: error?.message });
  }


};
