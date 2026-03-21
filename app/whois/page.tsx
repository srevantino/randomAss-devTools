"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2, AlertCircle, Globe, Calendar, Server, User } from "lucide-react"

interface WhoisData {
  domainName?: string
  registrar?: string
  registrarUrl?: string
  createdDate?: string
  updatedDate?: string
  expiryDate?: string
  nameServers?: string[]
  status?: string[]
  registrantOrg?: string
  registrantCountry?: string
  rawData?: string
}

export default function WhoisPage() {
  const [domain, setDomain] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [whoisData, setWhoisData] = useState<WhoisData | null>(null)

  const lookupWhois = async () => {
    if (!domain.trim()) return

    setLoading(true)
    setError("")
    setWhoisData(null)

    try {
      // Using a free WHOIS API
      const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0]
      const response = await fetch(`https://api.api-ninjas.com/v1/whois?domain=${cleanDomain}`, {
        headers: {
          "X-Api-Key": "demo" // Demo key for limited requests
        }
      })

      if (!response.ok) {
        // Fallback: Try alternative approach with RDAP
        const rdapResponse = await fetch(`https://rdap.org/domain/${cleanDomain}`)
        if (rdapResponse.ok) {
          const rdapData = await rdapResponse.json()
          setWhoisData({
            domainName: rdapData.ldhName || cleanDomain,
            status: rdapData.status || [],
            nameServers: rdapData.nameservers?.map((ns: { ldhName: string }) => ns.ldhName) || [],
            registrar: rdapData.entities?.find((e: { roles: string[] }) => e.roles?.includes("registrar"))?.vcardArray?.[1]?.find((v: string[]) => v[0] === "fn")?.[3],
            createdDate: rdapData.events?.find((e: { eventAction: string }) => e.eventAction === "registration")?.eventDate,
            updatedDate: rdapData.events?.find((e: { eventAction: string }) => e.eventAction === "last changed")?.eventDate,
            expiryDate: rdapData.events?.find((e: { eventAction: string }) => e.eventAction === "expiration")?.eventDate,
          })
        } else {
          throw new Error("Unable to fetch WHOIS data")
        }
      } else {
        const data = await response.json()
        setWhoisData({
          domainName: data.domain_name || cleanDomain,
          registrar: data.registrar,
          createdDate: data.creation_date,
          updatedDate: data.updated_date,
          expiryDate: data.expiration_date,
          nameServers: data.name_servers,
          status: Array.isArray(data.status) ? data.status : [data.status].filter(Boolean),
          registrantOrg: data.org,
          registrantCountry: data.country,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to lookup WHOIS data. The domain may not exist or the API may be unavailable.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A"
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    } catch {
      return dateStr
    }
  }

  return (
    <ToolLayout
      title="WHOIS Lookup"
      description="Look up domain registration and ownership information"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Globe className="h-5 w-5 text-primary" />
              Domain Lookup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter domain (e.g., example.com)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && lookupWhois()}
                className="flex-1"
              />
              <Button onClick={lookupWhois} disabled={loading || !domain.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {whoisData && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm text-foreground">Domain Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Globe className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Domain Name</p>
                      <p className="font-mono text-sm text-foreground">{whoisData.domainName || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Server className="h-4 w-4 text-primary mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Registrar</p>
                      <p className="text-sm text-foreground">{whoisData.registrar || "N/A"}</p>
                    </div>
                  </div>
                  {whoisData.registrantOrg && (
                    <div className="flex items-start gap-3">
                      <User className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="text-xs text-muted-foreground">Organization</p>
                        <p className="text-sm text-foreground">{whoisData.registrantOrg}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm text-foreground">Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-green-500 mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm text-foreground">{formatDate(whoisData.createdDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-blue-500 mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Updated</p>
                      <p className="text-sm text-foreground">{formatDate(whoisData.updatedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-orange-500 mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Expires</p>
                      <p className="text-sm text-foreground">{formatDate(whoisData.expiryDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {whoisData.nameServers && whoisData.nameServers.length > 0 && (
              <Card className="border-border bg-card md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm text-foreground">Name Servers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {whoisData.nameServers.map((ns, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-secondary rounded-full text-xs font-mono text-foreground"
                      >
                        {ns}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {whoisData.status && whoisData.status.length > 0 && (
              <Card className="border-border bg-card md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm text-foreground">Domain Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {whoisData.status.map((status, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {status.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
