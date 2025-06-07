"use client"

import { RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StoreBalance() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState('1:14:29 PM')
  
  const refreshBalance = () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdated(new Date().toLocaleTimeString())
    }, 1000)
  }
  
  return (
    <Card className="max-w-md mx-auto bg-slate-500/25 backdrop-blur-md border-slate-500/20 text-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-medium">Store Balance</CardTitle>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshBalance}
          className="text-white/80 hover:text-white p-1 rounded-full"
        >
          <RefreshCw 
            className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} 
          />
        </motion.button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="flex flex-col">
            <span className="text-sm text-white/70">USD Value</span>
            <span className="text-2xl font-bold text-green-400">$1,272.66</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white/70">ETH Amount</span>
            <span className="text-2xl font-bold text-blue-300">0.4587 ETH</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white/70">Wei</span>
            <span className="text-xs font-medium text-purple-300 truncate" title="472914...5808">
              472914...5808
            </span>
          </div>
        </div>
        <div className="text-right text-xs text-white/50 mt-2">
          Last updated: {lastUpdated}
        </div>
      </CardContent>
    </Card>
  )
}