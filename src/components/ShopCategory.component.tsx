import React from 'react';
import { ShopItem } from '../config/shopItems.config';
import ShopItemCard from './ShopItemCard.component';

interface ShopCategoryProps {
  title: string;
  description?: string;
  items: ShopItem[];
  money: number;
  onPurchase: (item: ShopItem) => void;
}

export default function ShopCategory({ title, description, items, money, onPurchase }: ShopCategoryProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="mb-6">
        <h2 className="text-[10px] text-soft-lilac font-game uppercase tracking-[0.2em] mb-1 flex items-center gap-4">
          {title}
          <div className="h-[1px] flex-1 bg-gradient-to-r from-soft-lilac/30 to-transparent" />
        </h2>
        {description && (
          <p className="text-[9px] text-muted-sage italic">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-3">
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
