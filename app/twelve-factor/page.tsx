"use client"

import { useState, useEffect } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { RotateCcw, CheckCircle2, ExternalLink } from "lucide-react"

interface Factor {
  id: string
  number: number
  name: string
  principle: string
  description: string
  examples: string[]
  checked: boolean
}

const initialFactors: Factor[] = [
  {
    id: "codebase",
    number: 1,
    name: "Codebase",
    principle: "One codebase tracked in revision control, many deploys",
    description: "There should be exactly one codebase per app, tracked in version control like Git. Multiple deploys (staging, production) come from the same codebase.",
    examples: [
      "Single Git repository for the app",
      "Use branches/tags for different environments",
      "No copying code between deploys"
    ],
    checked: false
  },
  {
    id: "dependencies",
    number: 2,
    name: "Dependencies",
    principle: "Explicitly declare and isolate dependencies",
    description: "Never rely on implicit existence of system-wide packages. Declare all dependencies with a manifest (package.json, requirements.txt) and use isolation tools.",
    examples: [
      "package.json for Node.js",
      "requirements.txt or Pipfile for Python",
      "go.mod for Go",
      "Use virtual environments or containers"
    ],
    checked: false
  },
  {
    id: "config",
    number: 3,
    name: "Config",
    principle: "Store config in the environment",
    description: "Configuration that varies between deploys should be stored in environment variables, not in code. This includes credentials, resource handles, and per-deploy values.",
    examples: [
      "Database URLs in env vars",
      "API keys as environment variables",
      "No hardcoded config in code",
      "Use .env files for local development"
    ],
    checked: false
  },
  {
    id: "backing-services",
    number: 4,
    name: "Backing Services",
    principle: "Treat backing services as attached resources",
    description: "Databases, message queues, caches, and external services should be treated as attached resources, accessible via URL or credentials in config.",
    examples: [
      "Database connections via DATABASE_URL",
      "Redis as REDIS_URL",
      "Easy to swap local DB for managed service",
      "No distinction between local and third-party services"
    ],
    checked: false
  },
  {
    id: "build-release-run",
    number: 5,
    name: "Build, Release, Run",
    principle: "Strictly separate build and run stages",
    description: "The build stage converts code to an executable bundle. Release combines build with config. Run executes the app. These stages should be strictly separated.",
    examples: [
      "CI/CD pipelines with distinct stages",
      "Immutable releases with version IDs",
      "No code changes at runtime",
      "Docker images as build artifacts"
    ],
    checked: false
  },
  {
    id: "processes",
    number: 6,
    name: "Processes",
    principle: "Execute the app as one or more stateless processes",
    description: "Processes should be stateless and share-nothing. Any data that needs to persist must be stored in a stateful backing service like a database.",
    examples: [
      "No sticky sessions",
      "Store session data in Redis/DB",
      "Processes can be killed/restarted anytime",
      "Horizontal scaling by adding processes"
    ],
    checked: false
  },
  {
    id: "port-binding",
    number: 7,
    name: "Port Binding",
    principle: "Export services via port binding",
    description: "The app should be self-contained and export HTTP as a service by binding to a port. No runtime injection of a webserver is needed.",
    examples: [
      "Express/Next.js listening on PORT",
      "No dependency on external web server",
      "App can serve as backing service for others",
      "PORT from environment variable"
    ],
    checked: false
  },
  {
    id: "concurrency",
    number: 8,
    name: "Concurrency",
    principle: "Scale out via the process model",
    description: "Scale by running multiple processes. Different process types (web, worker, scheduler) can be scaled independently based on workload.",
    examples: [
      "Web dynos for HTTP requests",
      "Worker processes for background jobs",
      "Scale horizontally, not vertically",
      "Process managers like PM2 or systemd"
    ],
    checked: false
  },
  {
    id: "disposability",
    number: 9,
    name: "Disposability",
    principle: "Maximize robustness with fast startup and graceful shutdown",
    description: "Processes should start quickly and shut down gracefully. They should handle SIGTERM gracefully and be robust against sudden death.",
    examples: [
      "Fast boot times (seconds)",
      "Graceful shutdown on SIGTERM",
      "Jobs are reentrant (can be restarted)",
      "Return tasks to queue on shutdown"
    ],
    checked: false
  },
  {
    id: "dev-prod-parity",
    number: 10,
    name: "Dev/Prod Parity",
    principle: "Keep development, staging, and production as similar as possible",
    description: "Minimize gaps between development and production. Use the same backing services, deploy frequently, and keep the team structure consistent.",
    examples: [
      "Same database type in dev and prod",
      "Docker for consistent environments",
      "Continuous deployment",
      "Developers involved in production"
    ],
    checked: false
  },
  {
    id: "logs",
    number: 11,
    name: "Logs",
    principle: "Treat logs as event streams",
    description: "Apps should never concern themselves with routing or storage of logs. Write to stdout and let the execution environment handle aggregation.",
    examples: [
      "Write to stdout/stderr",
      "No log file management in app",
      "Use log aggregation services",
      "Structured logging (JSON)"
    ],
    checked: false
  },
  {
    id: "admin-processes",
    number: 12,
    name: "Admin Processes",
    principle: "Run admin/management tasks as one-off processes",
    description: "One-off admin processes like migrations should run in an identical environment as regular app processes, using the same codebase and config.",
    examples: [
      "Database migrations as one-off tasks",
      "Console/REPL for debugging",
      "One-off scripts in same environment",
      "Same deploy, same code, same config"
    ],
    checked: false
  }
]

