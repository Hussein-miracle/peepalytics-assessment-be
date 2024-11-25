import {
  ApiResponse,
  Client,
  CreatePaymentRequest,
  CreatePaymentResponse,
  Environment,
  GetPaymentResponse,
  ApiError,
  Error as SquareError,
} from "square";
import crypto from "crypto";
import { logger } from "../utils/logger";

class SquarePaymentService {
  private static instance: SquarePaymentService;
  private squareClient: Client;

  constructor() {
    this.squareClient = new Client({
      environment:
        process.env.SQUARE_ENVIRONMENT === "sandbox"
          ? Environment.Sandbox
          : Environment.Production,
      bearerAuthCredentials: {
        accessToken: <string>process.env.SQUARE_ACCESS_TOKEN,
      },
    });
  }

  public static getInstance(): SquarePaymentService {
    if (!SquarePaymentService.instance) {
      SquarePaymentService.instance = new SquarePaymentService();
    }
    return SquarePaymentService.instance;
  }

  async processPayment(paymentDetails: {
    amount: number;
    sourceId: string;
    currency: string;
  }) {
    try {
      const paymentRequest: CreatePaymentRequest = {
        sourceId: paymentDetails.sourceId,
        idempotencyKey: crypto.randomUUID(),
        amountMoney: {
          amount: BigInt(Math.round(paymentDetails.amount * 100)),
          currency: paymentDetails.currency,
        },
      };

      this.logPaymentProcessAttempt(paymentRequest);
      const response = await this.squareClient.paymentsApi.createPayment(
        paymentRequest
      );

      // Log successful payment
      await this.logPaymentProcessSuccess(response);

      const payment = response?.result?.payment;
      return {
        success: true,
        status: payment?.status,
        paymentDetails:{...payment}
      };
    } catch (error: unknown) {
      // Handle and log payment failure

      if( error instanceof ApiError){
        this.logPaymentProcessError(error);
        throw new Error("Payment processing failed");
      }else{

        throw new Error("Payment processing failed");
      }
    }
  }

  async retrievePayment(payment_id: string) {
    try {
      this.logPaymentRetrievalAttempt(payment_id);
      const response = await this.squareClient.paymentsApi.getPayment(
        payment_id
      );

      this.logPaymentRetrievalSuccess(response);

      const payment = response?.result?.payment;
      const amount = Number(payment?.amountMoney?.amount) / 100;
      return {
        success: true,
        data: {
          amount,
          currency:payment?.amountMoney?.currency,
          status:payment?.status,
          created_at:payment?.createdAt,
          updated_at:payment?.updatedAt,
          walletDetails:payment?.walletDetails,
        },
      };
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        this.logPaymentRetrievalError(error);
        throw new Error("Payment retrieval failed");
      }else{
        throw new Error("Payment retrieval failed");
      }

    }
  }

  private async logPaymentProcessAttempt(paymentData: CreatePaymentRequest) {
    logger.info("Payment attempt initiated", {
      ...paymentData,
    });
  }
  private async logPaymentRetrievalAttempt(paymentId: string) {
    logger.info("Payment details retrieval initiated", {
      paymentId,
    });
  }

  private async logPaymentRetrievalSuccess(
    data: ApiResponse<GetPaymentResponse>
  ) {
    logger.info("Payment details retrieved successfully", {
      ...data,
    });
  }

  private async logPaymentRetrievalError(
    error: ApiError,
    paymentData?: unknown
  ) {
    const errors = error?.result!['errors' as unknown as keyof ApiError["result"] ] as unknown as SquareError[];
    for (const error of errors) {
      logger.error("Payment processing failed", {
        error: error?.detail,
        code: error.code,
        category: error?.category,
        paymentData: paymentData
          ? {
              ...paymentData,
            }
          : undefined,
      });
    }
  }

  private async logPaymentProcessSuccess(
    data: ApiResponse<CreatePaymentResponse>
  ) {
    logger.info("Payment processed successfully", {
      ...data,
    });
  }


  private async logPaymentProcessError(error: ApiError, paymentData?: unknown) {
    const errors = error?.result!['errors' as unknown as keyof ApiError["result"] ] as unknown as SquareError[];

    for (const error of errors) {
      logger.error("Payment processing failed", {
        error: error?.detail,
        code: error?.code,
        category: error?.category,
        paymentData: paymentData
          ? {
              ...paymentData,
            }
          : undefined,
      });
    }
  }

}

const squarePaymentService = SquarePaymentService.getInstance();


export default squarePaymentService;
