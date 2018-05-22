import { Item } from './item';

export class CartItem {
  id: number;
  quantity: number;
  price: number;
  total: number;
  item_id: number;
  description: string;
  item: Item;
  instructions: string;
}
