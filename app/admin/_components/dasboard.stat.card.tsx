"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  value: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export default function DashboardStat({
  value,
  title,
  description,
  icon,
}: Props) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-4xl flex gap-1 items-center">
          {icon}
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{description}</div>
      </CardContent>
      <CardFooter>
        {/* <Progress value={25} aria-label="25% increase" /> */}
      </CardFooter>
    </Card>
  );
}
