// src/components/BookCard.tsx
import React, { useState, useEffect } from "react";
import Image from "next/image";

import { useWriteContract, useAccount, useReadContract } from "wagmi";

interface Book {
  id: bigint;
  usdPrice: bigint;
  stock: bigint;
  title: string;
  author: string;
  exists: boolean;
  imageUrl: string;
}

interface BookCardProps {
  book: Book;
  contractConfig: any;
}

export default function BookCard({ book, contractConfig }: BookCardProps) {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const [ethPrice, setEthPrice] = useState<string>("0");
  const [weiPrice, setWeiPrice] = useState<string>("0");

  const [isPurchasing, setIsPurchasing] = useState(false);

  const displayPriceUSD = `$${(Number(book.usdPrice) / 100).toFixed(2)}`;
  // const displayPriceUSD = `$${(Number(book.usdPrice) / 100).toFixed(2)}`;

  const inStock = Number(book.stock) > 0;

  // Fetch ETH price conversion
  const { data: ethUsdPrice } = useReadContract({
    ...contractConfig,
    functionName: "getEthUsdPrice",
  });

  const { data: weiAmount } = useReadContract({
    ...contractConfig,
    functionName: "usdToWei",
    args: [book.usdPrice],
  });

  useEffect(() => {
    if (ethUsdPrice && book.usdPrice) {
      const ethPrice =
        Number(book.usdPrice) / 100 / (Number(ethUsdPrice) / 1e8);
      setEthPrice(ethPrice.toFixed(6));
    }
  }, [ethUsdPrice, book.usdPrice]);

  const handlePurchase = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    if (!inStock) {
      alert("This book is out of stock");
      return;
    }

    try {
      console.log(book.id);
      console.log(weiAmount);

      await writeContract({
        ...contractConfig,
        functionName: "purchaseBook",
        args: [book.id],
        value: weiAmount,
      });
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
      {/* Book Image Section */}
      <div className="w-full md:w-1/3 flex justify-center">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={`Cover of ${book.title}`}
            width={200}
            height={300}
            className="rounded-lg object-cover"
          />
        ) : (
          <div className="w-[200px] h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>

      {/* Book Details Section */}
      <div className="flex-grow text-center md:text-left">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h2>
        <p className="text-xl text-gray-700 mb-1">
          by <span className="font-semibold">{book.author}</span>
        </p>

        <div className="mb-3">
          <p className="text-2xl font-extrabold text-blue-700">
            {displayPriceUSD}
          </p>
          <p className="text-lg text-gray-600">≈ {ethPrice} ETH</p>
        </div>

        <p className="text-gray-600 mb-4">Book ID: {book.id.toString()}</p>
        <p
          className={`text-lg font-medium ${
            inStock ? "text-green-600" : "text-red-600"
          }`}
        >
          Stock: {Number(book.stock)} {inStock ? "In Stock" : "Out of Stock"}
        </p>

        {inStock && (
          <button
            onClick={handlePurchase}
            disabled={isPurchasing}
            className={`mt-4 px-6 py-2 rounded-lg font-bold ${
              isPurchasing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isPurchasing ? "Processing..." : "Purchase with ETH"}
          </button>
        )}

        {!book.exists && (
          <p className="text-red-500 text-sm mt-2">
            Note: This book entry might not officially exist on the contract.
          </p>
        )}
      </div>
    </div>
  );
}
