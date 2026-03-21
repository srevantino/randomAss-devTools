"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check, Search, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface DockerCommand {
  command: string
  description: string
  example?: string
  flags?: { flag: string; description: string }[]
}

interface Category {
  name: string
  icon: string
  commands: DockerCommand[]
}

const dockerCommands: Category[] = [
  {
    name: "Images",
    icon: "📦",
    commands: [
      {
        command: "docker images",
        description: "List all local images",
        flags: [
          { flag: "-a", description: "Show all images (including intermediate)" },
          { flag: "-q", description: "Only show image IDs" },
          { flag: "--filter", description: "Filter output based on conditions" }
        ]
      },
      {
        command: "docker pull <image>",
        description: "Download an image from a registry",
        example: "docker pull nginx:latest"
      },
      {
        command: "docker push <image>",
        description: "Upload an image to a registry",
        example: "docker push myrepo/myimage:tag"
      },
      {
        command: "docker build -t <name> .",
        description: "Build an image from a Dockerfile",
        example: "docker build -t myapp:latest .",
        flags: [
          { flag: "-t", description: "Name and optionally tag the image" },
          { flag: "-f", description: "Specify a Dockerfile path" },
          { flag: "--no-cache", description: "Build without using cache" }
        ]
      },
      {
        command: "docker rmi <image>",
        description: "Remove one or more images",
        flags: [
          { flag: "-f", description: "Force removal" }
        ]
      },
      {
        command: "docker tag <source> <target>",
        description: "Create a tag for an image",
        example: "docker tag myapp:latest myrepo/myapp:v1.0"
      },
      {
        command: "docker history <image>",
        description: "Show the history of an image"
      },
      {
        command: "docker save -o <file> <image>",
        description: "Save image to a tar archive",
        example: "docker save -o backup.tar myapp:latest"
      },
      {
        command: "docker load -i <file>",
        description: "Load image from a tar archive",
        example: "docker load -i backup.tar"
      }
    ]
  },
  {
    name: "Containers",
    icon: "🐳",
    commands: [
      {
        command: "docker ps",
        description: "List running containers",
        flags: [
          { flag: "-a", description: "Show all containers (including stopped)" },
          { flag: "-q", description: "Only show container IDs" },
          { flag: "--filter", description: "Filter output based on conditions" }
        ]
      },
      {
        command: "docker run <image>",
        description: "Create and start a container",
        example: "docker run -d -p 80:80 nginx",
        flags: [
          { flag: "-d", description: "Run in detached mode (background)" },
          { flag: "-p", description: "Publish port (host:container)" },
          { flag: "-v", description: "Mount volume (host:container)" },
          { flag: "--name", description: "Assign a name to the container" },
          { flag: "-e", description: "Set environment variables" },
          { flag: "-it", description: "Interactive mode with TTY" },
          { flag: "--rm", description: "Remove container when it stops" }
        ]
      },
      {
        command: "docker start <container>",
        description: "Start a stopped container"
      },
      {
        command: "docker stop <container>",
        description: "Stop a running container"
      },
      {
        command: "docker restart <container>",
        description: "Restart a container"
      },
      {
        command: "docker rm <container>",
        description: "Remove a container",
        flags: [
          { flag: "-f", description: "Force remove running container" },
          { flag: "-v", description: "Remove associated volumes" }
        ]
      },
      {
        command: "docker exec -it <container> <cmd>",
        description: "Run a command in a running container",
        example: "docker exec -it mycontainer /bin/bash"
      },
      {
        command: "docker logs <container>",
        description: "View container logs",
        flags: [
          { flag: "-f", description: "Follow log output" },
          { flag: "--tail", description: "Number of lines to show" },
          { flag: "-t", description: "Show timestamps" }
        ]
      },
      {
        command: "docker inspect <container>",
        description: "View detailed container info"
      },
      {
        command: "docker cp <src> <dest>",
        description: "Copy files between container and host",
        example: "docker cp mycontainer:/app/log.txt ./log.txt"
      }
    ]
  },
  {
    name: "Volumes",
    icon: "💾",
    commands: [
      {
        command: "docker volume ls",
        description: "List all volumes"
      },
      {
        command: "docker volume create <name>",
        description: "Create a volume",
        example: "docker volume create mydata"
      },
      {
        command: "docker volume inspect <name>",
        description: "Display detailed volume info"
      },
      {
        command: "docker volume rm <name>",
        description: "Remove a volume"
      },
      {
        command: "docker volume prune",
        description: "Remove all unused volumes"
      }
    ]
  },
  {
    name: "Networks",
    icon: "🌐",
    commands: [
      {
        command: "docker network ls",
        description: "List all networks"
      },
      {
        command: "docker network create <name>",
        description: "Create a network",
        example: "docker network create mynetwork",
        flags: [
          { flag: "-d", description: "Driver to use (bridge, overlay, etc.)" }
        ]
      },
      {
        command: "docker network inspect <name>",
        description: "Display detailed network info"
      },
      {
        command: "docker network connect <network> <container>",
        description: "Connect a container to a network"
      },
      {
        command: "docker network disconnect <network> <container>",
        description: "Disconnect a container from a network"
      },
      {
        command: "docker network rm <name>",
        description: "Remove a network"
      },
      {
        command: "docker network prune",
        description: "Remove all unused networks"
      }
    ]
  },
  {
    name: "Compose",
    icon: "🎼",
    commands: [
      {
        command: "docker compose up",
        description: "Create and start containers",
        flags: [
          { flag: "-d", description: "Run in detached mode" },
          { flag: "--build", description: "Rebuild images before starting" },
          { flag: "--force-recreate", description: "Recreate containers even if unchanged" }
        ]
      },
      {
        command: "docker compose down",
        description: "Stop and remove containers, networks",
        flags: [
          { flag: "-v", description: "Remove named volumes" },
          { flag: "--rmi all", description: "Remove all images" }
        ]
      },
      {
        command: "docker compose ps",
        description: "List containers"
      },
      {
        command: "docker compose logs",
        description: "View output from containers",
        flags: [
          { flag: "-f", description: "Follow log output" }
        ]
      },
      {
        command: "docker compose build",
        description: "Build or rebuild services"
      },
      {
        command: "docker compose pull",
        description: "Pull service images"
      },
      {
        command: "docker compose exec <service> <cmd>",
        description: "Execute a command in a running container",
        example: "docker compose exec web sh"
      },
      {
        command: "docker compose restart",
        description: "Restart services"
      },
      {
        command: "docker compose config",
        description: "Validate and view the compose file"
      }
    ]
  },
  {
    name: "System",
    icon: "⚙️",
    commands: [
      {
        command: "docker system df",
        description: "Show Docker disk usage"
      },
      {
        command: "docker system prune",
        description: "Remove unused data",
        flags: [
          { flag: "-a", description: "Remove all unused images" },
          { flag: "--volumes", description: "Remove unused volumes too" }
        ]
      },
      {
        command: "docker info",
        description: "Display system-wide information"
      },
      {
        command: "docker version",
        description: "Show Docker version info"
      },
      {
        command: "docker stats",
        description: "Live stream of container resource usage"
      },
      {
        command: "docker top <container>",
        description: "Display running processes in a container"
      }
    ]
  }
]

