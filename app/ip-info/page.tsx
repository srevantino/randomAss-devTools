"use client"

import { useState, useEffect } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Search,
  Loader2,
  AlertCircle,
  MapPin,
  Globe,
  Building,
  Clock,
  RefreshCw,
} from "lucide-react"

interface IpInfo {
  query: string
  status: string
  country: string
  countryCode: string
  region: string
  regionName: string
  city: string
  zip: string
  lat: number
  lon: number
  timezone: string
  isp: string
  org: string
  as: string
}

export default function IpInfoPage() {
  const [ip, setIp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<IpInfo | null>(null)
  const [isOwnIp, setIsOwnIp] = useState(false)

  // Lookup own IP on mount
  useEffect(() => {
    lookupOwnIp()
  }, [])

  const lookupOwnIp = async () => {
    setLoading(true)
    setError(null)
    setIsOwnIp(true)
    setIp("")

    try {
      const response = await fetch("http://ip-api.com/json/")
      const data: IpInfo = await response.json()

      if (data.status === "fail") {
        throw new Error("Failed to fetch IP information")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const lookupIp = async () => {
    if (!ip.trim()) {
      lookupOwnIp()
      return
    }

    setLoading(true)
    setError(null)
    setIsOwnIp(false)

    try {
      const response = await fetch(`http://ip-api.com/json/${ip.trim()}`)
      const data: IpInfo = await response.json()

      if (data.status === "fail") {
        throw new Error("Invalid IP address or lookup failed")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const openInMaps = () => {
    if (result) {
      window.open(
        `https://www.google.com/maps?q=${result.lat},${result.lon}`,
        "_blank"
      )
    }
  }

  return (
    <ToolLayout
      title="IP Info Lookup"
      description="Get detailed information about any IP address including location, ISP, and coordinates."
    >
      <div className="space-y-8">
        {/* Input */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="ip" className="text-foreground">
                IP Address
              </Label>
              <div className="flex gap-2">
                <Input
                  id="ip"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && lookupIp()}
                  placeholder="Enter IP or leave empty for your IP"
                  className="bg-input border-border text-foreground font-mono"
                />
                <Button onClick={lookupOwnIp} variant="secondary" title="Lookup my IP">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button onClick={lookupIp} disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {ip.trim() ? "Lookup IP" : "Lookup My IP"}
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
        {result && !loading && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* IP Details */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {isOwnIp ? "Your IP Address" : "IP Address"}
                    </p>
                    <p className="font-mono text-xl text-foreground">
                      {result.query}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="text-foreground">
                        {result.city}, {result.regionName}
                      </p>
                      <p className="text-foreground">
                        {result.country} ({result.countryCode})
                      </p>
                      {result.zip && (
                        <p className="text-sm text-muted-foreground">
                          ZIP: {result.zip}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">ISP / Organization</p>
                      <p className="text-foreground">{result.isp}</p>
                      {result.org && result.org !== result.isp && (
                        <p className="text-sm text-muted-foreground">{result.org}</p>
                      )}
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {result.as}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Timezone</p>
                      <p className="text-foreground">{result.timezone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Location Map</h3>
                  <Button variant="secondary" size="sm" onClick={openInMaps}>
                    Open in Maps
                  </Button>
                </div>

                <div className="aspect-video rounded-lg overflow-hidden bg-secondary/30 relative">
                  <iframe
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                      result.lon - 0.1
                    },${result.lat - 0.1},${result.lon + 0.1},${
                      result.lat + 0.1
                    }&layer=mapnik&marker=${result.lat},${result.lon}`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    title="Location map"
                  />
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Latitude
                    </p>
                    <p className="font-mono text-foreground">{result.lat}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Longitude
                    </p>
                    <p className="font-mono text-foreground">{result.lon}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
