"use client"

import { useState, useMemo } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ExternalLink, Cpu, HardDrive, Server, Github, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface SelfHostedApp {
  name: string
  description: string
  category: string
  ramMin: number
  ramRecommended: number
  cpuCores: number
  storageMin: string
  dockerAvailable: boolean
  githubUrl: string
  websiteUrl?: string
  stars?: string
  license: string
  tags: string[]
}

const apps: SelfHostedApp[] = [
  // Media
  {
    name: "Jellyfin",
    description: "Free media server for streaming movies, TV, music, and more",
    category: "Media",
    ramMin: 2,
    ramRecommended: 4,
    cpuCores: 2,
    storageMin: "20GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/jellyfin/jellyfin",
    websiteUrl: "https://jellyfin.org",
    stars: "35k+",
    license: "GPL-2.0",
    tags: ["Streaming", "Media Server", "Transcoding"]
  },
  {
    name: "Plex",
    description: "Popular media server with apps for every platform",
    category: "Media",
    ramMin: 2,
    ramRecommended: 4,
    cpuCores: 2,
    storageMin: "20GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/plexinc/plex-media-player",
    websiteUrl: "https://plex.tv",
    license: "Proprietary",
    tags: ["Streaming", "Media Server", "Freemium"]
  },
  {
    name: "Immich",
    description: "High-performance self-hosted photo and video backup solution",
    category: "Media",
    ramMin: 4,
    ramRecommended: 8,
    cpuCores: 4,
    storageMin: "50GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/immich-app/immich",
    websiteUrl: "https://immich.app",
    stars: "50k+",
    license: "AGPL-3.0",
    tags: ["Photos", "Backup", "ML", "Google Photos Alt"]
  },
  {
    name: "Photoprism",
    description: "AI-powered photo management with face recognition",
    category: "Media",
    ramMin: 2,
    ramRecommended: 4,
    cpuCores: 2,
    storageMin: "20GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/photoprism/photoprism",
    websiteUrl: "https://photoprism.app",
    stars: "35k+",
    license: "AGPL-3.0",
    tags: ["Photos", "AI", "Face Recognition"]
  },
  // Productivity
  {
    name: "Nextcloud",
    description: "Self-hosted productivity platform (files, calendar, contacts, etc.)",
    category: "Productivity",
    ramMin: 2,
    ramRecommended: 4,
    cpuCores: 2,
    storageMin: "10GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/nextcloud/server",
    websiteUrl: "https://nextcloud.com",
    stars: "28k+",
    license: "AGPL-3.0",
    tags: ["Files", "Calendar", "Office", "Google Drive Alt"]
  },
  {
    name: "Paperless-ngx",
    description: "Document management system that transforms paper into searchable archive",
    category: "Productivity",
    ramMin: 1,
    ramRecommended: 2,
    cpuCores: 2,
    storageMin: "10GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/paperless-ngx/paperless-ngx",
    stars: "22k+",
    license: "GPL-3.0",
    tags: ["Documents", "OCR", "Archive"]
  },
  {
    name: "Outline",
    description: "Modern team knowledge base and wiki",
    category: "Productivity",
    ramMin: 1,
    ramRecommended: 2,
    cpuCores: 1,
    storageMin: "5GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/outline/outline",
    websiteUrl: "https://getoutline.com",
    stars: "28k+",
    license: "BSL-1.1",
    tags: ["Wiki", "Knowledge Base", "Notion Alt"]
  },
  {
    name: "Bookstack",
    description: "Simple, self-hosted, easy-to-use wiki platform",
    category: "Productivity",
    ramMin: 0.5,
    ramRecommended: 1,
    cpuCores: 1,
    storageMin: "5GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/BookStackApp/BookStack",
    websiteUrl: "https://bookstackapp.com",
    stars: "15k+",
    license: "MIT",
    tags: ["Wiki", "Documentation", "Simple"]
  },
  // Home Automation
  {
    name: "Home Assistant",
    description: "Open-source home automation platform",
    category: "Home Automation",
    ramMin: 1,
    ramRecommended: 2,
    cpuCores: 2,
    storageMin: "32GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/home-assistant/core",
    websiteUrl: "https://home-assistant.io",
    stars: "75k+",
    license: "Apache-2.0",
    tags: ["IoT", "Automation", "Smart Home"]
  },
  // Development
  {
    name: "Gitea",
    description: "Lightweight, self-hosted Git service",
    category: "Development",
    ramMin: 0.5,
    ramRecommended: 1,
    cpuCores: 1,
    storageMin: "10GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/go-gitea/gitea",
    websiteUrl: "https://gitea.io",
    stars: "45k+",
    license: "MIT",
    tags: ["Git", "CI/CD", "GitHub Alt"]
  },
  {
    name: "Forgejo",
    description: "Community-driven Gitea fork with enhanced features",
    category: "Development",
    ramMin: 0.5,
    ramRecommended: 1,
    cpuCores: 1,
    storageMin: "10GB+",
    dockerAvailable: true,
    githubUrl: "https://codeberg.org/forgejo/forgejo",
    websiteUrl: "https://forgejo.org",
    license: "MIT",
    tags: ["Git", "GitHub Alt", "Community"]
  },
  {
    name: "GitLab",
    description: "Complete DevOps platform with Git, CI/CD, and more",
    category: "Development",
    ramMin: 4,
    ramRecommended: 8,
    cpuCores: 4,
    storageMin: "50GB+",
    dockerAvailable: true,
    githubUrl: "https://gitlab.com/gitlab-org/gitlab",
    websiteUrl: "https://gitlab.com",
    license: "MIT (CE)",
    tags: ["Git", "CI/CD", "DevOps", "Enterprise"]
  },
  {
    name: "Drone CI",
    description: "Container-native continuous integration platform",
    category: "Development",
    ramMin: 0.5,
    ramRecommended: 1,
    cpuCores: 1,
    storageMin: "10GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/harness/drone",
    websiteUrl: "https://drone.io",
    stars: "32k+",
    license: "Apache-2.0",
    tags: ["CI/CD", "Docker", "Pipelines"]
  },
  // Communication
  {
    name: "Matrix Synapse",
    description: "Decentralized chat server (Matrix protocol)",
    category: "Communication",
    ramMin: 1,
    ramRecommended: 2,
    cpuCores: 2,
    storageMin: "20GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/matrix-org/synapse",
    websiteUrl: "https://matrix.org",
    stars: "12k+",
    license: "Apache-2.0",
    tags: ["Chat", "E2EE", "Decentralized", "Slack Alt"]
  },
  {
    name: "Mattermost",
    description: "Open-source Slack alternative for team messaging",
    category: "Communication",
    ramMin: 2,
    ramRecommended: 4,
    cpuCores: 2,
    storageMin: "20GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/mattermost/mattermost",
    websiteUrl: "https://mattermost.com",
    stars: "30k+",
    license: "AGPL-3.0",
    tags: ["Chat", "Team", "Slack Alt"]
  },
  // Monitoring
  {
    name: "Grafana",
    description: "Analytics and monitoring solution for databases",
    category: "Monitoring",
    ramMin: 0.5,
    ramRecommended: 1,
    cpuCores: 1,
    storageMin: "10GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/grafana/grafana",
    websiteUrl: "https://grafana.com",
    stars: "65k+",
    license: "AGPL-3.0",
    tags: ["Dashboards", "Metrics", "Visualization"]
  },
  {
    name: "Prometheus",
    description: "Monitoring system and time series database",
    category: "Monitoring",
    ramMin: 1,
    ramRecommended: 2,
    cpuCores: 2,
    storageMin: "20GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/prometheus/prometheus",
    websiteUrl: "https://prometheus.io",
    stars: "56k+",
    license: "Apache-2.0",
    tags: ["Metrics", "Alerting", "Time Series"]
  },
  {
    name: "Uptime Kuma",
    description: "Self-hosted monitoring tool like Uptime Robot",
    category: "Monitoring",
    ramMin: 0.25,
    ramRecommended: 0.5,
    cpuCores: 1,
    storageMin: "1GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/louislam/uptime-kuma",
    stars: "60k+",
    license: "MIT",
    tags: ["Uptime", "Status Page", "Alerts"]
  },
  // Networking
  {
    name: "Pi-hole",
    description: "Network-wide ad blocking via DNS",
    category: "Networking",
    ramMin: 0.25,
    ramRecommended: 0.5,
    cpuCores: 1,
    storageMin: "2GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/pi-hole/pi-hole",
    websiteUrl: "https://pi-hole.net",
    stars: "50k+",
    license: "EUPL-1.2",
    tags: ["Ad Blocking", "DNS", "Privacy"]
  },
  {
    name: "AdGuard Home",
    description: "Network-wide ads & trackers blocking DNS server",
    category: "Networking",
    ramMin: 0.25,
    ramRecommended: 0.5,
    cpuCores: 1,
    storageMin: "2GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/AdguardTeam/AdGuardHome",
    websiteUrl: "https://adguard.com/adguard-home.html",
    stars: "26k+",
    license: "GPL-3.0",
    tags: ["Ad Blocking", "DNS", "Privacy", "Pi-hole Alt"]
  },
  {
    name: "Nginx Proxy Manager",
    description: "Easy-to-use reverse proxy with SSL management",
    category: "Networking",
    ramMin: 0.25,
    ramRecommended: 0.5,
    cpuCores: 1,
    storageMin: "1GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/NginxProxyManager/nginx-proxy-manager",
    stars: "23k+",
    license: "MIT",
    tags: ["Reverse Proxy", "SSL", "Docker"]
  },
  {
    name: "Traefik",
    description: "Modern HTTP reverse proxy and load balancer",
    category: "Networking",
    ramMin: 0.25,
    ramRecommended: 0.5,
    cpuCores: 1,
    storageMin: "1GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/traefik/traefik",
    websiteUrl: "https://traefik.io",
    stars: "52k+",
    license: "MIT",
    tags: ["Reverse Proxy", "Load Balancer", "Docker Native"]
  },
  {
    name: "WireGuard",
    description: "Fast, modern, secure VPN tunnel",
    category: "Networking",
    ramMin: 0.1,
    ramRecommended: 0.25,
    cpuCores: 1,
    storageMin: "100MB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/WireGuard/wireguard-linux",
    websiteUrl: "https://wireguard.com",
    license: "GPL-2.0",
    tags: ["VPN", "Security", "Fast"]
  },
  {
    name: "Headscale",
    description: "Self-hosted Tailscale control server",
    category: "Networking",
    ramMin: 0.25,
    ramRecommended: 0.5,
    cpuCores: 1,
    storageMin: "1GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/juanfont/headscale",
    stars: "24k+",
    license: "BSD-3-Clause",
    tags: ["VPN", "Tailscale", "Mesh Network"]
  },
  // Security
  {
    name: "Vaultwarden",
    description: "Lightweight Bitwarden server implementation",
    category: "Security",
    ramMin: 0.1,
    ramRecommended: 0.25,
    cpuCores: 1,
    storageMin: "1GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/dani-garcia/vaultwarden",
    stars: "40k+",
    license: "AGPL-3.0",
    tags: ["Passwords", "Bitwarden", "Security"]
  },
  {
    name: "Authentik",
    description: "Open-source identity provider",
    category: "Security",
    ramMin: 2,
    ramRecommended: 4,
    cpuCores: 2,
    storageMin: "10GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/goauthentik/authentik",
    websiteUrl: "https://goauthentik.io",
    stars: "13k+",
    license: "MIT",
    tags: ["SSO", "OAuth", "LDAP", "Identity"]
  },
  // AI/ML
  {
    name: "Ollama",
    description: "Run LLMs locally with a simple API",
    category: "AI/ML",
    ramMin: 4,
    ramRecommended: 16,
    cpuCores: 4,
    storageMin: "20GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/ollama/ollama",
    websiteUrl: "https://ollama.ai",
    stars: "100k+",
    license: "MIT",
    tags: ["LLM", "AI", "Local", "API"]
  },
  {
    name: "Open WebUI",
    description: "ChatGPT-style interface for Ollama and other LLMs",
    category: "AI/ML",
    ramMin: 0.5,
    ramRecommended: 1,
    cpuCores: 1,
    storageMin: "5GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/open-webui/open-webui",
    stars: "45k+",
    license: "MIT",
    tags: ["LLM", "UI", "ChatGPT Alt"]
  },
  {
    name: "LocalAI",
    description: "OpenAI-compatible API for running LLMs locally",
    category: "AI/ML",
    ramMin: 4,
    ramRecommended: 16,
    cpuCores: 4,
    storageMin: "20GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/mudler/LocalAI",
    websiteUrl: "https://localai.io",
    stars: "25k+",
    license: "MIT",
    tags: ["LLM", "OpenAI Compatible", "API"]
  },
  // Automation
  {
    name: "n8n",
    description: "Workflow automation tool like Zapier",
    category: "Automation",
    ramMin: 0.5,
    ramRecommended: 1,
    cpuCores: 1,
    storageMin: "5GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/n8n-io/n8n",
    websiteUrl: "https://n8n.io",
    stars: "50k+",
    license: "Fair-code",
    tags: ["Workflow", "Automation", "Zapier Alt"]
  },
  {
    name: "Huginn",
    description: "Build agents that monitor and act on your behalf",
    category: "Automation",
    ramMin: 0.5,
    ramRecommended: 1,
    cpuCores: 1,
    storageMin: "5GB+",
    dockerAvailable: true,
    githubUrl: "https://github.com/huginn/huginn",
    stars: "43k+",
    license: "MIT",
    tags: ["Agents", "Automation", "IFTTT Alt"]
  }
]

