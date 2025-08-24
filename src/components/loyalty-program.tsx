'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Gift, Star, Trophy, TrendingUp } from 'lucide-react'

interface LoyaltyProgramProps {
  userId?: string
}

interface LoyaltyReward {
  id: string
  points: number
  type: 'EARNED' | 'REDEEMED' | 'BONUS'
  description: string
  createdAt: string
}

const REWARD_TIERS = [
  { name: 'برونزي', minPoints: 0, maxPoints: 99, color: 'bg-orange-400', icon: '🥉' },
  { name: 'فضي', minPoints: 100, maxPoints: 299, color: 'bg-gray-400', icon: '🥈' },
  { name: 'ذهبي', minPoints: 300, maxPoints: 599, color: 'bg-yellow-400', icon: '🥇' },
  { name: 'بلاتيني', minPoints: 600, maxPoints: 999, color: 'bg-purple-400', icon: '💎' },
  { name: 'الماسي', minPoints: 1000, maxPoints: Infinity, color: 'bg-blue-400', icon: '👑' }
]

const REWARDS = [
  { points: 50, name: 'خصم 5%', description: 'خصم 5% على طلبك القادم' },
  { points: 100, name: 'مشروب مجاني', description: 'مشروب مجاني مع وجبتك' },
  { points: 200, name: 'حلوى مجانية', description: 'حلوى مجانية مع طلبك' },
  { points: 300, name: 'خصم 15%', description: 'خصم 15% على طلبك القادم' },
  { points: 500, name: 'وجبة مجانية', description: 'وجبة رئيسية مجانية' }
]

export default function LoyaltyProgram({ userId }: LoyaltyProgramProps) {
  const { data: session } = useSession()
  const [loyaltyPoints, setLoyaltyPoints] = useState(0)
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>([])
  const [loading, setLoading] = useState(true)

  const currentTier = REWARD_TIERS.find(tier => 
    loyaltyPoints >= tier.minPoints && loyaltyPoints <= tier.maxPoints
  ) || REWARD_TIERS[0]

  const nextTier = REWARD_TIERS.find(tier => tier.minPoints > loyaltyPoints)
  const progressToNext = nextTier ? 
    ((loyaltyPoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100 : 100

  useEffect(() => {
    if (session?.user?.id) {
      fetchLoyaltyData()
    }
  }, [session])

  const fetchLoyaltyData = async () => {
    try {
      const response = await fetch('/api/loyalty')
      const data = await response.json()
      if (response.ok) {
        setLoyaltyPoints(data.points)
        setLoyaltyRewards(data.rewards)
      }
    } catch (error) {
      console.error('Error fetching loyalty data:', error)
    } finally {
      setLoading(false)
    }
  }

  const redeemReward = async (rewardPoints: number, rewardName: string) => {
    if (loyaltyPoints < rewardPoints) {
      alert('نقاط الولاء غير كافية')
      return
    }

    try {
      const response = await fetch('/api/loyalty/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          points: rewardPoints,
          description: `استبدال: ${rewardName}`
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(`تم استبدال ${rewardName} بنجاح!`)
        fetchLoyaltyData()
      } else {
        alert(data.error || 'حدث خطأ أثناء استبدال المكافأة')
      }
    } catch (error) {
      alert('حدث خطأ أثناء استبدال المكافأة')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            برنامج الولاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل بيانات الولاء...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Tier */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            مستواك الحالي
          </CardTitle>
          <CardDescription>
            برنامج ولاء مطعم سوريا
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${currentTier.color} rounded-full flex items-center justify-center text-2xl`}>
                {currentTier.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{currentTier.name}</h3>
                <p className="text-sm text-gray-600">{loyaltyPoints} نقطة</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg">
              {loyaltyPoints} نقطة
            </Badge>
          </div>

          {nextTier && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>التقدم للمستوى التالي</span>
                <span>{nextTier.minPoints - loyaltyPoints} نقطة متبقية</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>{currentTier.name}</span>
                <span>{nextTier.name}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            المكافآت المتاحة
          </CardTitle>
          <CardDescription>
            استبدل نقاط الولاء بمكافآت حصرية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REWARDS.map((reward) => (
              <Card key={reward.points} className="border-2 border-dashed border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{reward.name}</span>
                    </div>
                    <Badge variant="outline">{reward.points} نقطة</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                  <Button
                    size="sm"
                    onClick={() => redeemReward(reward.points, reward.name)}
                    disabled={loyaltyPoints < reward.points}
                    className="w-full"
                  >
                    {loyaltyPoints >= reward.points ? 'استبدال الآن' : `${reward.points - loyaltyPoints} نقطة متبقية`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            النشاط الأخير
          </CardTitle>
          <CardDescription>
            آخر 5 عمليات في حساب الولاء
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loyaltyRewards.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              لا يوجد نشاط في حساب الولاء
            </div>
          ) : (
            <div className="space-y-3">
              {loyaltyRewards.slice(0, 5).map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      reward.type === 'EARNED' ? 'bg-green-100 text-green-600' :
                      reward.type === 'REDEEMED' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {reward.type === 'EARNED' ? '+' : reward.type === 'REDEEMED' ? '-' : '★'}
                    </div>
                    <div>
                      <p className="font-medium">{reward.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(reward.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  <Badge variant={
                    reward.type === 'EARNED' ? 'default' :
                    reward.type === 'REDEEMED' ? 'destructive' : 'secondary'
                  }>
                    {reward.type === 'EARNED' ? `+${reward.points}` : 
                     reward.type === 'REDEEMED' ? `-${reward.points}` : 
                     `${reward.points}`}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}