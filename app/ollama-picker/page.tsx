"use client"

import { useState, useMemo } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { HardDrive, CheckCircle2, XCircle, AlertCircle, Copy, Check, Cpu, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface OllamaModel {
  name: string
  displayName: string
  vramQ4: number
  vramQ8: number
  vramFP16: number
  contextDefault: number
  description: string
  tags: string[]
  pullCommand: string
}

const ollamaModels: OllamaModel[] = [
  {
    name: "llama3.2:1b",
    displayName: "Llama 3.2 1B",
    vramQ4: 1.5,
    vramQ8: 2,
    vramFP16: 3,
    contextDefault: 128000,
    description: "Smallest Llama 3.2, great for edge devices",
    tags: ["Small", "Fast", "128K Context"],
    pullCommand: "ollama pull llama3.2:1b"
  },
  {
    name: "llama3.2:3b",
    displayName: "Llama 3.2 3B",
    vramQ4: 2.5,
    vramQ8: 4,
    vramFP16: 7,
    contextDefault: 128000,
    description: "Balanced size and capability",
    tags: ["Balanced", "128K Context"],
    pullCommand: "ollama pull llama3.2:3b"
  },
  {
    name: "llama3.1:8b",
    displayName: "Llama 3.1 8B",
    vramQ4: 5,
    vramQ8: 8,
    vramFP16: 16,
    contextDefault: 128000,
    description: "Strong general-purpose model",
    tags: ["Popular", "Coding", "128K Context"],
    pullCommand: "ollama pull llama3.1:8b"
  },
  {
    name: "llama3.1:70b",
    displayName: "Llama 3.1 70B",
    vramQ4: 40,
    vramQ8: 70,
    vramFP16: 140,
    contextDefault: 128000,
    description: "Near GPT-4 quality, requires high-end hardware",
    tags: ["High Quality", "Complex Tasks"],
    pullCommand: "ollama pull llama3.1:70b"
  },
  {
    name: "mistral:7b",
    displayName: "Mistral 7B",
    vramQ4: 4.5,
    vramQ8: 8,
    vramFP16: 15,
    contextDefault: 32000,
    description: "Fast and efficient, Apache 2.0 license",
    tags: ["Fast", "Apache 2.0", "32K Context"],
    pullCommand: "ollama pull mistral"
  },
  {
    name: "mixtral:8x7b",
    displayName: "Mixtral 8x7B",
    vramQ4: 26,
    vramQ8: 48,
    vramFP16: 90,
    contextDefault: 32000,
    description: "MoE model, uses only 12B params per forward pass",
    tags: ["MoE", "High Quality", "32K Context"],
    pullCommand: "ollama pull mixtral"
  },
  {
    name: "phi3:mini",
    displayName: "Phi-3 Mini 3.8B",
    vramQ4: 2.5,
    vramQ8: 4,
    vramFP16: 8,
    contextDefault: 128000,
    description: "Microsoft's efficient model with 128K context",
    tags: ["Small", "128K Context", "MIT"],
    pullCommand: "ollama pull phi3:mini"
  },
  {
    name: "phi3:medium",
    displayName: "Phi-3 Medium 14B",
    vramQ4: 8,
    vramQ8: 14,
    vramFP16: 28,
    contextDefault: 128000,
    description: "Larger Phi-3 with excellent reasoning",
    tags: ["Reasoning", "128K Context", "MIT"],
    pullCommand: "ollama pull phi3:medium"
  },
  {
    name: "gemma2:2b",
    displayName: "Gemma 2 2B",
    vramQ4: 2,
    vramQ8: 3,
    vramFP16: 5,
    contextDefault: 8192,
    description: "Google's lightweight model",
    tags: ["Small", "Fast", "Google"],
    pullCommand: "ollama pull gemma2:2b"
  },
  {
    name: "gemma2:9b",
    displayName: "Gemma 2 9B",
    vramQ4: 6,
    vramQ8: 10,
    vramFP16: 20,
    contextDefault: 8192,
    description: "Balanced Google model",
    tags: ["Balanced", "Google"],
    pullCommand: "ollama pull gemma2:9b"
  },
  {
    name: "gemma2:27b",
    displayName: "Gemma 2 27B",
    vramQ4: 16,
    vramQ8: 28,
    vramFP16: 55,
    contextDefault: 8192,
    description: "High-quality Google model",
    tags: ["High Quality", "Google"],
    pullCommand: "ollama pull gemma2:27b"
  },
  {
    name: "qwen2.5:0.5b",
    displayName: "Qwen 2.5 0.5B",
    vramQ4: 0.5,
    vramQ8: 1,
    vramFP16: 1.5,
    contextDefault: 32000,
    description: "Tiny but capable for basic tasks",
    tags: ["Tiny", "Fast", "Apache 2.0"],
    pullCommand: "ollama pull qwen2.5:0.5b"
  },
  {
    name: "qwen2.5:7b",
    displayName: "Qwen 2.5 7B",
    vramQ4: 5,
    vramQ8: 8,
    vramFP16: 15,
    contextDefault: 128000,
    description: "Strong multilingual and coding abilities",
    tags: ["Multilingual", "Coding", "128K Context"],
    pullCommand: "ollama pull qwen2.5:7b"
  },
  {
    name: "qwen2.5:32b",
    displayName: "Qwen 2.5 32B",
    vramQ4: 20,
    vramQ8: 35,
    vramFP16: 65,
    contextDefault: 128000,
    description: "Excellent for complex reasoning and math",
    tags: ["Math", "Reasoning", "128K Context"],
    pullCommand: "ollama pull qwen2.5:32b"
  },
  {
    name: "qwen2.5-coder:7b",
    displayName: "Qwen 2.5 Coder 7B",
    vramQ4: 5,
    vramQ8: 8,
    vramFP16: 15,
    contextDefault: 128000,
    description: "Specialized for code generation",
    tags: ["Coding", "128K Context"],
    pullCommand: "ollama pull qwen2.5-coder:7b"
  },
  {
    name: "codellama:7b",
    displayName: "CodeLlama 7B",
    vramQ4: 4.5,
    vramQ8: 8,
    vramFP16: 15,
    contextDefault: 16000,
    description: "Meta's code-specialized model",
    tags: ["Coding", "Completion"],
    pullCommand: "ollama pull codellama:7b"
  },
  {
    name: "deepseek-coder-v2:16b",
    displayName: "DeepSeek Coder V2 16B",
    vramQ4: 10,
    vramQ8: 18,
    vramFP16: 35,
    contextDefault: 128000,
    description: "Top-tier coding model with 128K context",
    tags: ["Coding", "128K Context", "High Quality"],
    pullCommand: "ollama pull deepseek-coder-v2:16b"
  },
  {
    name: "starcoder2:7b",
    displayName: "StarCoder2 7B",
    vramQ4: 4.5,
    vramQ8: 8,
    vramFP16: 15,
    contextDefault: 16000,
    description: "80+ language support, open license",
    tags: ["Coding", "Multi-language", "Open"],
    pullCommand: "ollama pull starcoder2:7b"
  },
  {
    name: "nomic-embed-text",
    displayName: "Nomic Embed Text",
    vramQ4: 0.3,
    vramQ8: 0.5,
    vramFP16: 1,
    contextDefault: 8192,
    description: "Text embedding model for RAG",
    tags: ["Embeddings", "RAG", "Small"],
    pullCommand: "ollama pull nomic-embed-text"
  },
  {
    name: "mxbai-embed-large",
    displayName: "mxbai-embed-large",
    vramQ4: 0.6,
    vramQ8: 1,
    vramFP16: 1.5,
    contextDefault: 512,
    description: "High-quality embeddings model",
    tags: ["Embeddings", "RAG"],
    pullCommand: "ollama pull mxbai-embed-large"
  }
]

export default function OllamaPickerPage() {
  const [vram, setVram] = useState(8)
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [quantization, setQuantization] = useState<"q4" | "q8" | "fp16">("q4")

  const getVramForQuant = (model: OllamaModel) => {
    switch (quantization) {
      case "q4": return model.vramQ4
      case "q8": return model.vramQ8
      case "fp16": return model.vramFP16
    }
  }

  const categorizedModels = useMemo(() => {
    const canRun: OllamaModel[] = []
    const marginal: OllamaModel[] = []
    const cannotRun: OllamaModel[] = []

    ollamaModels.forEach(model => {
      const required = getVramForQuant(model)
      const headroom = vram - required
      
      if (headroom >= 1) {
        canRun.push(model)
      } else if (headroom >= -1) {
        marginal.push(model)
      } else {
        cannotRun.push(model)
      }
    })

    return { canRun, marginal, cannotRun }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vram, quantization])

  const copyCommand = async (command: string) => {
    await navigator.clipboard.writeText(command)
    setCopiedCommand(command)
    setTimeout(() => setCopiedCommand(null), 2000)
  }

  const ModelCard = ({ model, status }: { model: OllamaModel; status: "can" | "marginal" | "cannot" }) => {
    const required = getVramForQuant(model)
    
    return (
      <Card className={cn(
        "bg-card border-border",
        status === "can" && "border-green-500/30",
        status === "marginal" && "border-yellow-500/30",
        status === "cannot" && "border-red-500/30 opacity-60"
      )}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {status === "can" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              {status === "marginal" && <AlertCircle className="h-4 w-4 text-yellow-500" />}
              {status === "cannot" && <XCircle className="h-4 w-4 text-red-500" />}
              <CardTitle className="text-sm font-semibold text-foreground">
                {model.displayName}
              </CardTitle>
            </div>
            <Badge className={cn(
              "font-mono text-xs",
              required <= vram ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
            )}>
              {required}GB
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">{model.description}</p>
          
          <div className="flex flex-wrap gap-1">
            {model.tags.map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs border-border">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Cpu className="h-3 w-3" />
            <span>Context: {(model.contextDefault / 1000).toFixed(0)}K</span>
          </div>

          {status !== "cannot" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs font-mono border-border"
              onClick={() => copyCommand(model.pullCommand)}
            >
              {copiedCommand === model.pullCommand ? (
                <>
                  <Check className="h-3 w-3 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-2" />
                  {model.pullCommand}
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <ToolLayout
      title="Ollama Model Picker"
      description="Enter your available VRAM to see which Ollama models you can run locally."
    >
      <div className="space-y-6">
        {/* VRAM Selector */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-base font-medium text-foreground">Your GPU VRAM</Label>
                  <p className="text-sm text-muted-foreground">Adjust to match your graphics card</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={vram}
                  onChange={(e) => setVram(Math.max(1, Math.min(128, parseInt(e.target.value) || 1)))}
                  className="w-20 bg-secondary border-border text-center font-mono"
                />
                <span className="text-lg font-bold text-foreground">GB</span>
              </div>
            </div>
            
            <Slider
              value={[vram]}
              onValueChange={([v]) => setVram(v)}
              min={1}
              max={128}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1GB</span>
              <span className="flex items-center gap-4">
                <span>4GB</span>
                <span>8GB</span>
                <span>12GB</span>
                <span>16GB</span>
                <span>24GB</span>
                <span>48GB</span>
              </span>
              <span>128GB</span>
            </div>

            {/* Quantization selector */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm text-muted-foreground">Quantization Level</Label>
              </div>
              <div className="flex gap-2">
                {(["q4", "q8", "fp16"] as const).map((q) => (
                  <Button
                    key={q}
                    variant={quantization === q ? "default" : "outline"}
                    size="sm"
                    className="font-mono"
                    onClick={() => setQuantization(q)}
                  >
                    {q.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Q4 = smallest/fastest, Q8 = balanced, FP16 = highest quality
            </p>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="bg-green-500/10 border-green-500/30">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-500">{categorizedModels.canRun.length}</div>
              <div className="text-xs text-muted-foreground">Can Run</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500/10 border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-500">{categorizedModels.marginal.length}</div>
              <div className="text-xs text-muted-foreground">Marginal</div>
            </CardContent>
          </Card>
          <Card className="bg-red-500/10 border-red-500/30">
            <CardContent className="p-4 text-center">
              <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-500">{categorizedModels.cannotRun.length}</div>
              <div className="text-xs text-muted-foreground">Too Large</div>
            </CardContent>
          </Card>
        </div>

        {/* Models that can run */}
        {categorizedModels.canRun.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-green-500 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Models You Can Run
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categorizedModels.canRun.map((model) => (
                <ModelCard key={model.name} model={model} status="can" />
              ))}
            </div>
          </div>
        )}

        {/* Marginal models */}
        {categorizedModels.marginal.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-yellow-500 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Might Work (Close to Limit)
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categorizedModels.marginal.map((model) => (
                <ModelCard key={model.name} model={model} status="marginal" />
              ))}
            </div>
          </div>
        )}

        {/* Models that cannot run */}
        {categorizedModels.cannotRun.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-red-500 flex items-center gap-2">
              <XCircle className="h-5 w-5" />
              Requires More VRAM
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categorizedModels.cannotRun.map((model) => (
                <ModelCard key={model.name} model={model} status="cannot" />
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <Card className="bg-secondary/50 border-border">
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-2">Tips for Running Local Models</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Leave ~1-2GB headroom for system/OS usage</li>
              <li>Q4 quantization offers the best speed/quality tradeoff</li>
              <li>Longer context windows require more VRAM</li>
              <li>CPU offloading is possible but significantly slower</li>
              <li>Use <code className="bg-secondary px-1 rounded font-mono">ollama run modelname</code> to start chatting</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  )
}
