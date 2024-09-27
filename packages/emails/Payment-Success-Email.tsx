import React from "react";

interface PaymentSuccessEmailProps {
  userName: string;
  userEmail: string;
  stripePayload: {
    amount: number;
    currency: string;
    paymentMethod: string;
    receiptUrl: string;
  };
}

const PaymentSuccessEmail: React.FC<PaymentSuccessEmailProps> = ({
  userName,
  userEmail,
  stripePayload,
}) => {
  const { amount, currency, paymentMethod, receiptUrl } = stripePayload;
  return null;
  // return (
  //     <Resend
  //         to={userEmail}
  //         subject="Payment Successful"
  //         html={`
  //             <div>
  //                 <h1>Payment Successful</h1>
  //                 <p>Dear ${userName},</p>
  //                 <p>Thank you for your payment. Here are the details of your transaction:</p>
  //                 <ul>
  //                     <li>Amount: ${amount} ${currency}</li>
  //                     <li>Payment Method: ${paymentMethod}</li>
  //                     <li><a href="${receiptUrl}">View Receipt</a></li>
  //                 </ul>
  //                 <p>Thank you for your business!</p>
  //             </div>
  //         `}
  //     />
  // );
};

export default PaymentSuccessEmail;
