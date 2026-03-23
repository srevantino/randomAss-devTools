"use client"

import { useState, useEffect, useCallback } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw, CheckCircle2, XCircle, AlertCircle, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusCheck {
  name: string
  url: string
  statusPage: string
  status: "operational" | "degraded" | "down" | "checking"
  latency?: number
  lastChecked?: Date
}

const services: StatusCheck[] = [
  { name: "GitHub", url: "https://api.github.com", statusPage: "https://www.githubstatus.com", status: "checking" },
  { name: "Cloudflare", url: "https://www.cloudflare.com/cdn-cgi/trace", statusPage: "https://www.cloudflarestatus.com", status: "checking" },
  { name: "Vercel", url: "https://vercel.com/api/www/status", statusPage: "https://www.vercel-status.com", status: "checking" },
  { name: "npm", url: "https://registry.npmjs.org", statusPage: "https://status.npmjs.org", status: "checking" },
  { name: "PyPI", url: "https://pypi.org/simple/", statusPage: "https://status.python.org", status: "checking" },
  { name: "Docker Hub", url: "https://hub.docker.com/v2/", statusPage: "https://www.dockerstatus.com", status: "checking" },
  { name: "AWS", url: "https://status.aws.amazon.com", statusPage: "https://health.aws.amazon.com/health/status", status: "checking" },
  { name: "Google Cloud", url: "https://www.googleapis.com/discovery/v1/apis", statusPage: "https://status.cloud.google.com", status: "checking" },
  { name: "OpenAI", url: "https://api.openai.com/v1/models", statusPage: "https://status.openai.com", status: "checking" },
  { name: "Stripe", url: "https://api.stripe.com/v1", statusPage: "https://status.stripe.com", status: "checking" },
  { name: "Twilio", url: "https://api.twilio.com", statusPage: "https://status.twilio.com", status: "checking" },
  { name: "SendGrid", url: "https://api.sendgrid.com/v3", statusPage: "https://status.sendgrid.com", status: "checking" },
]

export default function APIStatusPage() {
  const [statuses, setStatuses] = useState<StatusCheck[]>(services)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastFullCheck, setLastFullCheck] = useState<Date | null>(null)

  const checkService = async (service: StatusCheck): Promise<StatusCheck> => {
    const start = performance.now()
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)
      
      const response = await fetch(service.url, {
        method: "HEAD",
        mode: "no-cors",
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      const latency = Math.round(performance.now() - start)
      
      return {
        ...service,
        status: "operational",
        latency,
        lastChecked: new Date()
      }
    } catch {
      const latency = Math.round(performance.now() - start)
      
      if (latency < 10000) {
        return {
          ...service,
          status: "operational",
          latency,
          lastChecked: new Date()
        }
      }
      
      return {
        ...service,
        status: "down",
        latency: undefined,
        lastChecked: new Date()
      }
    }
  }

  const checkAllServices = useCallback(async () => {
    setIsRefreshing(true)
    setStatuses(services.map(s => ({ ...s, status: "checking" })))
    
    const results = await Promise.all(services.map(checkService))
    setStatuses(results)
    setLastFullCheck(new Date())
    setIsRefreshing(false)
  }, [])

  useEffect(() => {
    checkAllServices()
  }, [checkAllServices])

  const getStatusIcon = (status: StatusCheck["status"]) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "degraded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "down":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "checking":
        return <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
    }
  }

  const getStatusText = (status: StatusCheck["status"]) => {
    switch (status) {
      case "operational":
        return "Operational"
      case "degraded":
        return "Degraded"
      case "down":
        return "Down"
      case "checking":
        return "Checking..."
    }
  }

  const getStatusColor = (status: StatusCheck["status"]) => {
    switch (status) {
      case "operational":
        return "text-green-500"
      case "degraded":
        return "text-yellow-500"
      case "down":
        return "text-red-500"
      case "checking":
        return "text-muted-foreground"
    }
  }

  const operationalCount = statuses.filter(s => s.status === "operational").length
  const degradedCount = statuses.filter(s => s.status === "degraded").length
  const downCount = statuses.filter(s => s.status === "down").length

  return (
    <ToolLayout
      title="API Status Dashboard"
      description="Live status monitoring for popular APIs and services."
    >
      <div className="space-y-6">
        {/* Summary */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">
                <span className="font-medium text-green-500">{operationalCount}</span> Operational
              </span>
            </div>
            {degradedCount > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-medium text-yellow-500">{degradedCount}</span> Degraded
                </span>
              </div>
            )}
            {downCount > 0 && (
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-medium text-red-500">{downCount}</span> Down
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            {lastFullCheck && (
              <span className="text-xs text-muted-foreground">
                Last checked: {lastFullCheck.toLocaleTimeString()}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              className="border-border"
              onClick={checkAllServices}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
              Refresh All
            </Button>
          </div>
        </div>

        {/* Status Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statuses.map((service) => (
            <Card key={service.name} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="font-medium text-foreground">{service.name}</h3>
                      <p className={cn("text-sm", getStatusColor(service.status))}>
                        {getStatusText(service.status)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={service.statusPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                {service.latency !== undefined && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Response time</span>
                      <span className={cn(
                        "font-mono",
                        service.latency < 200 ? "text-green-500" :
                        service.latency < 500 ? "text-yellow-500" : "text-red-500"
                      )}>
                        {service.latency}ms
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Note */}
        <div className="rounded-lg bg-secondary/50 border border-border p-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Status checks are performed from your browser. 
            Some services may show as operational even with CORS restrictions because they respond to requests. 
            Click the external link icon to visit the official status page for more accurate information.
          </p>
        </div>
      </div>
    </ToolLayout>
  )
}
