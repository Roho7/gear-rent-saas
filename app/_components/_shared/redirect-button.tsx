import Link from "next/link";
import React from "react";

type Props = {};

const RedirectButton = ({
  link,
  children,
}: {
  link: string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={link}
      className="bg-background border border-border rounded-md p-2 text-sm hover:bg-muted/10"
    >
      {children}
    </Link>
  );
};

export default RedirectButton;
