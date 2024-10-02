import { Button } from "@/components/ui/button";
import clsx from "clsx";
import React from "react";

type Props = {
  children: React.ReactNode;
  callback: () => void;
  classNames?: string;
};

const CTA = ({ children, callback, classNames }: Props) => {
  return (
    <Button
      className={clsx("rounded-full text-black flex gap-1", classNames)}
      onClick={callback}
    >
      {children}
    </Button>
  );
};

export default CTA;
