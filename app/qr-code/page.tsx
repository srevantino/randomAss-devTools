"use client"

import { useState, useRef, useEffect } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Copy, Check } from "lucide-react"
import QRCodeLib from "qrcode"

export default function QRCodePage() {
  const [text, setText] = useState("https://example.com")
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState("#ffffff")
  const [bgColor, setBgColor] = useState("#000000")
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current && text) {
      QRCodeLib.toCanvas(canvasRef.current, text, {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      })
    }
  }, [text, size, fgColor, bgColor])

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = "qrcode.png"
      link.href = canvasRef.current.toDataURL("image/png")
      link.click()
    }
  }

  const copyToClipboard = async () => {
    if (canvasRef.current) {
      try {
        const blob = await new Promise<Blob>((resolve) => {
          canvasRef.current!.toBlob((blob) => resolve(blob!), "image/png")
        })
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    }
  }

  const presetSizes = [128, 256, 512, 1024]

  return (
    <ToolLayout 
      title="QR Code Generator" 
      description="Generate QR codes from any URL or text. Customize size and colors."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Controls */}
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text" className="text-foreground">URL or Text</Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter URL or text"
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Size</Label>
                <div className="flex flex-wrap gap-2">
                  {presetSizes.map((s) => (
                    <Button
                      key={s}
                      variant={size === s ? "default" : "secondary"}
                      size="sm"
                      onClick={() => setSize(s)}
                      className="font-mono"
                    >
                      {s}px
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fgColor" className="text-foreground">Foreground Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="fgColor"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer bg-input border-border"
                    />
                    <Input
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="font-mono text-sm bg-input border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bgColor" className="text-foreground">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="bgColor"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer bg-input border-border"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="font-mono text-sm bg-input border-border text-foreground"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button onClick={downloadQRCode} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PNG
            </Button>
            <Button variant="secondary" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Preview */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
            <div 
              className="rounded-lg p-4 inline-block"
              style={{ backgroundColor: bgColor }}
            >
              <canvas ref={canvasRef} className="max-w-full h-auto" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground text-center max-w-xs truncate">
              {text || "Enter text to generate QR code"}
            </p>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}
