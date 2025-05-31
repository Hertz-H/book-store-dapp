"use client";
import { useEffect } from "react";
import React, { useState } from "react";
import {
  useReadContract,
  useWriteContract,
  useAccount,
  useWatchContractEvent,
} from "wagmi";
import BookCard from "../components/BookCard";
export default function Home() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const wagmiContractConfig = {
    address: "0x37213ea8814a994B9dD7d085c70c69c99fBA0fE2",
    abi: [
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
            name: "buyer",
            type: "address",
          },
          {
            indexed: true,
            internalType: "uint256",
            name: "bookId",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "ethPaid",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "usdPrice",
            type: "uint256",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "newStock",
            type: "uint256",
          },
        ],
        name: "BookPurchased",
        type: "event",
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
        inputs: [],
        name: "seedBooks",
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
                type: "string",
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
      {
        inputs: [],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
  };
  interface Book {
    id: bigint;
    usdPrice: bigint;
    stock: bigint;
    title: string;
    author: string;
    exists: boolean;
    imageUrl: string;
  }

  const [books, setBooks] = useState<Book[]>([]);
  const [displayedBook, setDisplayedBook] = useState<Book | null>(null);
  const [bookIdInput, setbookIdInput] = useState("");

  const bookId = bookIdInput ? BigInt(bookIdInput) : undefined;

  const {
    data: fetchedBook,
    isError: showBookError,
    refetch: showBook,
  } = useReadContract({
    ...wagmiContractConfig,
    functionName: "show",
    args: bookId != undefined ? [bookId] : undefined,
  });
  const {
    data: booksList,
    isError: getAllBooksError,
    refetch: getAllBooks,
  } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getAllBooks",
  });

  const {
    data: contractBalance,
    isError: getContractBalanceError,
    refetch: getContractBalance,
  } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getContractBalance",
  });

  const handelGetContractBalance = async () => {
    try {
      await getContractBalance();
      console.log(contractBalance);
    } catch (getContractBalanceError) {
      console.log(`error fetching address  : ${getContractBalanceError}`);
    }
  };

  const handelSeedBooks = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      await writeContract({
        ...wagmiContractConfig,
        functionName: "seedBooks",
      });
      console.log("Books seed  success:");
    } catch (error) {
      console.error("Books seed  failed:", error);
      alert("Books seed failed. Please try again.");
    }
  };

  const handelWithdrawFromContractBalance = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      await writeContract({
        ...wagmiContractConfig,
        functionName: "withdraw",
      });
    } catch (error) {
      console.error("withdraw failed:", error);
      alert("Purchase failed. Please try again.");
    }
  };
  const handelGetAllBooks = async () => {
    try {
      await getAllBooks();

      console.log(booksList);

      const formattedBooks = booksList.map((item: any) => ({
        id: BigInt(item.id),
        usdPrice: BigInt(item.usdPrice),
        stock: BigInt(item.stock),
        title: item.title,
        author: item.author,
        exists: item.exists,
        imageUrl: item.imageUrl,
      }));
      setBooks(formattedBooks);

      console.log(books);
    } catch (getAllBooksError) {
      console.log(`error fetching all books : ${getAllBooksError}`);
    }
  };

  const handelShow = async () => {
    try {
      await showBook();
      console.log(`number: ${fetchedBook.id.toString()}`);
      console.log(fetchedBook);

      setDisplayedBook(fetchedBook as Book);
      console.log(displayedBook);
    } catch (showBookError) {
      console.log(`error fetching book  : ${showBookError}`);
    }
  };
  useWatchContractEvent({
    ...wagmiContractConfig,
    eventName: "BookPurchased",
    onLogs(logs) {
      console.log("New purchase event:", logs);
      console.log("New purchase event:", logs[0]["args"]);

      const bookId = logs[0]["args"].bookId.toString();
      const ethPaid = logs[0]["args"].ethPaid.toString();
      const usdPrice = (Number(logs[0]["args"].usdPrice) / 100).toFixed(2);
      const stock = Number(logs[0]["args"].newStock);
      const bookIdNum = Number(logs[0]["args"].bookId);
      // Convert cents to dollars
      console.log(`Purchase Successful!\n
          Book ID: ${bookId}\n
          Price: ${ethPaid} wei ($${usdPrice} USD)\n
          Buyer: ${logs[0]["args"].buyer}\n
          New Stock: ${logs[0]["args"].newStock}`);
      alert(`Purchase Successful!\n
          Book ID: ${bookId}\n
          Price: ${ethPaid} wei ($${usdPrice} USD)\n
          Buyer: ${logs[0]["args"].buyer}\n
          New Stock: ${logs[0]["args"].newStock}`);

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id == bookIdNum ? { ...book, stock: stock } : book
        )
      );
      console.log("in the event after purchase");
      setPurchaseEvents((prev) => [...prev, ...logs]);
    },
  });

  return (
    <>
      <w3m-button />
      <w3m-network-button />
      <div>
        <button
          style={{
            backgroundColor: isConnected ? "green" : "red",
            color: "white",
            padding: "8px 16px",
            borderRadius: "8px",
          }}
        >
          {address} {isConnected ? "Connected" : "Not Connected"}
        </button>
      </div>
      <div>
        <input
          type="number"
          value={bookIdInput}
          onChange={(e) => setbookIdInput(e.target.value)}
          placeholder="Enter a number"
        />
        <button onClick={() => handelShow()}>Refetch</button>

        {/* <a href="" /> */}
      </div>
      <div>
        <button onClick={() => handelSeedBooks()}>seed Books</button>
      </div>
      <div>
        <button onClick={() => handelGetAllBooks()}>Get All Books</button>
      </div>
      <div>
        <button onClick={() => handelGetContractBalance()}>
          Get Contract balance in wei
        </button>
        <p className="text-center text-gray-600">{contractBalance} in wei </p>
      </div>
      <div>
        <button onClick={handelWithdrawFromContractBalance}>withdraw</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((bookItem) => (
          <BookCard
            key={bookItem.id.toString()}
            book={bookItem}
            contractConfig={wagmiContractConfig}
          />
        ))}
      </div>
    </>
  );
}
