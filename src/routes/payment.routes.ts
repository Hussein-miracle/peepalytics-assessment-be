import { Router } from "express";
import { getRetrievePaymentDetails, postProcessPayment } from "../controllers/payment.controller";

const router = Router();


router.post("/process-payment",postProcessPayment);
router.post("/payments/:payment_id",getRetrievePaymentDetails);