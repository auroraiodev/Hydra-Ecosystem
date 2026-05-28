'use client';

import React from 'react';
import type { CartItem } from '../types';

interface CartSummaryProps {
  cartItems: CartItem[];
}

export function CartSummary({ cartItems }: CartSummaryProps) {
  const getItemPrice = (item: CartItem) => {
    const pd = item.productData;
    if (!pd) return 0;
    if (pd.finalPrice && pd.finalPrice > 0) return pd.finalPrice;
    if (pd.price_mxn && pd.price_mxn > 0) return pd.price_mxn;
    if (typeof pd.price === 'number' && pd.price > 0) return pd.price;
    if (typeof pd.price === 'string') {
      const parsed = parseFloat(pd.price.replace(/[^0-9.-]+/g, ''));
      if (parsed > 0) return parsed;
    }
    if (pd.price_mxn_local && pd.price_mxn_local > 0) return pd.price_mxn_local;
    if (pd.price_mxn_importation && pd.price_mxn_importation > 0) return pd.price_mxn_importation;
    return 0;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) return null;

  return (
    <div className="border-t pt-4 flex items-center justify-between text-sm">
      <span className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest">
        {totalItems} item{totalItems !== 1 ? 's' : ''} en total
      </span>
      <span className="font-bold text-primary tabular-nums">
        Subtotal: ${subtotal.toFixed(2)} MXN
      </span>
    </div>
  );
}
