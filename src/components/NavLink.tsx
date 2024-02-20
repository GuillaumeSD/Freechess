import { Link as MuiLink } from "@mui/material";
import NextLink from "next/link";
import { ReactNode } from "react";

export default function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <MuiLink
      component={NextLink}
      href={href}
      underline="none"
      color="inherit"
      sx={{ width: "100%" }}
    >
      {children}
    </MuiLink>
  );
}
