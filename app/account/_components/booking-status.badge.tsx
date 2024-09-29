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
          <Badge
            variant="outline"
            className="bg-yellow-100 border border-yellow-300 text-yellow-800 font-normal "
          >
            Payment Pending
          </Badge>
        );
      case "payment_successful":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-100 border border-emerald-300 text-emerald-800 font-normal"
          >
            Awaiting vendor confirmation
          </Badge>
        );
      case "confirmed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 border border-green-300 text-green-800 font-normal"
          >
            Confirmed by vendor
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-100 border border-red-300 text-red-800 font-normal"
          >
            Cancelled
          </Badge>
        );
      case "fulfilled":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 border border-blue-300 text-blue-800 font-normal"
          >
            Fulfilled
          </Badge>
        );
      case "payment_failed":
        return (
          <Badge
            variant="outline"
            className="bg-pink-100 border border-pink-300 text-pink-800 font-normal"
          >
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
