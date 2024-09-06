"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BiShoppingBag } from "react-icons/bi";

import { useProducts } from "@/app/_providers/useProducts";
import CartRowItem from "./_components/cart-row-item";

const CartPage = () => {
  const { cartItems, products } = useProducts();

  return (
    <section className="m-8 flex flex-col gap-4 h-full">
      <h1 className="text-5xl flex gap-2">
        <BiShoppingBag /> Your bag
      </h1>
      <div className="flex gap-2 w-full">
        <Card className=" w-[70%]">
          {Object.keys(cartItems || {}).map((item, key) => {
            return (
              <CartRowItem
                key={key}
                product={products.find((p) => p.product_id === item)}
              />
            );
          })}
        </Card>
        <Card className="flex-1 max-h-min">
          <CardHeader>
            <CardTitle className="text-xl">Your total</CardTitle>
            <CardDescription>Checkout in one click</CardDescription>
          </CardHeader>
          <CardContent className=" flex flex-col">
            {Object.keys(cartItems || {}).map((d) => (
              <div className="flex justify-between" key={d}>
                <p>
                  {
                    products.find((item) => item.product_id === d)
                      ?.product_title
                  }
                  <span className="text-gray-400 ml-4">
                    x{cartItems?.[d].quantity}
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
