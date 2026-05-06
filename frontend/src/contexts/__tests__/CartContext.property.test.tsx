import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { CartItem, MenuItem } from '../../api/types';

// Domain generators
const menuItemArb = fc.record({
  id: fc.integer({ min: 1, max: 10000 }),
  category_id: fc.integer({ min: 1, max: 100 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  price: fc.integer({ min: 100, max: 1000000 }),
  description: fc.string({ maxLength: 200 }),
  image_url: fc.option(fc.webUrl(), { nil: null }),
  display_order: fc.integer({ min: 0, max: 100 }),
}) as fc.Arbitrary<MenuItem>;

const cartItemArb = fc.record({
  menu_item_id: fc.integer({ min: 1, max: 10000 }),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  price: fc.integer({ min: 100, max: 1000000 }),
  quantity: fc.integer({ min: 1, max: 99 }),
  image_url: fc.option(fc.webUrl(), { nil: null }),
}) as fc.Arbitrary<CartItem>;

// Pure functions extracted for testing
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function addItemToCart(items: CartItem[], menuItem: MenuItem): CartItem[] {
  const existing = items.find((i) => i.menu_item_id === menuItem.id);
  if (existing) {
    return items.map((i) =>
      i.menu_item_id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
    );
  }
  return [...items, { menu_item_id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1, image_url: menuItem.image_url }];
}

describe('Cart PBT - Invariant Properties', () => {
  it('totalAmount is always sum of (price * quantity) for all items', () => {
    fc.assert(
      fc.property(fc.array(cartItemArb, { maxLength: 20 }), (items) => {
        const total = calculateTotal(items);
        const expected = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        expect(total).toBe(expected);
      })
    );
  });

  it('totalAmount is always non-negative', () => {
    fc.assert(
      fc.property(fc.array(cartItemArb, { maxLength: 20 }), (items) => {
        const total = calculateTotal(items);
        expect(total).toBeGreaterThanOrEqual(0);
      })
    );
  });

  it('itemCount is always sum of quantities', () => {
    fc.assert(
      fc.property(fc.array(cartItemArb, { maxLength: 20 }), (items) => {
        const count = calculateItemCount(items);
        const expected = items.reduce((sum, item) => sum + item.quantity, 0);
        expect(count).toBe(expected);
      })
    );
  });

  it('all cart items have quantity >= 1', () => {
    fc.assert(
      fc.property(fc.array(cartItemArb, { maxLength: 20 }), (items) => {
        items.forEach((item) => {
          expect(item.quantity).toBeGreaterThanOrEqual(1);
        });
      })
    );
  });
});

describe('Cart PBT - Idempotence Properties', () => {
  it('adding same menu item N times results in single item with quantity N', () => {
    fc.assert(
      fc.property(menuItemArb, fc.integer({ min: 1, max: 10 }), (menuItem, times) => {
        let items: CartItem[] = [];
        for (let i = 0; i < times; i++) {
          items = addItemToCart(items, menuItem);
        }
        const found = items.filter((i) => i.menu_item_id === menuItem.id);
        expect(found).toHaveLength(1);
        expect(found[0].quantity).toBe(times);
      })
    );
  });
});

describe('Cart PBT - Round-trip Properties', () => {
  it('serialize/deserialize cart preserves all data', () => {
    fc.assert(
      fc.property(fc.array(cartItemArb, { maxLength: 20 }), (items) => {
        const serialized = JSON.stringify(items);
        const deserialized = JSON.parse(serialized) as CartItem[];
        expect(deserialized).toEqual(items);
      })
    );
  });
});
