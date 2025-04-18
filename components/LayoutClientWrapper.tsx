'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import MobileCartBar from "@/components/MobileCartBar";
import CartDrawer from "@/components/CartDrawer";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";
import { Toaster } from "sonner";

export default function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showHeader = pathname !== '/start-ordering' && 
                     !pathname.includes('/about') &&
                     !pathname.includes('/checkout') &&
                     !pathname.includes('/admin');
     
  const showCartElements = pathname !== '/start-ordering';

  return (
    <>
      {showHeader && <Header />}
      <SyncUserWithConvex />
      <main suppressHydrationWarning={true} className="flex-grow">{children}</main>
      <Toaster richColors position="top-right" />
      {showCartElements && (
        <div suppressHydrationWarning={true}>
          <MobileCartBar />
          <CartDrawer />
        </div>
      )}
    </>
  );
}