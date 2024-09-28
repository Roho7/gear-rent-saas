"use client";
import { useSearchParams } from "next/navigation";
import { BiCheckDouble, BiX } from "react-icons/bi";
import RedirectButton from "../_components/_shared/redirect-button";

const Page = () => {
  const searchParams = useSearchParams();

  if (searchParams.get("payment_status") === "success") {
    return (
      <div className="w-full h-screen overflow-hidden flex flex-col items-center justify-center gap-2">
        <div className="p-4 rounded-full bg-green-500 text-background animate-[bounce_1s_ease-in-out_infinite]">
          <BiCheckDouble className="h-10 w-10 " />
        </div>
        <h2 className="text-primary/80 text-2xl">Booking successful</h2>
        <p className="text-sm text-muted">
          Your booking was successfully processed. You can view your booking
          status in the bookings page.
        </p>
        <RedirectButton link="/account/bookings">Go To Bookings</RedirectButton>
      </div>
    );
  }
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col items-center justify-center gap-2">
      <div className="p-4 rounded-full bg-red-500 text-background relative">
        <BiX className="h-10 w-10 " />
        <div className="absolute inset-0 -z-10 w-full h-full bg-red-300 animate-[ping_4s_ease-in-out_infinite] rounded-full"></div>
      </div>
      <h2 className="text-primary/80 text-2xl">Booking failed</h2>
      <p className="text-sm text-muted">
        Something went wrong while processing your booking. Please try again.
      </p>
      <RedirectButton link="/home">Back to store</RedirectButton>
    </div>
  );
};

export default Page;
