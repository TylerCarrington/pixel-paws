import React from 'react';
import { ShopItem } from '../config/shopItems.config';
import ShopItemCard from './ShopItemCard.component';

interface ShopCategoryProps {
  title: string;
  items: ShopItem[];
  money: number;
  onPurchase: (item: ShopItem) => void;
}

export default function ShopCategory({ title, items, money, onPurchase }: ShopCategoryProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-[10px] text-soft-lilac font-game uppercase tracking-[0.2em] mb-6 flex items-center gap-4">
        {title}
        <div className="h-[1px] flex-1 bg-gradient-to-r from-soft-lilac/30 to-transparent" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <ShopItemCard 
            key={item.id}
            item={item}
            canAfford={money >= item.cost}
            onPurchase={onPurchase}
          />
        ))}
      </div>
    </section>
  );
}