export default function TwelveFactorPage() {
  const [factors, setFactors] = useState<Factor[]>(initialFactors)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("twelve-factor-checklist")
    if (saved) {
      const savedIds = JSON.parse(saved) as string[]
      setFactors(factors.map(f => ({
        ...f,
        checked: savedIds.includes(f.id)
      })))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleFactor = (id: string) => {
    const newFactors = factors.map(f => 
      f.id === id ? { ...f, checked: !f.checked } : f
    )
    setFactors(newFactors)
    
    const checkedIds = newFactors.filter(f => f.checked).map(f => f.id)
    localStorage.setItem("twelve-factor-checklist", JSON.stringify(checkedIds))
  }

  const resetChecklist = () => {
    setFactors(factors.map(f => ({ ...f, checked: false })))
    localStorage.removeItem("twelve-factor-checklist")
  }

  const checkedCount = factors.filter(f => f.checked).length
  const progress = (checkedCount / factors.length) * 100

  return (
    <ToolLayout
      title="12 Factor App Checklist"
      description="Interactive checklist based on the twelve-factor methodology for building SaaS applications."
    >
      <div className="space-y-6">
        {/* Progress */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-foreground">{checkedCount}</span>
                  <span className="text-muted-foreground">/ 12 completed</span>
                </div>
                {checkedCount === 12 && (
                  <span className="text-sm text-primary font-medium">
                    Congratulations! Your app follows all 12 factors!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://12factor.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  Learn more <ExternalLink className="h-3 w-3" />
                </a>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border"
                  onClick={resetChecklist}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Factors */}
        <div className="grid gap-4">
          {factors.map((factor) => (
            <Card 
              key={factor.id} 
              className={`bg-card border-border transition-colors ${factor.checked ? "border-primary/50" : ""}`}
            >
              <CardHeader 
                className="pb-3 cursor-pointer"
                onClick={() => setExpandedId(expandedId === factor.id ? null : factor.id)}
              >
                <div className="flex items-start gap-4">
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={factor.checked}
                      onCheckedChange={() => toggleFactor(factor.id)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-bold">
                        {factor.number}
                      </span>
                      <CardTitle className={`text-base font-semibold ${factor.checked ? "text-primary" : "text-foreground"}`}>
                        {factor.name}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {factor.principle}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              {expandedId === factor.id && (
                <CardContent className="pt-0">
                  <div className="ml-11 pl-4 border-l-2 border-border">
                    <p className="text-sm text-foreground/80 mb-4">
                      {factor.description}
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Examples:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {factor.examples.map((example, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </ToolLayout>
  )
}
