"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Terminal, 
  QrCode, 
  Type, 
  Container, 
  Globe, 
  Wifi, 
  Link2, 
  MapPin, 
  Shield, 
  Keyboard,
  ChevronLeft,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const tools = [
  { name: "QR Code", href: "/qr-code", icon: QrCode },
  { name: "ASCII Art", href: "/ascii-art", icon: Type },
  { name: "Docker", href: "/docker", icon: Container },
  { name: "HTTP Status", href: "/http-status", icon: Globe },
  { name: "DNS Lookup", href: "/dns-lookup", icon: Wifi },
  { name: "URL Shortener", href: "/url-shortener", icon: Link2 },
  { name: "IP Info", href: "/ip-info", icon: MapPin },
  { name: "SSL Checker", href: "/ssl-checker", icon: Shield },
  { name: "Typing Test", href: "/typing-test", icon: Keyboard },
]

interface ToolLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function ToolLayout({ children, title, description }: ToolLayoutProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="h-4 w-4" />
                <Terminal className="h-5 w-5 text-primary" />
                <span className="hidden sm:inline text-sm font-medium">DevTools Hub</span>
              </Link>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <span className="hidden sm:block text-sm font-medium text-foreground">{title}</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <nav className="hidden lg:flex items-center gap-1">
              {tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    pathname === tool.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <tool.icon className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline">{tool.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="mx-auto max-w-7xl px-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-lg text-xs font-medium transition-colors",
                      pathname === tool.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <tool.icon className="h-5 w-5" />
                    <span>{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Page Header */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
