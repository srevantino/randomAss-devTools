"use client"

import { useState, useCallback } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check, Hash, Trash2 } from "lucide-react"

interface HashResult {
  algorithm: string
  hash: string
}

async function computeHash(text: string, algorithm: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export default function HashGeneratorPage() {
  const [input, setInput] = useState("")
  const [hashes, setHashes] = useState<HashResult[]>([])
  const [isComputing, setIsComputing] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generateHashes = useCallback(async () => {
    if (!input.trim()) return
    
    setIsComputing(true)
    try {
      const algorithms = [
        { name: "MD5", algo: "MD5" },
        { name: "SHA-1", algo: "SHA-1" },
        { name: "SHA-256", algo: "SHA-256" },
        { name: "SHA-384", algo: "SHA-384" },
        { name: "SHA-512", algo: "SHA-512" },
      ]

      const results: HashResult[] = []
      
      for (const { name, algo } of algorithms) {
        try {
          const hash = await computeHash(input, algo)
          results.push({ algorithm: name, hash })
        } catch {
          // MD5 is not supported by Web Crypto API, use a simple implementation
          if (algo === "MD5") {
            results.push({ algorithm: name, hash: await md5(input) })
          }
        }
      }

      setHashes(results)
    } finally {
      setIsComputing(false)
    }
  }, [input])

  // Simple MD5 implementation
  async function md5(message: string): Promise<string> {
    function rotateLeft(x: number, n: number) {
      return (x << n) | (x >>> (32 - n))
    }

    function toHexString(num: number) {
      let hex = ""
      for (let i = 0; i < 4; i++) {
        hex += ((num >> (i * 8)) & 0xff).toString(16).padStart(2, "0")
      }
      return hex
    }

    const k = new Uint32Array([
      0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a,
      0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
      0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340,
      0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
      0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8,
      0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
      0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
      0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
      0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92,
      0xffeff47d, 0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
      0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
    ])

    const s = [
      7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
      5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
      4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
      6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
    ]

    const bytes = new TextEncoder().encode(message)
    const bitLength = bytes.length * 8
    const paddingLength = ((56 - ((bytes.length + 1) % 64) + 64) % 64) + 1
    const padded = new Uint8Array(bytes.length + paddingLength + 8)
    padded.set(bytes)
    padded[bytes.length] = 0x80
    
    const view = new DataView(padded.buffer)
    view.setUint32(padded.length - 8, bitLength, true)
    view.setUint32(padded.length - 4, Math.floor(bitLength / 0x100000000), true)

    let a0 = 0x67452301
    let b0 = 0xefcdab89
    let c0 = 0x98badcfe
    let d0 = 0x10325476

    for (let i = 0; i < padded.length; i += 64) {
      const m = new Uint32Array(16)
      for (let j = 0; j < 16; j++) {
        m[j] = view.getUint32(i + j * 4, true)
      }

      let a = a0, b = b0, c = c0, d = d0

      for (let j = 0; j < 64; j++) {
        let f: number, g: number
        if (j < 16) {
          f = (b & c) | (~b & d)
          g = j
        } else if (j < 32) {
          f = (d & b) | (~d & c)
          g = (5 * j + 1) % 16
        } else if (j < 48) {
          f = b ^ c ^ d
          g = (3 * j + 5) % 16
        } else {
          f = c ^ (b | ~d)
          g = (7 * j) % 16
        }
        const temp = d
        d = c
        c = b
        b = (b + rotateLeft((a + f + k[j] + m[g]) >>> 0, s[j])) >>> 0
        a = temp
      }

      a0 = (a0 + a) >>> 0
      b0 = (b0 + b) >>> 0
      c0 = (c0 + c) >>> 0
      d0 = (d0 + d) >>> 0
    }

    return toHexString(a0) + toHexString(b0) + toHexString(c0) + toHexString(d0)
  }

  const copyToClipboard = async (hash: string, index: number) => {
    await navigator.clipboard.writeText(hash)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const clearAll = () => {
    setInput("")
    setHashes([])
  }

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text input"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Hash className="h-5 w-5 text-primary" />
              Input Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter text to hash..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[200px] bg-secondary border-border text-foreground placeholder:text-muted-foreground font-mono text-sm resize-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={generateHashes}
                disabled={!input.trim() || isComputing}
                className="flex-1"
              >
                {isComputing ? "Computing..." : "Generate Hashes"}
              </Button>
              <Button
                variant="outline"
                onClick={clearAll}
                disabled={!input && hashes.length === 0}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {input.length} characters | {new TextEncoder().encode(input).length} bytes
            </p>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Hash Results</CardTitle>
          </CardHeader>
          <CardContent>
            {hashes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Hash className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground">
                  Enter text and click generate to see hash results
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {hashes.map((result, index) => (
                  <div
                    key={result.algorithm}
                    className="rounded-lg border border-border bg-secondary p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-primary">
                        {result.algorithm}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(result.hash, index)}
                        className="h-6 px-2"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <p className="font-mono text-xs text-foreground break-all leading-relaxed">
                      {result.hash}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="mt-6 border-border bg-card">
        <CardContent className="py-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: "MD5", bits: "128-bit", chars: "32 hex" },
              { name: "SHA-1", bits: "160-bit", chars: "40 hex" },
              { name: "SHA-256", bits: "256-bit", chars: "64 hex" },
              { name: "SHA-384", bits: "384-bit", chars: "96 hex" },
              { name: "SHA-512", bits: "512-bit", chars: "128 hex" },
            ].map((algo) => (
              <div key={algo.name} className="text-center">
                <p className="text-sm font-medium text-foreground">{algo.name}</p>
                <p className="text-xs text-muted-foreground">{algo.bits}</p>
                <p className="text-xs text-muted-foreground">{algo.chars}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  )
}
