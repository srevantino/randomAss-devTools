"use client"

import { useState, useCallback } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Activity, Clock, CheckCircle, XCircle, Loader2, Trash2 } from "lucide-react"

interface PingResult {
  url: string
  status: "success" | "error"
  statusCode?: number
  responseTime: number
  timestamp: Date
  error?: string
}

export default function PingPage() {
  const [url, setUrl] = useState("")
  const [results, setResults] = useState<PingResult[]>([])
  const [isPinging, setIsPinging] = useState(false)
  const [pingCount, setPingCount] = useState(5)

  const normalizeUrl = (input: string): string => {
    let normalized = input.trim()
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
      normalized = "https://" + normalized
    }
    return normalized
  }

  const pingUrl = useCallback(async () => {
    if (!url.trim()) return

    setIsPinging(true)
    const normalizedUrl = normalizeUrl(url)
    const newResults: PingResult[] = []

    for (let i = 0; i < pingCount; i++) {
      const startTime = performance.now()
      
      try {
        const response = await fetch(`/api/ping?url=${encodeURIComponent(normalizedUrl)}`, {
          method: "GET",
          cache: "no-store",
        })
        
        const endTime = performance.now()
        const responseTime = Math.round(endTime - startTime)
        
        const data = await response.json()
        
        newResults.push({
          url: normalizedUrl,
          status: data.success ? "success" : "error",
          statusCode: data.statusCode,
          responseTime: data.responseTime || responseTime,
          timestamp: new Date(),
          error: data.error,
        })
      } catch (error) {
        const endTime = performance.now()
        newResults.push({
          url: normalizedUrl,
          status: "error",
          responseTime: Math.round(endTime - startTime),
          timestamp: new Date(),
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }

      setResults([...newResults])
      
      // Small delay between pings
      if (i < pingCount - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    setIsPinging(false)
  }, [url, pingCount])

  const getAverageTime = () => {
    const successResults = results.filter(r => r.status === "success")
    if (successResults.length === 0) return 0
    return Math.round(successResults.reduce((sum, r) => sum + r.responseTime, 0) / successResults.length)
  }

  const getMinTime = () => {
    const successResults = results.filter(r => r.status === "success")
    if (successResults.length === 0) return 0
    return Math.min(...successResults.map(r => r.responseTime))
  }

  const getMaxTime = () => {
    const successResults = results.filter(r => r.status === "success")
    if (successResults.length === 0) return 0
    return Math.max(...successResults.map(r => r.responseTime))
  }

  const getSuccessRate = () => {
    if (results.length === 0) return 0
    return Math.round((results.filter(r => r.status === "success").length / results.length) * 100)
  }

  const clearResults = () => {
    setResults([])
  }

  return (
    <ToolLayout
      title="Ping / Latency Checker"
      description="Check response time and latency of any URL"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Input Section */}
        <Card className="lg:col-span-1 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="h-5 w-5 text-primary" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL to Ping</Label>
              <Input
                id="url"
                placeholder="example.com or https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-secondary border-border text-foreground"
                onKeyDown={(e) => e.key === "Enter" && !isPinging && pingUrl()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="count">Number of Pings</Label>
              <div className="flex gap-2">
                {[3, 5, 10].map((count) => (
                  <Button
                    key={count}
                    variant={pingCount === count ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPingCount(count)}
                    className="flex-1"
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={pingUrl}
                disabled={!url.trim() || isPinging}
                className="flex-1"
              >
                {isPinging ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Pinging...
                  </>
                ) : (
                  "Start Ping"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={clearResults}
                disabled={results.length === 0}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="lg:col-span-2 border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Enter a URL and click Start Ping to check latency
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 rounded-lg bg-secondary">
                    <p className="text-2xl font-bold text-foreground">{getAverageTime()}ms</p>
                    <p className="text-xs text-muted-foreground">Average</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary">
                    <p className="text-2xl font-bold text-green-400">{getMinTime()}ms</p>
                    <p className="text-xs text-muted-foreground">Min</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary">
                    <p className="text-2xl font-bold text-orange-400">{getMaxTime()}ms</p>
                    <p className="text-xs text-muted-foreground">Max</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-secondary">
                    <p className="text-2xl font-bold text-primary">{getSuccessRate()}%</p>
                    <p className="text-xs text-muted-foreground">Success</p>
                  </div>
                </div>

                {/* Individual Results */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary"
                    >
                      <div className="flex items-center gap-3">
                        {result.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          Ping #{index + 1}
                        </span>
                        {result.statusCode && (
                          <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                            {result.statusCode}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className={`font-mono text-sm ${
                          result.status === "success" 
                            ? result.responseTime < 100 
                              ? "text-green-400" 
                              : result.responseTime < 300 
                                ? "text-yellow-400" 
                                : "text-orange-400"
                            : "text-destructive"
                        }`}>
                          {result.responseTime}ms
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card className="mt-6 border-border bg-card">
        <CardContent className="py-4">
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            <div>
              <p className="text-sm font-medium text-green-400">{"< 100ms"}</p>
              <p className="text-xs text-muted-foreground">Excellent</p>
            </div>
            <div>
              <p className="text-sm font-medium text-yellow-400">100-300ms</p>
              <p className="text-xs text-muted-foreground">Good</p>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-400">{"> 300ms"}</p>
              <p className="text-xs text-muted-foreground">Slow</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
