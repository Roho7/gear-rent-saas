"use client";
import { useAuth } from "@/app/_providers/useAuth";
import { toast } from "@/components/ui/use-toast";
import { BookingsType } from "@/src/entities/models/types";
import { useEffect, useState } from "react";
import BookingCard from "../_components/booking.card";
import { fetchBookings } from "./_actions/bookings.actions";

const BookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingsType[]>([]);

  useEffect(() => {
    const getBookings = async () => {
      try {
        if (user?.user_id) {
          const bookings = await fetchBookings();
          setBookings(bookings);
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message ?? "Failed to fetch bookings",
          variant: "destructive",
        });
      }
    };
    getBookings();
  }, []);

  return (
    <div className="h-full flex flex-col flex-1 gap-4">
      <h2 className="text-xl">Your Bookings</h2>
      <div className="flex flex-col gap-2 flex-1">
        {bookings.map((booking) => (
          <BookingCard key={booking.booking_id} bookingItem={booking} />
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;
