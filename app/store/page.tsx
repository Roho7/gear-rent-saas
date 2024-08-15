"use client";
import React, { useEffect, useState } from "react";
import { read, utils } from "xlsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  createClientComponentClient,
  supabaseAdminClient,
} from "../_utils/supabase";
import { fetchProducts } from "./actions/fetch-products";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "../_components/navbar";

type Props = {};

const StorePage = (props: Props) => {
  const [data, setData] = useState<any[] | null>(null);
  const fetchData = async () => {
    // const data = await fetchProducts();
    // setData(data);
    const supabase = createClientComponentClient();
    const { data: product_data, error } = await supabase
      .from("tbl_products")
      .select("*");

    if (error) {
      console.log("error", error);
    }
    console.log("data", product_data);
    setData(product_data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="flex flex-col gap-2">
      <Navbar />
      <h1 className="text-xl">Adventure Rental Store</h1>
      <div className="flex gap-2 justify-start max-w-fit">
        <Select>
          <SelectTrigger id="framework">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="next">Next.js</SelectItem>
            <SelectItem value="sveltekit">SvelteKit</SelectItem>
            <SelectItem value="astro">Astro</SelectItem>
            <SelectItem value="nuxt">Nuxt.js</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger id="framework">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="next">Next.js</SelectItem>
            <SelectItem value="sveltekit">SvelteKit</SelectItem>
            <SelectItem value="astro">Astro</SelectItem>
            <SelectItem value="nuxt">Nuxt.js</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 grid-cols-4 ">
        {data?.map((d, index) => {
          return (
            <Card className="">
              <CardHeader>
                <CardTitle>{d.product_title}</CardTitle>
                <CardDescription>{d.product_title}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={d.image_url} alt="img" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-gray-400 flex items-center gap-2">
                  <h2 className=" text-xl">${d.price}</h2>
                  <p className="text-xs">/day</p>
                </span>
                <Button>Rent</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StorePage;
