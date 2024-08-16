"use client";
import React from "react";
import { BiShoppingBag } from "react-icons/bi";
import { useCart } from "../_providers/useCart";
import CartRowItem from "./_components/cart-row-item";
import { useAuth } from "../_providers/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {};

const CartPage = (props: Props) => {
  const { cartItems } = useCart();
  const { products } = useAuth();

  return (
    <section className="m-8 flex flex-col gap-4 h-full">
      <h1 className="text-5xl flex gap-2">
        <BiShoppingBag /> Your bag
      </h1>
      <div className="flex gap-2 w-full">
        <Card className=" w-[70%]">
          {Object.keys(cartItems).map((item, key) => {
            return (
              <CartRowItem
                key={key}
                product={products.find((p) => p.product_id === item)}
              />
            );
          })}
        </Card>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl">Your total</CardTitle>
            <CardDescription>Checkout in one click</CardDescription>
          </CardHeader>
          <CardContent className=" flex flex-col">
            {Object.keys(cartItems).map((d) => (
              <div className="flex justify-between">
                <p>
                  {
                    products.find((item) => item.product_id === d)
                      ?.product_title
                  }
                  <span className="text-gray-400 ml-4">
                    x{cartItems[d].quantity}
                  </span>
                </p>
                <span>$$$</span>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button className="w-full">Checkout</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default CartPage;
