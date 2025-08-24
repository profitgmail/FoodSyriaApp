'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Star } from 'lucide-react'

interface ReviewFormProps {
  orderId?: string
  reservationId?: string
  onSubmit: (review: { rating: number; comment: string }) => void
  trigger?: React.ReactNode
}

export default function ReviewForm({ orderId, reservationId, onSubmit, trigger }: ReviewFormProps) {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      alert('يرجى اختيار تقييم')
      return
    }

    if (!session?.user?.id) {
      alert('يجب تسجيل الدخول أولاً')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating,
          comment,
          orderId,
          reservationId
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onSubmit({ rating, comment })
        setRating(0)
        setComment('')
        setIsOpen(false)
        alert('تم إرسال التقييم بنجاح!')
      } else {
        alert(data.error || 'حدث خطأ أثناء إرسال التقييم')
      }
    } catch (error) {
      alert('حدث خطأ أثناء إرسال التقييم')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStars = () => {
    return (
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`p-1 rounded-full transition-colors ${
              star <= (hoverRating || rating)
                ? 'text-yellow-400'
                : 'text-gray-300 hover:text-yellow-300'
            }`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <Star className="h-6 w-6 fill-current" />
          </button>
        ))}
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            أضف تقييم
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إضافة تقييم</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium">التقييم *</Label>
            {renderStars()}
            <p className="text-sm text-gray-600 mt-1">
              {hoverRating > 0
                ? `${hoverRating} من 5 نجوم`
                : rating > 0
                ? `${rating} من 5 نجوم`
                : 'انقر على النجوم للتقييم'}
            </p>
          </div>

          <div>
            <Label htmlFor="comment" className="text-sm font-medium">
              التعليق
            </Label>
            <Textarea
              id="comment"
              placeholder="شاركنا تجربتك..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Component to display reviews
interface ReviewDisplayProps {
  reviews: Array<{
    id: string
    rating: number
    comment?: string
    createdAt: string
    user: {
      name?: string
    }
  }>
}

export function ReviewDisplay({ reviews }: ReviewDisplayProps) {
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }))

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex gap-1 mt-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {reviews.length} تقييم{reviews.length !== 1 ? 'ات' : ''}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm">{rating}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-600 w-8 text-right">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            لا توجد تقييمات بعد
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{review.user?.name || 'مستخدم'}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}