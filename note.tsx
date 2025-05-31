Okay, this is excellent! Having your smart contract's Solidity code clarifies a lot, especially the `usdToWei` function's logic and the `purchaseBook` function.

Now we can accurately integrate the purchase flow into your frontend app, specifically calculating and displaying the ETH amount needed, and then executing the transaction.

### Key Learnings from your Contract:

1.  **`usdToWei(uint256 usdCents) public view returns (uint256)`:** This function is perfect! It handles the conversion of USD cents to Wei (the smallest unit of Ether) directly on the blockchain, using the Chainlink price feed. This means your frontend doesn't need to do complex, potentially error-prone floating-point math for the conversion. We'll call this *before* making the purchase.
2.  **`purchaseBook(uint256 bookId) external payable`:** This function correctly expects Ether to be sent with the transaction (`payable`). The amount sent must be `>= bookPriceInWei` returned by `usdToWei`.
3.  **`getEthUsdPrice()`:** Returns `int256`, which is typically Chainlink's price feed value (e.g., `$3000` as `300000000000` with 8 decimals). We can use this to display an *approximate* ETH price on the frontend before calling `usdToWei` for the exact on-chain conversion.
4.  **`addBook` and `getAllBooks`:** Confirming these functions exist and are used to manage your book data.

---

### Updated Frontend Code (`src/app/page.tsx`)

I'll focus on the `Home.tsx` file, integrating the exact ETH value display and the purchase logic.

