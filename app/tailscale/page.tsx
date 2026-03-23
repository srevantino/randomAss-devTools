"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Search, Network, Server, Shield, Settings, Users, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface Command {
  cmd: string
  description: string
  example?: string
}

interface Section {
  name: string
  icon: React.ElementType
  color: string
  commands: Command[]
}

const tailscaleCommands: Section[] = [
  {
    name: "Basic Usage",
    icon: Network,
    color: "text-blue-400",
    commands: [
      { cmd: "tailscale up", description: "Connect to Tailscale network", example: "tailscale up --authkey=tskey-xxx" },
      { cmd: "tailscale down", description: "Disconnect from Tailscale" },
      { cmd: "tailscale status", description: "Show current status and peers" },
      { cmd: "tailscale ip", description: "Show your Tailscale IP addresses", example: "tailscale ip -4" },
      { cmd: "tailscale ping", description: "Ping another node", example: "tailscale ping myserver" },
      { cmd: "tailscale netcheck", description: "Run network connectivity check" },
      { cmd: "tailscale version", description: "Show Tailscale version" },
      { cmd: "tailscale logout", description: "Log out of Tailscale" },
      { cmd: "tailscale login", description: "Log in to Tailscale", example: "tailscale login --authkey=tskey-xxx" },
    ]
  },
  {
    name: "Network Features",
    icon: Globe,
    color: "text-green-400",
    commands: [
      { cmd: "tailscale up --exit-node=<ip>", description: "Use exit node for all traffic", example: "tailscale up --exit-node=100.100.100.100" },
      { cmd: "tailscale up --advertise-exit-node", description: "Advertise this node as exit node" },
      { cmd: "tailscale up --advertise-routes", description: "Share subnet routes", example: "tailscale up --advertise-routes=192.168.1.0/24" },
      { cmd: "tailscale up --accept-routes", description: "Accept routes from other nodes" },
      { cmd: "tailscale up --shields-up", description: "Block incoming connections" },
      { cmd: "tailscale set --auto-update", description: "Enable auto-updates" },
      { cmd: "tailscale ssh", description: "SSH to another Tailscale node", example: "tailscale ssh user@hostname" },
      { cmd: "tailscale serve", description: "Expose local service to tailnet", example: "tailscale serve https / http://localhost:3000" },
      { cmd: "tailscale funnel", description: "Expose to public internet", example: "tailscale funnel 443 on" },
    ]
  },
  {
    name: "File & Cert",
    icon: Shield,
    color: "text-amber-400",
    commands: [
      { cmd: "tailscale file cp", description: "Send file to another node", example: "tailscale file cp file.txt hostname:" },
      { cmd: "tailscale file get", description: "Receive pending files", example: "tailscale file get ." },
      { cmd: "tailscale cert", description: "Get HTTPS certificate", example: "tailscale cert myhost.tail-scale.ts.net" },
      { cmd: "tailscale whois", description: "Show info about IP", example: "tailscale whois 100.100.100.100" },
      { cmd: "tailscale bugreport", description: "Generate debug report" },
      { cmd: "tailscale debug", description: "Debug commands", example: "tailscale debug metrics" },
    ]
  }
]

