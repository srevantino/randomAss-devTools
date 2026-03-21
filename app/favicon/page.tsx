"use client"

import { useState, useRef } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, Image as ImageIcon, X, Loader2 } from "lucide-react"

interface GeneratedFavicon {
  size: number
  dataUrl: string
}

export default function FaviconPage() {
  const [image, setImage] = useState<string | null>(null)
  const [imageName, setImageName] = useState("")
  const [favicons, setFavicons] = useState<GeneratedFavicon[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizes = [16, 32, 48, 64, 128, 180, 192, 512]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    setError("")
    setImageName(file.name)
    
    const reader = new FileReader()
    reader.onload = (event) => {
      setImage(event.target?.result as string)
      setFavicons([])
    }
    reader.readAsDataURL(file)
  }

  const generateFavicons = async () => {
    if (!image) return

    setLoading(true)
    setFavicons([])

    try {
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("Failed to load image"))
        img.src = image
      })

      const generated: GeneratedFavicon[] = []

      for (const size of sizes) {
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        
        if (ctx) {
          // Draw image scaled to fit
          ctx.drawImage(img, 0, 0, size, size)
          const dataUrl = canvas.toDataURL("image/png")
          generated.push({ size, dataUrl })
        }
      }

      setFavicons(generated)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate favicons")
    } finally {
      setLoading(false)
    }
  }

  const downloadFavicon = (favicon: GeneratedFavicon, format: "png" | "ico") => {
    const link = document.createElement("a")
    
    if (format === "ico" && favicon.size <= 64) {
      // For ICO format, we'll use PNG but name it .ico (browsers handle this)
      link.href = favicon.dataUrl
      link.download = `favicon-${favicon.size}x${favicon.size}.ico`
    } else {
      link.href = favicon.dataUrl
      link.download = `favicon-${favicon.size}x${favicon.size}.png`
    }
    
    link.click()
  }

  const downloadAll = () => {
    favicons.forEach((favicon, index) => {
      setTimeout(() => {
        downloadFavicon(favicon, favicon.size <= 64 ? "ico" : "png")
      }, index * 200)
    })
  }

  const clearImage = () => {
    setImage(null)
    setImageName("")
    setFavicons([])
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <ToolLayout
      title="Favicon Generator"
      description="Upload an image and generate favicons in multiple sizes"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Upload className="h-5 w-5 text-primary" />
              Upload Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="favicon-upload"
            />

            {!image ? (
              <label
                htmlFor="favicon-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-foreground font-medium">Click to upload image</p>
                <p className="text-sm text-muted-foreground mt-1">PNG, JPG, SVG, or WebP</p>
              </label>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-background flex items-center justify-center border border-border">
                    <img src={image} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{imageName}</p>
                    <p className="text-sm text-muted-foreground">Ready to generate favicons</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={clearImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button onClick={generateFavicons} disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Generate Favicons
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </CardContent>
        </Card>

        {favicons.length > 0 && (
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Generated Favicons</CardTitle>
                <Button variant="outline" size="sm" onClick={downloadAll}>
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {favicons.map((favicon) => (
                  <div
                    key={favicon.size}
                    className="flex flex-col items-center p-4 bg-secondary rounded-lg"
                  >
                    <div 
                      className="flex items-center justify-center bg-background rounded border border-border mb-3"
                      style={{ 
                        width: Math.min(favicon.size, 128), 
                        height: Math.min(favicon.size, 128) 
                      }}
                    >
                      <img
                        src={favicon.dataUrl}
                        alt={`${favicon.size}x${favicon.size}`}
                        style={{
                          width: Math.min(favicon.size, 128),
                          height: Math.min(favicon.size, 128),
                          imageRendering: favicon.size <= 32 ? "pixelated" : "auto"
                        }}
                      />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">
                      {favicon.size}x{favicon.size}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadFavicon(favicon, "png")}
                        className="text-xs"
                      >
                        PNG
                      </Button>
                      {favicon.size <= 64 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadFavicon(favicon, "ico")}
                          className="text-xs"
                        >
                          ICO
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-border bg-card/50">
          <CardContent className="py-4">
            <h3 className="font-semibold text-foreground mb-3">Common Favicon Sizes</h3>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <p><strong className="text-foreground">16x16</strong> - Browser tab icon</p>
              <p><strong className="text-foreground">32x32</strong> - Taskbar shortcut icon</p>
              <p><strong className="text-foreground">180x180</strong> - Apple Touch Icon</p>
              <p><strong className="text-foreground">192x192</strong> - Android Chrome</p>
              <p><strong className="text-foreground">512x512</strong> - PWA splash screen</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}
