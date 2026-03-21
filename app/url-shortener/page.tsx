"use client"

import { useState, useEffect } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Link2,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  History,
} from "lucide-react"

interface ShortenedUrl {
  id: string
  originalUrl: string
  shortUrl: string
  createdAt: string
}

export default function UrlShortenerPage() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<ShortenedUrl[]>([])
  const [copiedHistoryId, setCopiedHistoryId] = useState<string | null>(null)

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("urlShortenerHistory")
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse history:", e)
      }
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("urlShortenerHistory", JSON.stringify(history))
  }, [history])

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const shortenUrl = async () => {
    if (!url.trim()) {
      setError("Please enter a URL")
      return
    }

    let urlToShorten = url.trim()
    if (!urlToShorten.startsWith("http://") && !urlToShorten.startsWith("https://")) {
      urlToShorten = "https://" + urlToShorten
    }

    if (!isValidUrl(urlToShorten)) {
      setError("Please enter a valid URL")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Using TinyURL API
      const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(urlToShorten)}`
      )

      if (!response.ok) {
        throw new Error("Failed to shorten URL")
      }

      const shortUrl = await response.text()
      setResult(shortUrl)

      // Add to history
      const newEntry: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl: urlToShorten,
        shortUrl: shortUrl,
        createdAt: new Date().toISOString(),
      }
      setHistory((prev) => [newEntry, ...prev].slice(0, 20)) // Keep last 20
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, historyId?: string) => {
    try {
      await navigator.clipboard.writeText(text)
      if (historyId) {
        setCopiedHistoryId(historyId)
        setTimeout(() => setCopiedHistoryId(null), 2000)
      } else {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const deleteFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const clearHistory = () => {
    setHistory([])
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <ToolLayout
      title="URL Shortener"
      description="Shorten long URLs using TinyURL. Copy to clipboard and keep a history of shortened links."
    >
      <div className="space-y-8">
        {/* Input */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="url" className="text-foreground">
                Enter Long URL
              </Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && shortenUrl()}
                placeholder="https://example.com/very/long/url/that/needs/shortening"
                className="bg-input border-border text-foreground"
              />
            </div>

            <Button onClick={shortenUrl} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Link2 className="h-4 w-4 mr-2" />
              )}
              Shorten URL
            </Button>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Result */}
        {result && (
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Your shortened URL:
              </p>
              <div className="flex items-center gap-3">
                <code className="flex-1 font-mono text-lg text-primary break-all">
                  {result}
                </code>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => copyToClipboard(result)}
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="secondary" size="sm" asChild>
                    <a href={result} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* History */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">History</h3>
                <span className="text-sm text-muted-foreground">
                  ({history.length})
                </span>
              </div>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Clear All
                </Button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No shortened URLs yet. Start by shortening a URL above.
              </div>
            ) : (
              <div className="divide-y divide-border">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm text-primary">
                            {item.shortUrl}
                          </code>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.originalUrl}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(item.shortUrl, item.id)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedHistoryId === item.id ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-8 w-8 p-0"
                        >
                          <a
                            href={item.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteFromHistory(item.id)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}
