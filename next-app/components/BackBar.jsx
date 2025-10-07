"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FALLBACKS = {
  "/profile": "/",
  "/profile/password": "/profile",
  "/orders": "/",
  "/dashboard": "/",
  "/dashboard/products": "/dashboard",
  "/dashboard/orders": "/dashboard",
  "/dashboard/customers": "/dashboard",
  "/dashboard/inventory": "/dashboard",
  "/dashboard/analytics": "/dashboard",
  "/settings": "/",
  "/login": "/",
  "/register": "/",
  "/forgot-password": "/login"
};

const DEFAULT_LABEL = "Volver al inicio";

export default function BackBar({ href, label }) {
  const pathname = usePathname();
  const targetHref = href || FALLBACKS[pathname] || "/";
  const targetLabel = label || (targetHref === "/" ? DEFAULT_LABEL : "Regresar");

  return (
    <div className="back-bar">
      <Link href={targetHref} className="back-bar__link">
        <span className="back-bar__icon" aria-hidden="true">
          <i className="fas fa-arrow-left" />
        </span>
        <span>{targetLabel}</span>
      </Link>
    </div>
  );
}

