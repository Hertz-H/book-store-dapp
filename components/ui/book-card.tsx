"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BookOpen, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface BookCardProps {
  id: string
  title: string
  author: string
  coverImage: string
  description: string
  usdPrice: number
  ethPrice: number
  weiPrice: string
  onPurchase?: (id: string) => void
}

export function BookCard({
  id,
  title,
  author,
  coverImage,
  description,
  usdPrice,
  ethPrice,
  weiPrice,
  onPurchase
}: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase(id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full flex flex-col overflow-hidden bg-card/80 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-all duration-300">
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-lg">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-primary/60" />
            <CardDescription>{author}</CardDescription>
          </div>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground line-clamp-3 text-sm">{description}</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pt-2">
          <div className="grid grid-cols-3 gap-2 w-full text-center">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">USD</span>
              <span className="font-medium text-primary">${usdPrice.toFixed(2)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">ETH</span>
              <span className="font-medium text-primary">{ethPrice.toFixed(4)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">WEI</span>
              <span className="font-medium text-primary truncate text-xs" title={weiPrice}>
                {`${weiPrice.substring(0, 6)}...`}
              </span>
            </div>
          </div>
          <Button 
            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            onClick={handlePurchase}
          >
            <ShoppingCart size={16} />
            <span>Purchase Now</span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}