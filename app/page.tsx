"use client"

import Link from "next/link"
import { 
  QrCode, 
  Type, 
  Container, 
  Globe, 
  Wifi, 
  Link2, 
  MapPin, 
  Shield, 
  Keyboard,
  Terminal,
  ArrowRight,
  Hash,
  FileCode,
  Activity,
  Search,
  FileText,
  Image,
  Layers,
  Palette,
  TerminalSquare,
  Database,
  Network,
  Bot,
  BookOpen
} from "lucide-react"

const tools = [
  {
    name: "QR Code Generator",
    description: "Generate QR codes from any URL or text. Customize size and colors.",
    href: "/qr-code",
    icon: QrCode,
    color: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400"
  },
  {
    name: "ASCII Art Generator",
    description: "Convert text into ASCII art with multiple font styles.",
    href: "/ascii-art",
    icon: Type,
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400"
  },
  {
    name: "Docker Commands",
    description: "Interactive Docker cheatsheet organized by category.",
    href: "/docker",
    icon: Container,
    color: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-400"
  },
  {
    name: "HTTP Status Codes",
    description: "Browse all HTTP codes with descriptions and common causes.",
    href: "/http-status",
    icon: Globe,
    color: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400"
  },
  {
    name: "DNS Lookup",
    description: "Query DNS records using Cloudflare DNS over HTTPS.",
    href: "/dns-lookup",
    icon: Wifi,
    color: "from-violet-500/20 to-purple-500/20",
    iconColor: "text-violet-400"
  },
  {
    name: "URL Shortener",
    description: "Shorten URLs using TinyURL API with history tracking.",
    href: "/url-shortener",
    icon: Link2,
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400"
  },
  {
    name: "IP Info Lookup",
    description: "Get detailed information about any IP address.",
    href: "/ip-info",
    icon: MapPin,
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400"
  },
  {
    name: "SSL Checker",
    description: "Check SSL certificate validity and expiry dates.",
    href: "/ssl-checker",
    icon: Shield,
    color: "from-yellow-500/20 to-orange-500/20",
    iconColor: "text-yellow-400"
  },
  {
    name: "Typing Speed Test",
    description: "Test your typing speed with live WPM counter and accuracy.",
    href: "/typing-test",
    icon: Keyboard,
    color: "from-red-500/20 to-pink-500/20",
    iconColor: "text-red-400"
  },
  {
    name: "Hash Generator",
    description: "Generate MD5, SHA1, SHA256 hashes from any text input.",
    href: "/hash-generator",
    icon: Hash,
    color: "from-indigo-500/20 to-blue-500/20",
    iconColor: "text-indigo-400"
  },
  {
    name: "Base64 Encoder",
    description: "Encode and decode text or files to and from Base64.",
    href: "/base64",
    icon: FileCode,
    color: "from-cyan-500/20 to-teal-500/20",
    iconColor: "text-cyan-400"
  },
  {
    name: "Ping Checker",
    description: "Check response time and latency of any URL.",
    href: "/ping",
    icon: Activity,
    color: "from-lime-500/20 to-green-500/20",
    iconColor: "text-lime-400"
  },
  {
    name: "WHOIS Lookup",
    description: "Look up domain registration and ownership information.",
    href: "/whois",
    icon: Search,
    color: "from-fuchsia-500/20 to-pink-500/20",
    iconColor: "text-fuchsia-400"
  },
  {
    name: "Word Counter",
    description: "Count words, characters, sentences, and reading time.",
    href: "/word-counter",
    icon: FileText,
    color: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-400"
  },
  {
    name: "Favicon Generator",
    description: "Upload an image and generate .ico favicon files.",
    href: "/favicon",
    icon: Image,
    color: "from-rose-500/20 to-red-500/20",
    iconColor: "text-rose-400"
  },
  {
    name: "Flexbox Playground",
    description: "Visual flex container builder with live CSS output.",
    href: "/flexbox",
    icon: Layers,
    color: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-400"
  },
  {
    name: "Gradient Studio",
    description: "Multi-stop gradient builder with angle and type controls.",
    href: "/gradient",
    icon: Palette,
    color: "from-gradient-to-r from-pink-500/20 to-orange-500/20",
    iconColor: "text-pink-400"
  },
  {
    name: "Linux/Bash Commands",
    description: "Comprehensive cheatsheet for file ops, networking, and more.",
    href: "/linux",
    icon: TerminalSquare,
    color: "from-slate-500/20 to-gray-500/20",
    iconColor: "text-slate-400"
  },
  {
    name: "SQL Cheatsheet",
    description: "SELECT, JOINs, GROUP BY, window functions, and common patterns.",
    href: "/sql",
    icon: Database,
    color: "from-blue-500/20 to-indigo-500/20",
    iconColor: "text-blue-400"
  },
  {
    name: "Tailscale/Headscale",
    description: "Commands for Tailscale and self-hosted Headscale setup.",
    href: "/tailscale",
    icon: Network,
    color: "from-sky-500/20 to-cyan-500/20",
    iconColor: "text-sky-400"
  },
  {
    name: "Ollama Commands",
    description: "Pull, run, list models, create modelfiles, and API usage.",
    href: "/ollama",
    icon: Bot,
    color: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400"
  },
  {
    name: "README Generator",
    description: "Generate professional README.md files with badges and sections.",
    href: "/readme",
    icon: BookOpen,
    color: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400"
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">DevTools Hub</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Tools
              </Link>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Developer Utilities
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
            Essential Tools for
            <span className="text-primary"> Modern Developers</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            A collection of powerful utilities to streamline your development workflow. 
            QR codes, DNS lookup, SSL checking, and more — all in one place.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-secondary mb-4`}>
                    <tool.icon className={`h-6 w-6 ${tool.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                    {tool.name}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Terminal className="h-4 w-4" />
              <span>DevTools Hub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for developers, by developers
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
