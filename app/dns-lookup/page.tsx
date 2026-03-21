"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Loader2, AlertCircle, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const recordTypes = [
  { type: "A", description: "IPv4 address" },
  { type: "AAAA", description: "IPv6 address" },
  { type: "MX", description: "Mail exchange" },
  { type: "TXT", description: "Text records" },
  { type: "CNAME", description: "Canonical name" },
  { type: "NS", description: "Name servers" },
  { type: "SOA", description: "Start of authority" },
  { type: "PTR", description: "Pointer record" },
]

interface DnsAnswer {
  name: string
  type: number
  TTL: number
  data: string
}

interface DnsResponse {
  Status: number
  Answer?: DnsAnswer[]
  Authority?: DnsAnswer[]
  Question?: { name: string; type: number }[]
}

export default function DnsLookupPage() {
  const [domain, setDomain] = useState("")
  const [recordType, setRecordType] = useState("A")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<DnsAnswer[] | null>(null)
  const [copiedValue, setCopiedValue] = useState<string | null>(null)

  const lookupDns = async () => {
    if (!domain.trim()) {
      setError("Please enter a domain name")
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(
          domain.trim()
        )}&type=${recordType}`,
        {
          headers: {
            Accept: "application/dns-json",
          },
        }
      )

      if (!response.ok) {
        throw new Error("DNS query failed")
      }

      const data: DnsResponse = await response.json()

      if (data.Status !== 0) {
        const statusMessages: Record<number, string> = {
          1: "Format error - The name server was unable to interpret the query",
          2: "Server failure - The name server was unable to process this query",
          3: "Name error - The domain name does not exist",
          4: "Not implemented - The name server does not support the requested kind of query",
          5: "Refused - The name server refuses to perform the specified operation",
        }
        throw new Error(statusMessages[data.Status] || "DNS query failed")
      }

      if (!data.Answer || data.Answer.length === 0) {
        setError(`No ${recordType} records found for ${domain}`)
      } else {
        setResults(data.Answer)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedValue(value)
      setTimeout(() => setCopiedValue(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const getRecordTypeName = (type: number): string => {
    const types: Record<number, string> = {
      1: "A",
      2: "NS",
      5: "CNAME",
      6: "SOA",
      12: "PTR",
      15: "MX",
      16: "TXT",
      28: "AAAA",
    }
    return types[type] || type.toString()
  }

  return (
    <ToolLayout
      title="DNS Lookup Tool"
      description="Query DNS records using Cloudflare DNS over HTTPS (1.1.1.1). Supports A, AAAA, MX, TXT, CNAME, and more."
    >
      <div className="space-y-8">
        {/* Input */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-foreground">
                Domain Name
              </Label>
              <Input
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookupDns()}
                placeholder="example.com"
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Record Type</Label>
              <div className="flex flex-wrap gap-2">
                {recordTypes.map(({ type, description }) => (
                  <Button
                    key={type}
                    variant={recordType === type ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setRecordType(type)}
                    title={description}
                    className="font-mono"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={lookupDns} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              Lookup DNS
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

        {/* Results */}
        {results && results.length > 0 && (
          <Card className="bg-card border-border">
            <CardContent className="p-0">
              <div className="px-4 py-3 border-b border-border bg-secondary/30">
                <h3 className="font-semibold text-foreground">
                  Results for {domain}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Found {results.length} {recordType} record
                  {results.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/20">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Value
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        TTL
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Copy
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((record, index) => (
                      <tr
                        key={index}
                        className={cn(
                          "border-b border-border last:border-0",
                          index % 2 === 0 ? "bg-transparent" : "bg-secondary/10"
                        )}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-primary">
                            {getRecordTypeName(record.type)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-foreground">
                            {record.name}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-foreground break-all">
                            {record.data}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-muted-foreground">
                            {record.TTL}s
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(record.data)}
                            className="h-8 w-8 p-0"
                          >
                            {copiedValue === record.data ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Record Type Reference
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recordTypes.map(({ type, description }) => (
                <div
                  key={type}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                >
                  <span className="font-mono text-sm font-bold text-primary">
                    {type}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {description}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}
