"use client"

import type { BookType } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { formatCurrency } from "@/lib/utils"

interface BookGridProps {
  books: BookType[]
  addToCart: (book: BookType) => void
}

export default function BookGrid({ books, addToCart }: BookGridProps) {
  return (
    <div className="container py-8">
      <h2 className="text-3xl font-bold tracking-tight mb-6">Available Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Card key={book.id} className="overflow-hidden flex flex-col">
            <div className="relative aspect-[2/3] w-full">
              <Image src={book.coverImage || "/placeholder.svg"} alt={book.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4 flex-grow">
              <h3 className="font-bold text-lg line-clamp-1">{book.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
              <p className="text-sm line-clamp-2 mb-2">{book.description}</p>
              <div className="flex flex-col gap-1 mt-auto">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{formatCurrency(book.priceUSD)}</span>
                  <Badge variant="outline" className="ml-2">
                    Stock: {book.stock}
                  </Badge>
                </div>
                <div className="flex flex-col text-xs text-muted-foreground">
                  <span>{book.priceETH} ETH</span>
                  <span className="font-mono">{book.priceWei} Wei</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button className="w-full" onClick={() => addToCart(book)} disabled={book.stock <= 0}>
                {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
