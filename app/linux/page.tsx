"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check, Search, ChevronDown, ChevronRight, FolderOpen, Lock, Wifi, Cpu, FileSearch, HardDrive } from "lucide-react"
import { cn } from "@/lib/utils"

interface Command {
  cmd: string
  description: string
  example?: string
  flags?: { flag: string; description: string }[]
}

interface Category {
  name: string
  icon: React.ElementType
  color: string
  commands: Command[]
}

const categories: Category[] = [
  {
    name: "File Operations",
    icon: FolderOpen,
    color: "text-blue-400",
    commands: [
      { cmd: "ls", description: "List directory contents", example: "ls -la", flags: [
        { flag: "-l", description: "Long format with details" },
        { flag: "-a", description: "Show hidden files" },
        { flag: "-h", description: "Human-readable sizes" },
        { flag: "-R", description: "Recursive listing" }
      ]},
      { cmd: "cd", description: "Change directory", example: "cd /var/log" },
      { cmd: "pwd", description: "Print working directory" },
      { cmd: "mkdir", description: "Create directory", example: "mkdir -p path/to/dir", flags: [
        { flag: "-p", description: "Create parent directories" }
      ]},
      { cmd: "rm", description: "Remove files/directories", example: "rm -rf folder/", flags: [
        { flag: "-r", description: "Recursive" },
        { flag: "-f", description: "Force without confirmation" },
        { flag: "-i", description: "Interactive, prompt before removal" }
      ]},
      { cmd: "cp", description: "Copy files/directories", example: "cp -r src/ dest/", flags: [
        { flag: "-r", description: "Recursive copy" },
        { flag: "-p", description: "Preserve attributes" }
      ]},
      { cmd: "mv", description: "Move or rename files", example: "mv old.txt new.txt" },
      { cmd: "touch", description: "Create empty file or update timestamp", example: "touch file.txt" },
      { cmd: "cat", description: "Display file contents", example: "cat file.txt" },
      { cmd: "head", description: "Show first lines of file", example: "head -n 20 file.txt" },
      { cmd: "tail", description: "Show last lines of file", example: "tail -f /var/log/syslog", flags: [
        { flag: "-f", description: "Follow file in real-time" },
        { flag: "-n", description: "Number of lines to show" }
      ]},
      { cmd: "less", description: "View file with pagination", example: "less file.txt" },
      { cmd: "ln", description: "Create links", example: "ln -s target link", flags: [
        { flag: "-s", description: "Create symbolic link" }
      ]},
      { cmd: "find", description: "Search for files", example: "find /path -name '*.txt'", flags: [
        { flag: "-name", description: "Search by name pattern" },
        { flag: "-type", description: "Filter by type (f=file, d=directory)" },
        { flag: "-mtime", description: "Modified time in days" }
      ]},
    ]
  },
  {
    name: "Permissions",
    icon: Lock,
    color: "text-amber-400",
    commands: [
      { cmd: "chmod", description: "Change file permissions", example: "chmod 755 script.sh", flags: [
        { flag: "+x", description: "Add execute permission" },
        { flag: "-R", description: "Recursive" },
        { flag: "777", description: "Full permissions (rwxrwxrwx)" },
        { flag: "644", description: "Read/write owner, read others" }
      ]},
      { cmd: "chown", description: "Change file owner", example: "chown user:group file", flags: [
        { flag: "-R", description: "Recursive" }
      ]},
      { cmd: "chgrp", description: "Change group ownership", example: "chgrp group file" },
      { cmd: "umask", description: "Set default permissions", example: "umask 022" },
      { cmd: "sudo", description: "Execute as superuser", example: "sudo apt update" },
      { cmd: "su", description: "Switch user", example: "su - username" },
    ]
  },
  {
    name: "Networking",
    icon: Wifi,
    color: "text-green-400",
    commands: [
      { cmd: "ip", description: "Show/manipulate routing & devices", example: "ip addr show", flags: [
        { flag: "addr", description: "Show IP addresses" },
        { flag: "link", description: "Show network interfaces" },
        { flag: "route", description: "Show routing table" }
      ]},
      { cmd: "ping", description: "Test network connectivity", example: "ping -c 4 google.com", flags: [
        { flag: "-c", description: "Count of packets to send" }
      ]},
      { cmd: "curl", description: "Transfer data from URL", example: "curl -O https://example.com/file", flags: [
        { flag: "-O", description: "Save with original filename" },
        { flag: "-L", description: "Follow redirects" },
        { flag: "-I", description: "Show headers only" },
        { flag: "-X", description: "Specify HTTP method" }
      ]},
      { cmd: "wget", description: "Download files", example: "wget https://example.com/file" },
      { cmd: "ss", description: "Socket statistics", example: "ss -tulpn", flags: [
        { flag: "-t", description: "TCP connections" },
        { flag: "-u", description: "UDP connections" },
        { flag: "-l", description: "Listening sockets" },
        { flag: "-p", description: "Show process using socket" }
      ]},
      { cmd: "netstat", description: "Network statistics (legacy)", example: "netstat -an" },
      { cmd: "nslookup", description: "Query DNS servers", example: "nslookup example.com" },
      { cmd: "dig", description: "DNS lookup utility", example: "dig example.com A" },
      { cmd: "traceroute", description: "Trace packet route", example: "traceroute google.com" },
      { cmd: "ssh", description: "Secure shell connection", example: "ssh user@host", flags: [
        { flag: "-p", description: "Specify port" },
        { flag: "-i", description: "Identity file (key)" }
      ]},
      { cmd: "scp", description: "Secure copy over SSH", example: "scp file user@host:/path" },
      { cmd: "rsync", description: "Remote sync files", example: "rsync -avz src/ dest/", flags: [
        { flag: "-a", description: "Archive mode" },
        { flag: "-v", description: "Verbose" },
        { flag: "-z", description: "Compress during transfer" }
      ]},
    ]
  },
  {
    name: "Processes",
    icon: Cpu,
    color: "text-purple-400",
    commands: [
      { cmd: "ps", description: "Show running processes", example: "ps aux", flags: [
        { flag: "aux", description: "All processes, detailed" },
        { flag: "-ef", description: "Full format listing" }
      ]},
      { cmd: "top", description: "Real-time process viewer", example: "top" },
      { cmd: "htop", description: "Interactive process viewer", example: "htop" },
      { cmd: "kill", description: "Terminate process", example: "kill -9 PID", flags: [
        { flag: "-9", description: "Force kill (SIGKILL)" },
        { flag: "-15", description: "Graceful termination (SIGTERM)" }
      ]},
      { cmd: "killall", description: "Kill processes by name", example: "killall nginx" },
      { cmd: "pkill", description: "Kill by pattern match", example: "pkill -f 'node server'" },
      { cmd: "bg", description: "Resume job in background", example: "bg %1" },
      { cmd: "fg", description: "Bring job to foreground", example: "fg %1" },
      { cmd: "jobs", description: "List background jobs", example: "jobs" },
      { cmd: "nohup", description: "Run immune to hangups", example: "nohup ./script.sh &" },
      { cmd: "systemctl", description: "Control systemd services", example: "systemctl status nginx", flags: [
        { flag: "start", description: "Start service" },
        { flag: "stop", description: "Stop service" },
        { flag: "restart", description: "Restart service" },
        { flag: "enable", description: "Enable at boot" }
      ]},
    ]
  },
  {
    name: "Text Processing",
    icon: FileSearch,
    color: "text-cyan-400",
    commands: [
      { cmd: "grep", description: "Search text patterns", example: "grep -r 'pattern' /path", flags: [
        { flag: "-r", description: "Recursive search" },
        { flag: "-i", description: "Case insensitive" },
        { flag: "-n", description: "Show line numbers" },
        { flag: "-v", description: "Invert match" },
        { flag: "-E", description: "Extended regex" }
      ]},
      { cmd: "sed", description: "Stream editor", example: "sed 's/old/new/g' file", flags: [
        { flag: "-i", description: "Edit file in place" },
        { flag: "s///g", description: "Substitute all occurrences" }
      ]},
      { cmd: "awk", description: "Pattern scanning and processing", example: "awk '{print $1}' file", flags: [
        { flag: "-F", description: "Field separator" },
        { flag: "NR", description: "Record/line number" },
        { flag: "NF", description: "Number of fields" }
      ]},
      { cmd: "sort", description: "Sort lines", example: "sort -n file.txt", flags: [
        { flag: "-n", description: "Numeric sort" },
        { flag: "-r", description: "Reverse order" },
        { flag: "-u", description: "Unique only" }
      ]},
      { cmd: "uniq", description: "Filter duplicate lines", example: "uniq -c file.txt", flags: [
        { flag: "-c", description: "Count occurrences" }
      ]},
      { cmd: "wc", description: "Word, line, byte count", example: "wc -l file.txt", flags: [
        { flag: "-l", description: "Line count" },
        { flag: "-w", description: "Word count" },
        { flag: "-c", description: "Byte count" }
      ]},
      { cmd: "cut", description: "Cut sections from lines", example: "cut -d',' -f1 file.csv", flags: [
        { flag: "-d", description: "Delimiter" },
        { flag: "-f", description: "Field number" }
      ]},
      { cmd: "tr", description: "Translate characters", example: "tr 'a-z' 'A-Z'" },
      { cmd: "xargs", description: "Build command lines from input", example: "find . -name '*.txt' | xargs rm" },
    ]
  },
  {
    name: "Disk & Storage",
    icon: HardDrive,
    color: "text-rose-400",
    commands: [
      { cmd: "df", description: "Disk space usage", example: "df -h", flags: [
        { flag: "-h", description: "Human-readable sizes" }
      ]},
      { cmd: "du", description: "Directory space usage", example: "du -sh /path", flags: [
        { flag: "-s", description: "Summary only" },
        { flag: "-h", description: "Human-readable" }
      ]},
      { cmd: "mount", description: "Mount filesystem", example: "mount /dev/sda1 /mnt" },
      { cmd: "umount", description: "Unmount filesystem", example: "umount /mnt" },
      { cmd: "fdisk", description: "Partition table manipulator", example: "fdisk -l" },
      { cmd: "lsblk", description: "List block devices", example: "lsblk" },
      { cmd: "tar", description: "Archive files", example: "tar -czvf archive.tar.gz dir/", flags: [
        { flag: "-c", description: "Create archive" },
        { flag: "-x", description: "Extract archive" },
        { flag: "-z", description: "Gzip compression" },
        { flag: "-v", description: "Verbose" },
        { flag: "-f", description: "Specify filename" }
      ]},
      { cmd: "gzip", description: "Compress files", example: "gzip file.txt" },
      { cmd: "gunzip", description: "Decompress files", example: "gunzip file.txt.gz" },
      { cmd: "zip", description: "Create zip archive", example: "zip -r archive.zip dir/" },
      { cmd: "unzip", description: "Extract zip archive", example: "unzip archive.zip" },
    ]
  }
]

