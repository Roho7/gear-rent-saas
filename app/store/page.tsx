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
import { OutdoorHireData } from "@/data/contants";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";

type Props = {};

const StorePage = (props: Props) => {
  return (
    <div>
      <h1>Store Page</h1>

      <div className="grid gap-2 grid-cols-4 ">
        {OutdoorHireData.map((d, index) => {
          return (
            <Card className="">
              <CardHeader>
                <CardTitle>{d.title}</CardTitle>
                <CardDescription>{d.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <img height={100} width={100} src={d.img} alt="img" />
              </CardContent>
              <CardFooter className="flex justify-between">
                {/* <Button variant="outline">Cancel</Button> */}
                <Button>Search</Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StorePage;
