"use client"

import { useState, useEffect } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"
import figlet from "figlet"

// Import some popular fonts
import standard from "figlet/importable-fonts/Standard"
import doom from "figlet/importable-fonts/Doom"
import banner from "figlet/importable-fonts/Banner"
import slant from "figlet/importable-fonts/Slant"
import big from "figlet/importable-fonts/Big"
import small from "figlet/importable-fonts/Small"
import script from "figlet/importable-fonts/Script"
import shadow from "figlet/importable-fonts/Shadow"
import speed from "figlet/importable-fonts/Speed"
import starWars from "figlet/importable-fonts/Star Wars"

const fonts = [
  { name: "Standard", font: standard },
  { name: "Doom", font: doom },
  { name: "Banner", font: banner },
  { name: "Slant", font: slant },
  { name: "Big", font: big },
  { name: "Small", font: small },
  { name: "Script", font: script },
  { name: "Shadow", font: shadow },
  { name: "Speed", font: speed },
  { name: "Star Wars", font: starWars },
]

export default function AsciiArtPage() {
  const [text, setText] = useState("Hello")
  const [results, setResults] = useState<{ font: string; art: string }[]>([])
  const [copiedFont, setCopiedFont] = useState<string | null>(null)
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    // Load all fonts
    fonts.forEach(({ name, font }) => {
      figlet.parseFont(name, font)
    })
    setFontsLoaded(true)
  }, [])

  useEffect(() => {
    if (!fontsLoaded || !text) {
      setResults([])
      return
    }

    const newResults: { font: string; art: string }[] = []
    
    fonts.forEach(({ name }) => {
      try {
        const art = figlet.textSync(text, { font: name as figlet.Fonts })
        newResults.push({ font: name, art })
      } catch (e) {
        console.error(`Error generating ${name}:`, e)
      }
    })
    
    setResults(newResults)
  }, [text, fontsLoaded])

  const copyToClipboard = async (art: string, font: string) => {
    try {
      await navigator.clipboard.writeText(art)
      setCopiedFont(font)
      setTimeout(() => setCopiedFont(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <ToolLayout 
      title="ASCII Art Generator" 
      description="Convert text into ASCII art with multiple font styles. Preview and copy instantly."
    >
      <div className="space-y-8">
        {/* Input */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label htmlFor="text" className="text-foreground">Enter Text</Label>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your text here"
                className="bg-input border-border text-foreground text-lg"
                maxLength={20}
              />
              <p className="text-xs text-muted-foreground">
                Keep it short for best results (max 20 characters)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Preview ({results.length} styles)
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {results.map(({ font, art }) => (
              <Card key={font} className="bg-card border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
                  <span className="text-sm font-medium text-foreground">{font}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(art, font)}
                    className="h-8 px-2"
                  >
                    {copiedFont === font ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardContent className="p-4 overflow-x-auto">
                  <pre className="text-xs sm:text-sm font-mono text-foreground whitespace-pre leading-tight">
                    {art}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>

          {!text && (
            <div className="text-center py-12 text-muted-foreground">
              Enter some text above to see ASCII art previews
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
