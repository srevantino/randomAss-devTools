"use client"

import { useState, useCallback } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Copy, Check, ArrowRightLeft, Upload, FileCode, Trash2 } from "lucide-react"

export default function Base64Page() {
  const [textInput, setTextInput] = useState("")
  const [textOutput, setTextOutput] = useState("")
  const [fileOutput, setFileOutput] = useState("")
  const [fileName, setFileName] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState("")

  const handleTextProcess = useCallback(() => {
    setError("")
    try {
      if (mode === "encode") {
        const encoded = btoa(unescape(encodeURIComponent(textInput)))
        setTextOutput(encoded)
      } else {
        const decoded = decodeURIComponent(escape(atob(textInput)))
        setTextOutput(decoded)
      }
    } catch {
      setError(mode === "decode" ? "Invalid Base64 string" : "Error encoding text")
      setTextOutput("")
    }
  }, [textInput, mode])

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      // Remove the data URL prefix to get just the Base64 string
      const base64 = result.split(",")[1] || result
      setFileOutput(base64)
    }
    reader.readAsDataURL(file)
  }, [])

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const swapInputOutput = () => {
    setTextInput(textOutput)
    setTextOutput("")
    setMode(mode === "encode" ? "decode" : "encode")
  }

  const clearAll = () => {
    setTextInput("")
    setTextOutput("")
    setFileOutput("")
    setFileName("")
    setError("")
  }

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode and decode text or files to and from Base64 format"
    >
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="mb-6 bg-secondary">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="file">File</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <FileCode className="h-5 w-5 text-primary" />
                    {mode === "encode" ? "Plain Text" : "Base64 Input"}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMode(mode === "encode" ? "decode" : "encode")}
                      className="text-xs"
                    >
                      {mode === "encode" ? "Encode" : "Decode"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] bg-secondary border-border text-foreground placeholder:text-muted-foreground font-mono text-sm resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleTextProcess}
                    disabled={!textInput.trim()}
                    className="flex-1"
                  >
                    {mode === "encode" ? "Encode to Base64" : "Decode from Base64"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={swapInputOutput}
                    disabled={!textOutput}
                    title="Swap input and output"
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {error && (
                  <p className="text-xs text-destructive">{error}</p>
                )}
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">
                    {mode === "encode" ? "Base64 Output" : "Plain Text Output"}
                  </CardTitle>
                  {textOutput && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(textOutput)}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {textOutput ? (
                  <div className="rounded-lg border border-border bg-secondary p-4">
                    <p className="font-mono text-sm text-foreground break-all whitespace-pre-wrap leading-relaxed">
                      {textOutput}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileCode className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-sm text-muted-foreground">
                      {mode === "encode" ? "Encoded" : "Decoded"} output will appear here
                    </p>
                  </div>
                )}
                {textOutput && (
                  <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                    <span>Length: {textOutput.length} chars</span>
                    <span>Size: {new TextEncoder().encode(textOutput).length} bytes</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="file">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Upload className="h-5 w-5 text-primary" />
                File to Base64
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload File</Label>
                <div className="flex items-center gap-4">
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                    className="w-full h-24 border-dashed"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {fileName || "Click to upload or drag and drop"}
                      </span>
                    </div>
                  </Button>
                </div>
              </div>

              {fileOutput && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Base64 Output</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(fileOutput)}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-green-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    value={fileOutput}
                    readOnly
                    className="min-h-[200px] bg-secondary border-border text-foreground font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    File: {fileName} | Base64 length: {fileOutput.length} chars
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Section */}
      <Card className="mt-6 border-border bg-card">
        <CardContent className="py-4">
          <div className="grid gap-4 sm:grid-cols-3 text-center">
            <div>
              <p className="text-sm font-medium text-foreground">Encoding</p>
              <p className="text-xs text-muted-foreground">Binary to ASCII text</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Size Increase</p>
              <p className="text-xs text-muted-foreground">~33% larger than original</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Character Set</p>
              <p className="text-xs text-muted-foreground">A-Z, a-z, 0-9, +, /, =</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
