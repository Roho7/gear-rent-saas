import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import React, { useMemo } from "react";
import { BiShoppingBag } from "react-icons/bi";
import { useCart } from "../_providers/useCart";

type Props = {};

const CartPopup = (props: Props) => {
  const { cartItems } = useCart();

  const cartQuantity = useMemo(
    () => Object.keys(cartItems).length,
    [cartItems],
  );
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="default" className="rounded-full relative">
          <div className="rounded-full text-xs  bg-stone-100 text-black flex items-center justify-center h-5 w-5 absolute -right-2 -top-2">
            {cartQuantity}
          </div>
          <BiShoppingBag />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold flex gap-1 items-center">
              <BiShoppingBag /> Your bag
            </h4>
            {cartQuantity === 0 ? (
              <p className="text-sm">Your bag is empty</p>
            ) : (
              <p className="text-sm">
                Your have {cartQuantity} items in your bag
              </p>
            )}
            <div className="flex items-center pt-2">
              <span className="text-xs text-muted-foreground">
                Total: $0.00
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default CartPopup;
