"use client"

import { useState, useMemo } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Cpu, HardDrive, Zap, Scale, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIModel {
  name: string
  family: string
  parameters: string
  vramRequired: number
  contextLength: number
  quantizations: string[]
  license: string
  strengths: string[]
  useCase: string
  releaseDate: string
  link: string
}

const models: AIModel[] = [
  // Llama Family
  {
    name: "Llama 3.2 1B",
    family: "Llama",
    parameters: "1B",
    vramRequired: 2,
    contextLength: 128000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "Llama 3.2 Community",
    strengths: ["Fast inference", "Edge deployment", "Mobile"],
    useCase: "Simple tasks, edge devices",
    releaseDate: "Sep 2024",
    link: "https://llama.meta.com"
  },
  {
    name: "Llama 3.2 3B",
    family: "Llama",
    parameters: "3B",
    vramRequired: 4,
    contextLength: 128000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "Llama 3.2 Community",
    strengths: ["Balanced", "Good quality", "Fast"],
    useCase: "General purpose, coding assistance",
    releaseDate: "Sep 2024",
    link: "https://llama.meta.com"
  },
  {
    name: "Llama 3.1 8B",
    family: "Llama",
    parameters: "8B",
    vramRequired: 8,
    contextLength: 128000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "Llama 3.1 Community",
    strengths: ["Strong reasoning", "Coding", "Instruction following"],
    useCase: "Coding, writing, analysis",
    releaseDate: "Jul 2024",
    link: "https://llama.meta.com"
  },
  {
    name: "Llama 3.1 70B",
    family: "Llama",
    parameters: "70B",
    vramRequired: 48,
    contextLength: 128000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
    license: "Llama 3.1 Community",
    strengths: ["Near GPT-4 quality", "Complex reasoning", "Multilingual"],
    useCase: "Complex tasks, production apps",
    releaseDate: "Jul 2024",
    link: "https://llama.meta.com"
  },
  // Mistral Family
  {
    name: "Mistral 7B v0.3",
    family: "Mistral",
    parameters: "7B",
    vramRequired: 8,
    contextLength: 32000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "Apache 2.0",
    strengths: ["Efficient", "Good at code", "Fast"],
    useCase: "General purpose, coding",
    releaseDate: "May 2024",
    link: "https://mistral.ai"
  },
  {
    name: "Mixtral 8x7B",
    family: "Mistral",
    parameters: "46.7B MoE",
    vramRequired: 32,
    contextLength: 32000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
    license: "Apache 2.0",
    strengths: ["MoE architecture", "Fast for size", "Multilingual"],
    useCase: "High-quality tasks, multilingual",
    releaseDate: "Dec 2023",
    link: "https://mistral.ai"
  },
  {
    name: "Mixtral 8x22B",
    family: "Mistral",
    parameters: "141B MoE",
    vramRequired: 80,
    contextLength: 64000,
    quantizations: ["Q4_K_M", "Q5_K_M"],
    license: "Apache 2.0",
    strengths: ["Top-tier quality", "64K context", "Math/code"],
    useCase: "Complex reasoning, large context",
    releaseDate: "Apr 2024",
    link: "https://mistral.ai"
  },
  // Phi Family
  {
    name: "Phi-3 Mini 3.8B",
    family: "Phi",
    parameters: "3.8B",
    vramRequired: 4,
    contextLength: 128000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "MIT",
    strengths: ["Small but capable", "128K context", "Reasoning"],
    useCase: "Resource-constrained, mobile",
    releaseDate: "Apr 2024",
    link: "https://azure.microsoft.com/en-us/products/phi-3"
  },
  {
    name: "Phi-3 Medium 14B",
    family: "Phi",
    parameters: "14B",
    vramRequired: 12,
    contextLength: 128000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "MIT",
    strengths: ["High quality", "Long context", "Efficient"],
    useCase: "Quality-focused tasks",
    releaseDate: "May 2024",
    link: "https://azure.microsoft.com/en-us/products/phi-3"
  },
  // Gemma Family
  {
    name: "Gemma 2 2B",
    family: "Gemma",
    parameters: "2B",
    vramRequired: 3,
    contextLength: 8192,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "Gemma License",
    strengths: ["Lightweight", "Fast", "Google trained"],
    useCase: "Edge, mobile, quick tasks",
    releaseDate: "Jun 2024",
    link: "https://ai.google.dev/gemma"
  },
  {
    name: "Gemma 2 9B",
    family: "Gemma",
    parameters: "9B",
    vramRequired: 10,
    contextLength: 8192,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "Gemma License",
    strengths: ["Balanced", "Good at reasoning", "Efficient"],
    useCase: "General purpose",
    releaseDate: "Jun 2024",
    link: "https://ai.google.dev/gemma"
  },
  {
    name: "Gemma 2 27B",
    family: "Gemma",
    parameters: "27B",
    vramRequired: 20,
    contextLength: 8192,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
    license: "Gemma License",
    strengths: ["High quality", "Near Llama 70B", "Efficient"],
    useCase: "Quality-critical tasks",
    releaseDate: "Jun 2024",
    link: "https://ai.google.dev/gemma"
  },
  // Qwen Family
  {
    name: "Qwen 2.5 0.5B",
    family: "Qwen",
    parameters: "0.5B",
    vramRequired: 1,
    contextLength: 32000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "Apache 2.0",
    strengths: ["Tiny", "Fast", "Good for size"],
    useCase: "Ultra-lightweight tasks",
    releaseDate: "Sep 2024",
    link: "https://qwenlm.github.io"
  },
  {
    name: "Qwen 2.5 7B",
    family: "Qwen",
    parameters: "7B",
    vramRequired: 8,
    contextLength: 128000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "Apache 2.0",
    strengths: ["128K context", "Multilingual", "Coding"],
    useCase: "General purpose, long context",
    releaseDate: "Sep 2024",
    link: "https://qwenlm.github.io"
  },
  {
    name: "Qwen 2.5 32B",
    family: "Qwen",
    parameters: "32B",
    vramRequired: 24,
    contextLength: 128000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
    license: "Apache 2.0",
    strengths: ["Strong reasoning", "Math", "Code"],
    useCase: "Complex tasks, coding",
    releaseDate: "Sep 2024",
    link: "https://qwenlm.github.io"
  },
  {
    name: "Qwen 2.5 72B",
    family: "Qwen",
    parameters: "72B",
    vramRequired: 48,
    contextLength: 128000,
    quantizations: ["Q4_K_M", "Q5_K_M"],
    license: "Qwen License",
    strengths: ["Top-tier", "GPT-4 competitive", "All tasks"],
    useCase: "Production, complex reasoning",
    releaseDate: "Sep 2024",
    link: "https://qwenlm.github.io"
  },
  // Code-specific
  {
    name: "CodeLlama 7B",
    family: "Llama",
    parameters: "7B",
    vramRequired: 8,
    contextLength: 16000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "Llama 2 Community",
    strengths: ["Code completion", "Infilling", "Multiple languages"],
    useCase: "Code assistance, completion",
    releaseDate: "Aug 2023",
    link: "https://llama.meta.com"
  },
  {
    name: "DeepSeek Coder V2 16B",
    family: "DeepSeek",
    parameters: "16B",
    vramRequired: 14,
    contextLength: 128000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
    license: "DeepSeek License",
    strengths: ["Top coding model", "128K context", "Fill-in-middle"],
    useCase: "Professional coding assistance",
    releaseDate: "Jun 2024",
    link: "https://deepseekcoder.github.io"
  },
  {
    name: "StarCoder2 7B",
    family: "StarCoder",
    parameters: "7B",
    vramRequired: 8,
    contextLength: 16000,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0", "FP16"],
    license: "BigCode OpenRAIL-M",
    strengths: ["Code generation", "80+ languages", "Open"],
    useCase: "Code completion, generation",
    releaseDate: "Feb 2024",
    link: "https://huggingface.co/bigcode"
  }
]

