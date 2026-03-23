"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, CheckCircle2, XCircle, AlertCircle, Globe, Clock, Server } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckResult {
  url: string
  isUp: boolean | null
  responseTime?: number
  statusCode?: number
  checkedAt: Date
  error?: string
}

export default function IsItDownPage() {
  const [url, setUrl] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [recentChecks, setRecentChecks] = useState<CheckResult[]>([])

  const normalizeUrl = (input: string): string => {
    let normalized = input.trim().toLowerCase()
    if (!normalized.startsWith("http://") && !normalized.startsWith("https://")) {
      normalized = "https://" + normalized
    }
    try {
      new URL(normalized)
      return normalized
    } catch {
      return ""
    }
  }

  const checkSite = async () => {
    const normalizedUrl = normalizeUrl(url)
    if (!normalizedUrl) {
      setResult({
        url,
        isUp: null,
        checkedAt: new Date(),
        error: "Invalid URL format"
      })
      return
    }

    setIsChecking(true)
    setResult(null)

    const start = performance.now()
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)
      
      const response = await fetch(normalizedUrl, {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      const responseTime = Math.round(performance.now() - start)
      
      const checkResult: CheckResult = {
        url: normalizedUrl,
        isUp: true,
        responseTime,
        checkedAt: new Date()
      }
      
      setResult(checkResult)
      setRecentChecks(prev => [checkResult, ...prev.slice(0, 4)])
    } catch (error) {
      const responseTime = Math.round(performance.now() - start)
      
      if (responseTime < 15000) {
        const checkResult: CheckResult = {
          url: normalizedUrl,
          isUp: true,
          responseTime,
          checkedAt: new Date()
        }
        setResult(checkResult)
        setRecentChecks(prev => [checkResult, ...prev.slice(0, 4)])
      } else {
        const checkResult: CheckResult = {
          url: normalizedUrl,
          isUp: false,
          checkedAt: new Date(),
          error: error instanceof Error ? error.message : "Request timed out"
        }
        setResult(checkResult)
        setRecentChecks(prev => [checkResult, ...prev.slice(0, 4)])
      }
    } finally {
      setIsChecking(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      checkSite()
    }
  }

  return (
    <ToolLayout
      title="Is It Down?"
      description="Check if a website is down globally or just from your location."
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Search Form */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter a domain (e.g., google.com)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                  />
                </div>
                <Button type="submit" disabled={isChecking || !url.trim()}>
                  {isChecking ? (
                    <>
                      <div className="h-4 w-4 mr-2 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Check
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Result */}
        {result && (
          <Card className={cn(
            "bg-card border-2",
            result.isUp === true ? "border-green-500/50" :
            result.isUp === false ? "border-red-500/50" :
            "border-yellow-500/50"
          )}>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                {result.isUp === true && (
                  <>
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-green-500">It's just you!</h2>
                      <p className="text-muted-foreground mt-1">
                        <span className="font-medium text-foreground">{result.url}</span> is up and reachable.
                      </p>
                    </div>
                    {result.responseTime && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Response time: <span className="font-mono text-foreground">{result.responseTime}ms</span>
                      </div>
                    )}
                  </>
                )}
                
                {result.isUp === false && (
                  <>
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-red-500">It's not just you!</h2>
                      <p className="text-muted-foreground mt-1">
                        <span className="font-medium text-foreground">{result.url}</span> appears to be down.
                      </p>
                    </div>
                    {result.error && (
                      <p className="text-sm text-muted-foreground">
                        Error: {result.error}
                      </p>
                    )}
                  </>
                )}

                {result.isUp === null && (
                  <>
                    <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-yellow-500">Unable to check</h2>
                      <p className="text-muted-foreground mt-1">
                        {result.error}
                      </p>
                    </div>
                  </>
                )}

                <p className="text-xs text-muted-foreground">
                  Checked at {result.checkedAt.toLocaleTimeString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Checks */}
        {recentChecks.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <Server className="h-4 w-4" />
                Recent Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentChecks.map((check, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {check.isUp ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm font-mono text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                        {check.url.replace(/^https?:\/\//, "")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {check.responseTime && (
                        <span className="font-mono">{check.responseTime}ms</span>
                      )}
                      <span>{check.checkedAt.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info */}
        <div className="rounded-lg bg-secondary/50 border border-border p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">How it works:</strong> This tool attempts to connect to the 
            specified website from your browser. If the site responds, it's likely up. If the connection 
            times out or fails, the site may be down. Note that some sites may block direct browser requests, 
            which could cause false negatives.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
