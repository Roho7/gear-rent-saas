import { Badge } from "@/components/ui/badge";
import { BookingStatusType } from "@/src/entities/models/types";

type Props = {
  status: BookingStatusType;
};

const BookingStatusBadge = ({ status }: Props) => {
  const bookingStatusMap = (status: BookingStatusType) => {
    switch (status) {
      case "payment_pending":
        return (
          <Badge variant="outline" className="bg-yellow-200">
            Payment Pending
          </Badge>
        );
      case "payment_successful":
        return (
          <Badge variant="outline" className="bg-emerald-200">
            Awaiting vendor confirmation
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="outline" className="bg-green-200">
            Confirmed by vendor
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-300">
            Cancelled
          </Badge>
        );
      case "fulfilled":
        return (
          <Badge variant="outline" className="bg-blue-200">
            Fulfilled
          </Badge>
        );
      case "payment_failed":
        return (
          <Badge variant="outline" className="bg-red-200">
            Payment Failed
          </Badge>
        );
      default:
        return <Badge>Pending</Badge>;
    }
  };
  return bookingStatusMap(status);
};

export default BookingStatusBadge;