const families = ["All", "Llama", "Mistral", "Phi", "Gemma", "Qwen", "DeepSeek", "StarCoder"]

export default function AIModelsPage() {
  const [search, setSearch] = useState("")
  const [selectedFamily, setSelectedFamily] = useState("All")
  const [maxVram, setMaxVram] = useState<number | null>(null)
  const [showCodeOnly, setShowCodeOnly] = useState(false)

  const filteredModels = useMemo(() => {
    return models.filter(model => {
      const matchesSearch = 
        model.name.toLowerCase().includes(search.toLowerCase()) ||
        model.useCase.toLowerCase().includes(search.toLowerCase()) ||
        model.strengths.some(s => s.toLowerCase().includes(search.toLowerCase()))
      
      const matchesFamily = selectedFamily === "All" || model.family === selectedFamily
      const matchesVram = maxVram === null || model.vramRequired <= maxVram
      const matchesCode = !showCodeOnly || 
        model.strengths.some(s => s.toLowerCase().includes("code") || s.toLowerCase().includes("coding")) ||
        model.useCase.toLowerCase().includes("code")
      
      return matchesSearch && matchesFamily && matchesVram && matchesCode
    })
  }, [search, selectedFamily, maxVram, showCodeOnly])

  const getFamilyColor = (family: string) => {
    switch (family) {
      case "Llama": return "bg-blue-500/20 text-blue-400"
      case "Mistral": return "bg-orange-500/20 text-orange-400"
      case "Phi": return "bg-purple-500/20 text-purple-400"
      case "Gemma": return "bg-cyan-500/20 text-cyan-400"
      case "Qwen": return "bg-green-500/20 text-green-400"
      case "DeepSeek": return "bg-pink-500/20 text-pink-400"
      case "StarCoder": return "bg-yellow-500/20 text-yellow-400"
      default: return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <ToolLayout
      title="AI Model Comparator"
      description="Compare open-source AI models side by side. Filter by VRAM requirements, family, and use case."
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models, use cases, strengths..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
              <div className="flex gap-4">
                <Select value={selectedFamily} onValueChange={setSelectedFamily}>
                  <SelectTrigger className="w-[140px] bg-secondary border-border">
                    <SelectValue placeholder="Family" />
                  </SelectTrigger>
                  <SelectContent>
                    {families.map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select 
                  value={maxVram?.toString() || "any"} 
                  onValueChange={(v) => setMaxVram(v === "any" ? null : parseInt(v))}
                >
                  <SelectTrigger className="w-[140px] bg-secondary border-border">
                    <SelectValue placeholder="Max VRAM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any VRAM</SelectItem>
                    <SelectItem value="4">4 GB</SelectItem>
                    <SelectItem value="8">8 GB</SelectItem>
                    <SelectItem value="12">12 GB</SelectItem>
                    <SelectItem value="16">16 GB</SelectItem>
                    <SelectItem value="24">24 GB</SelectItem>
                    <SelectItem value="48">48 GB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="code-only"
                  checked={showCodeOnly}
                  onCheckedChange={(c) => setShowCodeOnly(c === true)}
                />
                <Label htmlFor="code-only" className="text-sm text-muted-foreground cursor-pointer">
                  Coding models only
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredModels.length} of {models.length} models
        </p>

        {/* Models Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredModels.map((model) => (
            <Card key={model.name} className="bg-card border-border hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className={cn("mb-2", getFamilyColor(model.family))}>
                      {model.family}
                    </Badge>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {model.name}
                    </CardTitle>
                  </div>
                  <a
                    href={model.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Specs */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Params:</span>
                    <span className="font-mono text-foreground">{model.parameters}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">VRAM:</span>
                    <span className={cn(
                      "font-mono",
                      model.vramRequired <= 8 ? "text-green-400" :
                      model.vramRequired <= 16 ? "text-yellow-400" : "text-red-400"
                    )}>
                      {model.vramRequired}GB
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Context:</span>
                    <span className="font-mono text-foreground">{(model.contextLength / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{model.releaseDate}</span>
                  </div>
                </div>

                {/* Strengths */}
                <div className="flex flex-wrap gap-1">
                  {model.strengths.map((strength, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-border text-muted-foreground">
                      {strength}
                    </Badge>
                  ))}
                </div>

                {/* Use case */}
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Best for:</span> {model.useCase}
                </p>

                {/* Quantizations */}
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Quants:</span>{" "}
                  <span className="font-mono">{model.quantizations.join(", ")}</span>
                </div>

                {/* License */}
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">License:</span> {model.license}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No models match your filters.</p>
          </div>
        )}
      </div>
    </ToolLayout>
  )
}