export default function DockerPage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [expandedCommand, setExpandedCommand] = useState<string | null>(null)

  const filteredCategories = dockerCommands
    .map((category) => ({
      ...category,
      commands: category.commands.filter(
        (cmd) =>
          cmd.command.toLowerCase().includes(search.toLowerCase()) ||
          cmd.description.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        category.commands.length > 0 &&
        (!selectedCategory || category.name === selectedCategory)
    )

  const copyCommand = async (command: string) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopiedCommand(command)
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <ToolLayout
      title="Docker Command Reference"
      description="Interactive Docker cheatsheet organized by category. Search, copy, and learn what each flag does."
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-input border-border text-foreground"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "secondary"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {dockerCommands.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="mr-1.5">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Commands */}
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.name}>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span>{category.icon}</span>
                {category.name}
              </h2>
              <div className="grid gap-3">
                {category.commands.map((cmd) => (
                  <Card
                    key={cmd.command}
                    className={cn(
                      "bg-card border-border transition-all",
                      expandedCommand === cmd.command && "ring-1 ring-primary"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <code className="text-sm font-mono text-primary break-all">
                            {cmd.command}
                          </code>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {cmd.description}
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {cmd.flags && cmd.flags.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setExpandedCommand(
                                  expandedCommand === cmd.command ? null : cmd.command
                                )
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyCommand(cmd.command)}
                            className="h-8 w-8 p-0"
                          >
                            {copiedCommand === cmd.command ? (
                              <Check className="h-4 w-4 text-primary" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedCommand === cmd.command && (
                        <div className="mt-4 pt-4 border-t border-border space-y-3">
                          {cmd.example && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Example
                              </span>
                              <code className="mt-1 block text-sm font-mono text-foreground bg-secondary/50 rounded px-3 py-2">
                                {cmd.example}
                              </code>
                            </div>
                          )}
                          {cmd.flags && cmd.flags.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Flags
                              </span>
                              <div className="mt-2 space-y-2">
                                {cmd.flags.map((flag) => (
                                  <div
                                    key={flag.flag}
                                    className="flex items-start gap-3 text-sm"
                                  >
                                    <code className="font-mono text-primary shrink-0 bg-secondary/50 px-2 py-0.5 rounded">
                                      {flag.flag}
                                    </code>
                                    <span className="text-muted-foreground">
                                      {flag.description}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No commands found matching your search
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
