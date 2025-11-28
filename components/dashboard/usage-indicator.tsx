'use client'

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type UsageIndicatorProps = {
    type: 'artworks' | 'artists' | 'exhibitions'
    count: number
    limit: number
    label: string
}

export function UsageIndicator({ type, count, limit, label }: UsageIndicatorProps) {
    const isUnlimited = limit === Infinity
    const percentage = isUnlimited ? 0 : Math.min((count / limit) * 100, 100)
    const isNearLimit = !isUnlimited && percentage >= 80

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span>{label}</span>
                <span className="text-muted-foreground">
                    {count} / {isUnlimited ? '∞' : limit}
                </span>
            </div>
            {!isUnlimited && <Progress value={percentage} className={isNearLimit ? "bg-red-100 [&>div]:bg-red-500" : ""} />}
        </div>
    )
}

export function UpgradePrompt() {
    return (
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-900">Upgrade to Pro</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-indigo-700 mb-4">
                    Unlock unlimited artworks, artists, and exhibitions. Plus, get access to private viewing rooms and more.
                </p>
                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Link href="/dashboard/settings">Upgrade Now</Link>
                </Button>
            </CardContent>
        </Card>
    )
}
