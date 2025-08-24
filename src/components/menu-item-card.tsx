'use client'

import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface MenuItemCardProps {
  item: {
    id: string
    name: string
    description?: string
    price: number
    category: string
    imageUrl?: string
    available: boolean
  }
  onAddToCart: (item: any) => void
}

const MenuItemCard = memo(({ item, onAddToCart }: MenuItemCardProps) => {
  const handleAddToCart = () => {
    onAddToCart(item)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="relative h-48 bg-gradient-to-r from-orange-400 to-red-500">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white text-lg font-semibold">{item.name}</span>
          </div>
        )}
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-red-500 text-white">
              غير متوفر
            </Badge>
          </div>
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl line-clamp-1">{item.name}</CardTitle>
          <Badge variant="secondary" className="whitespace-nowrap">
            {item.price.toFixed(2)} ر.س
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 text-sm">
          {item.description || 'وصف الطبق'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-xs">
            {item.category}
          </Badge>
          <Button 
            size="sm" 
            onClick={handleAddToCart}
            disabled={!item.available}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {item.available ? 'أضف للطلب' : 'غير متوفر'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
})

MenuItemCard.displayName = 'MenuItemCard'

export default MenuItemCard