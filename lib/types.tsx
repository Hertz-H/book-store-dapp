export interface BookType {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  priceUSD: number;
  priceETH: number;
  priceWei: string;
  stock: number;
  description: string;
}

export interface CartItemType {
  book: BookType;
  quantity: number;
}