const headscaleCommands: Section[] = [
  {
    name: "Server Setup",
    icon: Server,
    color: "text-purple-400",
    commands: [
      { cmd: "headscale serve", description: "Start Headscale server" },
      { cmd: "headscale version", description: "Show version" },
      { cmd: "headscale configtest", description: "Validate configuration" },
      { cmd: "headscale generate private-key", description: "Generate new private key" },
    ]
  },
  {
    name: "User Management",
    icon: Users,
    color: "text-cyan-400",
    commands: [
      { cmd: "headscale users list", description: "List all users" },
      { cmd: "headscale users create", description: "Create new user", example: "headscale users create myuser" },
      { cmd: "headscale users destroy", description: "Delete a user", example: "headscale users destroy myuser" },
      { cmd: "headscale users rename", description: "Rename user", example: "headscale users rename oldname newname" },
    ]
  },
  {
    name: "Node Management",
    icon: Network,
    color: "text-rose-400",
    commands: [
      { cmd: "headscale nodes list", description: "List all nodes" },
      { cmd: "headscale nodes register", description: "Register new node", example: "headscale nodes register --user myuser --key nodekey:xxx" },
      { cmd: "headscale nodes delete", description: "Delete a node", example: "headscale nodes delete -i 1" },
      { cmd: "headscale nodes expire", description: "Expire node key", example: "headscale nodes expire -i 1" },
      { cmd: "headscale nodes rename", description: "Rename node", example: "headscale nodes rename -i 1 newname" },
      { cmd: "headscale nodes move", description: "Move node to user", example: "headscale nodes move -i 1 -u newuser" },
      { cmd: "headscale nodes routes list", description: "List node routes", example: "headscale nodes routes list -i 1" },
      { cmd: "headscale nodes routes enable", description: "Enable route", example: "headscale nodes routes enable -r 1" },
      { cmd: "headscale nodes tags", description: "Manage node tags", example: "headscale nodes tags add -i 1 -t tag:server" },
    ]
  },
  {
    name: "Pre-Auth Keys",
    icon: Shield,
    color: "text-orange-400",
    commands: [
      { cmd: "headscale preauthkeys list", description: "List pre-auth keys", example: "headscale preauthkeys list --user myuser" },
      { cmd: "headscale preauthkeys create", description: "Create pre-auth key", example: "headscale preauthkeys create --user myuser --reusable --expiration 24h" },
      { cmd: "headscale preauthkeys expire", description: "Expire a key", example: "headscale preauthkeys expire --user myuser KEY" },
    ]
  },
  {
    name: "API Keys",
    icon: Settings,
    color: "text-indigo-400",
    commands: [
      { cmd: "headscale apikeys list", description: "List API keys" },
      { cmd: "headscale apikeys create", description: "Create API key", example: "headscale apikeys create --expiration 90d" },
      { cmd: "headscale apikeys expire", description: "Expire API key", example: "headscale apikeys expire --prefix abc" },
    ]
  }
]

export default function TailscalePage() {
  const [search, setSearch] = useState("")
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCmd(text)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  const filterCommands = (commands: Command[]) => {
    if (!search) return commands
    return commands.filter(cmd =>
      cmd.cmd.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
    )
  }

  const renderSection = (section: Section) => {
    const filtered = filterCommands(section.commands)
    if (filtered.length === 0) return null

    return (
      <Card key={section.name} className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm">
            <section.icon className={cn("h-4 w-4", section.color)} />
            {section.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filtered.map((command) => (
            <div
              key={command.cmd}
              className="flex items-start justify-between gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="flex-1 min-w-0">
                <code className="font-mono text-xs text-primary block truncate">
                  {command.example || command.cmd}
                </code>
                <p className="text-xs text-muted-foreground mt-1">{command.description}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(command.example || command.cmd)}
                className="h-7 w-7 p-0 shrink-0"
              >
                {copiedCmd === (command.example || command.cmd) ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <ToolLayout
      title="Tailscale/Headscale Commands"
      description="Commands for Tailscale and self-hosted Headscale setup"
    >
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="tailscale">
          <TabsList className="bg-secondary">
            <TabsTrigger value="tailscale" className="flex items-center gap-2">
              <Network className="h-4 w-4 text-blue-400" />
              Tailscale
            </TabsTrigger>
            <TabsTrigger value="headscale" className="flex items-center gap-2">
              <Server className="h-4 w-4 text-purple-400" />
              Headscale
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tailscale" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tailscaleCommands.map(renderSection)}
            </div>
          </TabsContent>

          <TabsContent value="headscale" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {headscaleCommands.map(renderSection)}
            </div>
            
            <Card className="mt-6 border-border bg-card/50">
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground mb-3">Headscale Config Example</h3>
                <pre className="text-xs font-mono bg-secondary p-4 rounded-lg overflow-x-auto text-muted-foreground">
{`# /etc/headscale/config.yaml
server_url: https://headscale.example.com
listen_addr: 0.0.0.0:8080
metrics_listen_addr: 127.0.0.1:9090
private_key_path: /var/lib/headscale/private.key
noise:
  private_key_path: /var/lib/headscale/noise_private.key
ip_prefixes:
  - 100.64.0.0/10
dns_config:
  override_local_dns: true
  nameservers:
    - 1.1.1.1
  magic_dns: true
  base_domain: tail.example.com`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  )
}