```tsx
// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt, usePublicClient } from "wagmi";
import Image from 'next/image';
import { formatEther } from 'viem'; // For converting Wei to ETH for display

// Define the Book interface (matches your contract's Book struct)
interface Book {
  id: bigint;
  usdPrice: bigint;
  stock: bigint;
  title: string;
  author: string;
  exists: boolean;
  imageUrl: string;
}

// Assuming BookCard component exists and accepts props as defined below
interface BookCardProps {
  book: Book;
  onPurchase: (bookId: bigint, usdPrice: bigint) => void;
  isLoadingPurchase: boolean;
  isWalletConnected: boolean;
  calculatedEthCost: string | null; // New prop to display calculated ETH cost
  isCalculatingEthCost: boolean; // New prop for loading state of ETH cost
}

// --- BookCard Component (src/components/BookCard.tsx) ---
// Note: This component should be in its own file: src/components/BookCard.tsx
function BookCard({
  book,
  onPurchase,
  isLoadingPurchase,
  isWalletConnected,
  calculatedEthCost,
  isCalculatingEthCost,
}: BookCardProps) {
  const displayPriceUSD = `$${(Number(book.usdPrice) / 100).toFixed(2)}`;
  const inStock = Number(book.stock) > 0;
  const isDisabled = !inStock || isLoadingPurchase || !isWalletConnected || isCalculatingEthCost;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No Image Available
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 truncate mb-1">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        <p className="text-blue-600 font-bold text-lg mb-2">{displayPriceUSD}</p>

        {/* Display calculated ETH cost */}
        <p className="text-gray-700 text-sm mb-2">
          Price in ETH: {isCalculatingEthCost ? "Calculating..." : calculatedEthCost ? `${calculatedEthCost} ETH` : "N/A"}
        </p>

        <p className={`text-sm ${inStock ? 'text-green-600' : 'text-red-600'}`}>
          Stock: {Number(book.stock)} {inStock ? 'In Stock' : 'Out of Stock'}
        </p>

        <div className="mt-auto pt-4">
          <button
            onClick={() => onPurchase(book.id, book.usdPrice)}
            disabled={isDisabled}
            className={`w-full py-2 px-4 rounded-md font-semibold transition-colors duration-200
              ${!isDisabled
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {isLoadingPurchase
              ? "Processing..."
              : isCalculatingEthCost
              ? "Calculating ETH..."
              : inStock
              ? "Purchase"
              : "Out of Stock"}
          </button>
          {!isWalletConnected && (
            <p className="text-center text-xs text-red-500 mt-2">Connect wallet to purchase</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Home Component (src/app/page.tsx) ---
export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, data: hash } = useWriteContract();
  const publicClient = usePublicClient(); // Hook to get the public client for direct contract reads

  const wagmiContractConfig = {
    address: "0x16B2a45bff334994c3C11Cb0f960e82a4D64193e" as `0x${string}`, // Ensure correct contract address
    abi: [
      // Paste your full ABI here. It MUST include:
      // - constructor (as provided)
      // - getEthUsdPrice
      // - usdToWei
      // - purchaseBook
      // - bookCount
      // - books (mapping)
      // - getAllBooks
      // - show (mapping lookup by ID)
      // - getBalance, getContractBalance, etc.
      // Your ABI provided in the prompt is complete, so paste it all here:
      {
        inputs: [
          {
            internalType: "address",
            name: "_AggregatorFeedAddress",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address",
          },
        ],
        name: "OwnableInvalidOwner",
        type: "error",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "OwnableUnauthorizedAccount",
        type: "error",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "OwnershipTransferred",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "string",
            name: "_title",
            type: "string",
          },
          {
            internalType: "string",
            name: "_author",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "_usdPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_stock",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "_imageUrl",
            type: "string",
          },
        ],
        name: "addBook",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "bookCount",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        name: "books",
        outputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "usdPrice",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "stock",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "string",
            name: "author",
            type: "string",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "string",
            name: "imageUrl",
            type: "string",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getAllBooks",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "usdPrice",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stock",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "title",
                type: "string",
              },
              {
                internalType: "string",
                name: "author",
                type: "string",
              },
              {
                internalType: "bool",
                name: "exists",
                type: "bool",
              },
              {
                internalType: "string",
                name: "imageUrl",
                type: "string",
              },
            ],
            internalType: "struct BookStore.Book[]",
            name: "",
            type: "tuple[]",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "accountAddress",
            type: "address",
          },
        ],
        name: "getBalance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getContractBalance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getEthUsdPrice",
        outputs: [
          {
            internalType: "int256",
            name: "",
            type: "int256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "bookId",
            type: "uint256",
          },
        ],
        name: "purchaseBook",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
        ],
        name: "show",
        outputs: [
          {
            components: [
              {
                internalType: "uint256",
                name: "id",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "usdPrice",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "stock",
                type: "uint256",
              },
              {
                internalType: "string",
                name: "title",
                type: "string",
              },
              {
                internalType: "string",
                name: "author",
                type: "string",
              },
              {
                internalType: "bool",
                name: "exists",
                type: "bool",
              },
              {
                internalType: "string",
                name: "imageUrl",
              },
            ],
            internalType: "struct BookStore.Book",
            name: "",
            type: "tuple",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "usdCents",
            type: "uint256",
          },
        ],
        name: "usdToWei",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
  };

  // State to hold all books fetched from the contract
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [errorLoadingBooks, setErrorLoadingBooks] = useState<string | null>(null);

  // State to hold the calculated ETH cost for each book
  // Using a Map for efficient lookup by book ID
  const [bookEthCosts, setBookEthCosts] = useState<Map<bigint, string>>(new Map());
  const [isCalculatingEthCosts, setIsCalculatingEthCosts] = useState(false);


  // Fetch all books using the 'getAllBooks' function from your contract
  const {
    data: allBooksData,
    isLoading: isLoadingAllBooks,
    error: errorAllBooks,
    refetch: refetchAllBooks,
  } = useReadContract({
    ...wagmiContractConfig,
    functionName: 'getAllBooks',
    query: {
      enabled: isConnected,
    },
  });

  // Update the 'books' state when 'allBooksData' changes
  useEffect(() => {
    if (allBooksData) {
      const validBooks = (allBooksData as Book[]).filter(book => book.exists);
      setBooks(validBooks);
    }
    if (errorAllBooks) {
      setErrorLoadingBooks("Failed to load books from contract: " + errorAllBooks.message);
      console.error("Error fetching all books:", errorAllBooks);
    }
    setLoadingBooks(isLoadingAllBooks);
  }, [allBooksData, isLoadingAllBooks, errorAllBooks]);

  // --- Calculate ETH cost for each book ---
  useEffect(() => {
    const calculateCosts = async () => {
      if (!publicClient || books.length === 0) {
        setBookEthCosts(new Map());
        return;
      }

      setIsCalculatingEthCosts(true);
      const newCosts = new Map<bigint, string>();

      try {
        // Use Promise.allSettled to allow some conversions to fail without stopping others
        const results = await Promise.allSettled(
          books.map(async (book) => {
            if (!book.exists) return null; // Skip non-existent books

            try {
              // Directly call usdToWei using publicClient.readContract
              const ethValueWei = await publicClient.readContract({
                abi: wagmiContractConfig.abi,
                address: wagmiContractConfig.address,
                functionName: 'usdToWei',
                args: [book.usdPrice],
              }) as bigint;

              // Format the Wei value to ETH for display
              return { bookId: book.id, ethCost: formatEther(ethValueWei) };
            } catch (innerErr) {
              console.warn(`Failed to calculate ETH cost for book ID ${book.id}:`, innerErr);
              return { bookId: book.id, ethCost: 'Error' }; // Indicate error for this book
            }
          })
        );

        results.forEach(result => {
          if (result.status === 'fulfilled' && result.value) {
            if (result.value.ethCost === 'Error') {
              newCosts.set(result.value.bookId, 'Error');
            } else {
              // Ensure consistent formatting (e.g., 6 decimal places)
              const formattedEth = parseFloat(result.value.ethCost).toFixed(6);
              newCosts.set(result.value.bookId, formattedEth);
            }
          }
        });

        setBookEthCosts(newCosts);
      } catch (err) {
        console.error("Error calculating all ETH costs:", err);
        // Optionally set all to error or keep previous state
      } finally {
        setIsCalculatingEthCosts(false);
      }
    };

    calculateCosts();
  }, [books, publicClient]); // Recalculate when books list or publicClient changes


  // --- Purchase Logic ---
  const handlePurchase = async (bookId: bigint, usdPriceCents: bigint) => {
    if (!isConnected || !address) {
      alert("Please connect your wallet to purchase books.");
      return;
    }

    if (!publicClient) {
      alert("Blockchain client not ready. Please try again.");
      return;
    }

    try {
      // Get the exact ETH value in Wei from the contract's usdToWei function
      const ethValueWei = await publicClient.readContract({
        abi: wagmiContractConfig.abi,
        address: wagmiContractConfig.address,
        functionName: 'usdToWei',
        args: [usdPriceCents],
      }) as bigint;

      if (!ethValueWei || ethValueWei === BigInt(0)) {
        alert("Failed to calculate exact ETH amount for purchase. Price might be zero or oracle issue.");
        return;
      }

      // Initiate the write contract call to purchase the book
      writeContract({
        ...wagmiContractConfig,
        functionName: 'purchaseBook',
        args: [bookId],
        value: ethValueWei, // The exact amount of ETH (in Wei) to send
      });
    } catch (err: any) {
      console.error("Error during purchase preparation or initiation:", err);
      alert(`Failed to prepare/initiate purchase: ${err.shortMessage || err.message || JSON.stringify(err)}`);
    }
  };

  // Monitor the status of the purchase transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Effect to handle post-purchase actions (alert and refetch)
  useEffect(() => {
    if (isConfirmed) {
      alert("Purchase successful!");
      refetchAllBooks(); // Refresh the list of books to show updated stock
    }
    if (isConfirmed === false) {
      alert("Purchase failed or was rejected.");
    }
  }, [isConfirmed, refetchAllBooks]);


  // --- Render Section ---
  return (
    <div className="min-h-screen bg-gray-100 pb-8">
      <header className="bg-blue-700 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Decentralized Book Store</h1>
          <div className="flex items-center space-x-4">
            <w3m-button />
            <w3m-network-button />
            {isConnected && address && (
              <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full">
                {address.slice(0, 6)}...{address.slice(-4)} Connected
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Available Books</h2>

        {isLoadingAllBooks || isCalculatingEthCosts ? (
          <p className="text-center text-lg text-gray-600">Loading books and calculating prices...</p>
        ) : errorLoadingBooks ? (
          <p className="text-center text-red-500 text-lg">Error: {errorLoadingBooks}</p>
        ) : books.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No books available in the store.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((bookItem) => (
              <BookCard
                key={bookItem.id.toString()}
                book={bookItem}
                onPurchase={handlePurchase}
                isLoadingPurchase={isPending || isConfirming}
                isWalletConnected={isConnected}
                calculatedEthCost={bookEthCosts.get(bookItem.id) || null}
                isCalculatingEthCost={isCalculatingEthCosts}
              />
            ))}
          </div>
        )}

        {isPending && <p className="text-center text-blue-600 mt-4">Waiting for wallet confirmation...</p>}
        {isConfirming && <p className="text-center text-blue-600 mt-4">Confirming transaction...</p>}
        {hash && (
          <p className="text-center text-gray-700 mt-4">
            Transaction Hash:{" "}
            <a href={`https://sepolia.scrollscan.com/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
              {hash}
            </a>
          </p>
        )}
      </main>
    </div>
  );
}
```

### Key Improvements and Explanation:

1.  **`usePublicClient` for `usdToWei` Calls:**
    * Instead of the potentially problematic `(window as any).wagmiClient.readContract`, we now use Wagmi's `usePublicClient` hook. This provides a safe and recommended way to perform direct read calls to the blockchain.
    * `const publicClient = usePublicClient();`
    * This `publicClient` is then used within `useEffect` to calculate all book prices and within `handlePurchase` for the specific purchase price.

2.  **`calculatedEthCost` State in `Home`:**
    * A new `bookEthCosts` state (`Map<bigint, string>`) is introduced in `Home.tsx` to store the calculated ETH price (as a formatted string) for *each* book.
    * `isCalculatingEthCosts` state is added to show a loading indicator during the calculation.

3.  **`useEffect` for Batch ETH Cost Calculation:**
    * A `useEffect` hook now runs whenever the `books` list changes.
    * Inside this effect, we loop through all `books` and use `publicClient.readContract` to call the `usdToWei` function on your smart contract for each book's `usdPrice`.
    * `Promise.allSettled` is used to efficiently run these calls in parallel and handle individual failures gracefully.
    * The results are stored in the `bookEthCosts` Map, which is then passed down to `BookCard`.
    * `formatEther` from `viem` is used to convert the `wei` value returned by `usdToWei` into a human-readable `ETH` string for display.

4.  **`BookCard` Updates:**
    * The `BookCardProps` now include `calculatedEthCost: string | null` and `isCalculatingEthCosts: boolean`.
    * The `BookCard` component displays "Calculating..." while `isCalculatingEthCosts` is true, or the formatted ETH cost when available.
    * The purchase button's `disabled` state now also considers `isCalculatingEthCosts`.

5.  **`handlePurchase` Logic Refinement:**
    * The `handlePurchase` function now also uses `publicClient.readContract` to get the `ethValueWei` right before initiating the `writeContract` call, ensuring the most up-to-date price is used for the transaction value.
    * Added more robust error messages.

This setup significantly improves the display of the ETH price for each book and ensures the purchase transaction sends the correct amount of Ether calculated by your smart contract's `usdToWei` function.