export default function LinuxPage() {
  const [search, setSearch] = useState("")
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categories.map(c => c.name))
  const [expandedCommands, setExpandedCommands] = useState<string[]>([])
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev =>
      prev.includes(name)
        ? prev.filter(c => c !== name)
        : [...prev, name]
    )
  }

  const toggleCommand = (cmd: string) => {
    setExpandedCommands(prev =>
      prev.includes(cmd)
        ? prev.filter(c => c !== cmd)
        : [...prev, cmd]
    )
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCmd(text)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  const filteredCategories = categories.map(cat => ({
    ...cat,
    commands: cat.commands.filter(cmd =>
      cmd.cmd.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.commands.length > 0)

  return (
    <ToolLayout
      title="Linux/Bash Commands"
      description="Comprehensive cheatsheet for file operations, permissions, networking, processes, and more"
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

        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <Card key={category.name} className="border-border bg-card overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-secondary/50 transition-colors py-4"
                onClick={() => toggleCategory(category.name)}
              >
                <CardTitle className="flex items-center gap-3 text-base">
                  {expandedCategories.includes(category.name) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <category.icon className={cn("h-5 w-5", category.color)} />
                  {category.name}
                  <span className="text-xs text-muted-foreground font-normal ml-auto">
                    {category.commands.length} commands
                  </span>
                </CardTitle>
              </CardHeader>
              
              {expandedCategories.includes(category.name) && (
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {category.commands.map((command) => (
                      <div
                        key={command.cmd}
                        className="rounded-lg border border-border bg-secondary/30 overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/50 transition-colors"
                          onClick={() => command.flags && toggleCommand(command.cmd)}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {command.flags && (
                              expandedCommands.includes(command.cmd) ? (
                                <ChevronDown className="h-3 w-3 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                              )
                            )}
                            <code className="font-mono text-sm font-bold text-primary">
                              {command.cmd}
                            </code>
                            <span className="text-sm text-muted-foreground">
                              {command.description}
                            </span>
                          </div>
                          {command.example && (
                            <div className="flex items-center gap-2">
                              <code className="text-xs font-mono bg-background px-2 py-1 rounded text-foreground">
                                {command.example}
                              </code>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(command.example!)
                                }}
                                className="h-7 w-7 p-0"
                              >
                                {copiedCmd === command.example ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {command.flags && expandedCommands.includes(command.cmd) && (
                          <div className="px-3 pb-3 pt-1 border-t border-border bg-background/50">
                            <p className="text-xs text-muted-foreground mb-2">Common flags:</p>
                            <div className="grid gap-1">
                              {command.flags.map((flag) => (
                                <div key={flag.flag} className="flex items-center gap-2 text-xs">
                                  <code className="font-mono text-primary bg-secondary px-1.5 py-0.5 rounded">
                                    {flag.flag}
                                  </code>
                                  <span className="text-muted-foreground">{flag.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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
