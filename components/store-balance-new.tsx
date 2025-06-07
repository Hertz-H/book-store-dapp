import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // For animations

// RefreshCw Icon component (replace with your actual icon component or SVG)
// You might use an icon library like 'react-icons' if you prefer, but
// for "without external library UI", we'll just put the SVG directly.
const RefreshCw = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M23 4v6h-6"></path>
    <path d="M21 12a9 9 0 1 1-2 7.15L23 10"></path>
  </svg>
);

const StoreBalanceCard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("N/A");
  const [usdValue, setUsdValue] = useState("1,272.66");
  const [ethAmount, setEthAmount] = useState("0.4587");
  const [weiAmount, setWeiAmount] = useState("472914...5808");

  // Function to simulate fetching new data
  const fetchData = async () => {
    // In a real app, you'd fetch data from an API or blockchain here
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        const formattedDate = now.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });
        resolve({
          usd: (Math.random() * 1000 + 500).toFixed(2),
          eth: (Math.random() * 0.5 + 0.1).toFixed(4),
          wei:
            Math.floor(Math.random() * 1000000000000000000)
              .toString()
              .substring(0, 6) +
            "..." +
            Math.floor(Math.random() * 10000)
              .toString()
              .substring(0, 4),
          updatedAt: `${formattedDate}, ${formattedTime}`,
        });
      }, 1500); // Simulate network delay
    });
  };

  const refreshBalance = async () => {
    setIsRefreshing(true);
    const data = await fetchData();
    setUsdValue(data.usd);
    setEthAmount(data.eth);
    setWeiAmount(data.wei);
    setLastUpdated(data.updatedAt);
    setIsRefreshing(false);
  };

  useEffect(() => {
    // Initial fetch when component mounts
    refreshBalance();
  }, []);

  return (
    // Replaced Card with a div directly applying styles
    <div className="max-w-md mx-auto bg-slate-500/25 backdrop-blur-md border border-slate-500/20 text-white rounded-lg shadow-lg">
      {/* Replaced CardHeader with a div */}
      <div className="flex flex-row items-center justify-between p-4 pb-2">
        {/* Replaced CardTitle with a h2 */}
        <h2 className="text-xl font-medium">Store Balance</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshBalance}
          className="text-white/80 hover:text-white p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-400"
          aria-label="Refresh Balance" // Accessibility
        >
          <RefreshCw
            className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </motion.button>
      </div>
      {/* Replaced CardContent with a div */}
      <div className="p-4 pt-0">
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="flex flex-col">
            <span className="text-sm text-white/70">USD Value</span>
            <span className="text-2xl font-bold text-green-400">
              ${usdValue}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white/70">ETH Amount</span>
            <span className="text-2xl font-bold text-blue-300">
              {ethAmount} ETH
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white/70">Wei</span>
            <span
              className="text-xs font-medium text-purple-300 truncate"
              title={weiAmount}
            >
              {weiAmount}
            </span>
          </div>
        </div>
        <div className="text-right text-xs text-white/50 mt-2">
          Last updated: {lastUpdated}
        </div>
      </div>
    </div>
  );
};

export { StoreBalanceCard };