const categories = ["All", "Media", "Productivity", "Development", "Communication", "Monitoring", "Networking", "Security", "AI/ML", "Automation", "Home Automation"]

export default function SelfHostedPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [maxRam, setMaxRam] = useState<number | null>(null)

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesSearch = 
        app.name.toLowerCase().includes(search.toLowerCase()) ||
        app.description.toLowerCase().includes(search.toLowerCase()) ||
        app.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      
      const matchesCategory = selectedCategory === "All" || app.category === selectedCategory
      const matchesRam = maxRam === null || app.ramRecommended <= maxRam
      
      return matchesSearch && matchesCategory && matchesRam
    })
  }, [search, selectedCategory, maxRam])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Media": return "bg-purple-500/20 text-purple-400"
      case "Productivity": return "bg-blue-500/20 text-blue-400"
      case "Development": return "bg-green-500/20 text-green-400"
      case "Communication": return "bg-pink-500/20 text-pink-400"
      case "Monitoring": return "bg-orange-500/20 text-orange-400"
      case "Networking": return "bg-cyan-500/20 text-cyan-400"
      case "Security": return "bg-red-500/20 text-red-400"
      case "AI/ML": return "bg-yellow-500/20 text-yellow-400"
      case "Automation": return "bg-indigo-500/20 text-indigo-400"
      case "Home Automation": return "bg-teal-500/20 text-teal-400"
      default: return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <ToolLayout
      title="Self-Hosted App Directory"
      description="Searchable catalog of self-hostable applications with RAM, CPU, and storage requirements."
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search apps, tags, descriptions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[160px] bg-secondary border-border">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={maxRam?.toString() || "any"} 
                  onValueChange={(v) => setMaxRam(v === "any" ? null : parseInt(v))}
                >
                  <SelectTrigger className="w-[140px] bg-secondary border-border">
                    <SelectValue placeholder="Max RAM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any RAM</SelectItem>
                    <SelectItem value="1">1 GB</SelectItem>
                    <SelectItem value="2">2 GB</SelectItem>
                    <SelectItem value="4">4 GB</SelectItem>
                    <SelectItem value="8">8 GB</SelectItem>
                    <SelectItem value="16">16 GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredApps.length} of {apps.length} applications
        </p>

        {/* Apps Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredApps.map((app) => (
            <Card key={app.name} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className={cn("mb-2", getCategoryColor(app.category))}>
                      {app.category}
                    </Badge>
                    <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                      {app.name}
                      {app.stars && (
                        <span className="flex items-center gap-0.5 text-xs text-yellow-500 font-normal">
                          <Star className="h-3 w-3 fill-current" />
                          {app.stars}
                        </span>
                      )}
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={app.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    {app.websiteUrl && (
                      <a
                        href={app.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{app.description}</p>
                
                {/* Requirements */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="flex flex-col items-center gap-1 p-2 rounded bg-secondary">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">RAM</span>
                    <span className="font-mono text-foreground">{app.ramRecommended}GB</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded bg-secondary">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">CPU</span>
                    <span className="font-mono text-foreground">{app.cpuCores} core{app.cpuCores > 1 ? "s" : ""}</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 p-2 rounded bg-secondary">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-mono text-foreground">{app.storageMin}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {app.tags.map((tag, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-border text-muted-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span>{app.license}</span>
                  {app.dockerAvailable && (
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                      Docker
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No applications match your filters.</p>
          </div>
        )}

        {/* Info */}
        <Card className="bg-secondary/50 border-border">
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-2">About Requirements</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>RAM values shown are recommended for comfortable operation</li>
              <li>Actual requirements may vary based on usage and data volume</li>
              <li>Most applications work well with Docker Compose</li>
              <li>Consider using a reverse proxy (Traefik, NPM) for external access</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}
