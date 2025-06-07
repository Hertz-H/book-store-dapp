"use client";

import { useState } from "react";
import { BookCard } from "@/components/ui/book-card";
// import { useToast } from "@/hooks/use-toast"

// Sample book data
const books = [
  {
    id: "1",
    title: "The Ethereum Revolution",
    author: "Alex Johnson",
    coverImage:
      "https://images.pexels.com/photos/4769474/pexels-photo-4769474.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "A comprehensive guide to understanding blockchain technology and the Ethereum ecosystem. Learn about smart contracts, decentralized applications, and the future of finance.",
    usdPrice: 29.99,
    ethPrice: 0.0187,
    weiPrice: "18700000000000000",
  },
  {
    id: "2",
    title: "Web3 Development",
    author: "Maria Rodriguez",
    coverImage:
      "https://images.pexels.com/photos/7534294/pexels-photo-7534294.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Master the art of decentralized application development. This book covers everything from basic concepts to advanced techniques in Web3 development.",
    usdPrice: 34.99,
    ethPrice: 0.0219,
    weiPrice: "21900000000000000",
  },
  {
    id: "3",
    title: "Crypto Economics",
    author: "David Kim",
    coverImage:
      "https://images.pexels.com/photos/6771900/pexels-photo-6771900.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "Explore the intersection of economics and cryptocurrency. This book delves into tokenomics, market behavior, and the economic principles behind blockchain networks.",
    usdPrice: 24.99,
    ethPrice: 0.0156,
    weiPrice: "15600000000000000",
  },
  {
    id: "4",
    title: "The Art of NFTs",
    author: "Sophie Chen",
    coverImage:
      "https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg?auto=compress&cs=tinysrgb&w=800",
    description:
      "A definitive guide to non-fungible tokens. Learn about digital art, collectibles, and the transformation of ownership in the digital age.",
    usdPrice: 19.99,
    ethPrice: 0.0125,
    weiPrice: "12500000000000000",
  },
];

export function BookShowcase() {
  const [walletConnected, setWalletConnected] = useState(false);
  // const { toast } = useToast();

  const handlePurchase = (id: string) => {
    if (!walletConnected) {
      // toast({
      //   title: "Wallet not connected",
      //   description: "Please connect your wallet to make a purchase.",
      //   variant: "destructive"
      // });
      return;
    }

    const book = books.find((b) => b.id === id);
    if (book) {
      // toast({
      //   title: "Purchase initiated",
      //   description: `Processing purchase for ${book.title} at ${book.ethPrice} ETH`,
      // });
    }
  };

  const connectWallet = () => {
    // In a real app, this would connect to MetaMask or another wallet provider
    setWalletConnected(true);
    // toast({
    //   title: "Wallet connected",
    //   description: "Your wallet has been successfully connected.",
    // });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Featured Books</h2>
        {!walletConnected && (
          <Button
            onClick={connectWallet}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            Connect Wallet
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            coverImage={book.coverImage}
            description={book.description}
            usdPrice={book.usdPrice}
            ethPrice={book.ethPrice}
            weiPrice={book.weiPrice}
            onPurchase={handlePurchase}
          />
        ))}
      </div>
    </div>
  );
}

const Button = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
}) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-medium text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
