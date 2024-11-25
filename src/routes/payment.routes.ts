import { Router } from "express";
import { getRetrievePaymentDetails, postProcessPayment } from "../controllers/payment.controller";
import { validateProcessPayment, validateRetrievePayment } from "../middlewares/payments.middleware";

const paymentRoutes = Router();


paymentRoutes.post("/process-payment",validateProcessPayment,postProcessPayment);
paymentRoutes.get("/payments/:payment_id",validateRetrievePayment,getRetrievePaymentDetails);


export default paymentRoutes