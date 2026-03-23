"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Search, Bot, Download, Play, FileCode, Server, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

interface Command {
  cmd: string
  description: string
  example?: string
}

interface Section {
  name: string
  icon: React.ElementType
  color: string
  commands: Command[]
}

const sections: Section[] = [
  {
    name: "Model Management",
    icon: Download,
    color: "text-blue-400",
    commands: [
      { cmd: "ollama pull", description: "Download a model", example: "ollama pull llama3.2" },
      { cmd: "ollama list", description: "List downloaded models" },
      { cmd: "ollama show", description: "Show model info", example: "ollama show llama3.2" },
      { cmd: "ollama rm", description: "Remove a model", example: "ollama rm llama3.2" },
      { cmd: "ollama cp", description: "Copy a model", example: "ollama cp llama3.2 my-model" },
      { cmd: "ollama push", description: "Push model to registry", example: "ollama push username/model" },
    ]
  },
  {
    name: "Running Models",
    icon: Play,
    color: "text-green-400",
    commands: [
      { cmd: "ollama run", description: "Run model interactively", example: "ollama run llama3.2" },
      { cmd: "ollama run --verbose", description: "Run with verbose output", example: "ollama run llama3.2 --verbose" },
      { cmd: "ollama run (with prompt)", description: "Run with initial prompt", example: 'ollama run llama3.2 "Explain quantum computing"' },
      { cmd: "ollama ps", description: "List running models" },
      { cmd: "ollama stop", description: "Stop a running model", example: "ollama stop llama3.2" },
    ]
  },
  {
    name: "Modelfile",
    icon: FileCode,
    color: "text-amber-400",
    commands: [
      { cmd: "ollama create", description: "Create model from Modelfile", example: "ollama create mymodel -f ./Modelfile" },
      { cmd: "ollama show --modelfile", description: "Show model's Modelfile", example: "ollama show llama3.2 --modelfile" },
    ]
  },
  {
    name: "Server",
    icon: Server,
    color: "text-purple-400",
    commands: [
      { cmd: "ollama serve", description: "Start Ollama server" },
      { cmd: "OLLAMA_HOST", description: "Set server address", example: "OLLAMA_HOST=0.0.0.0:11434 ollama serve" },
      { cmd: "OLLAMA_MODELS", description: "Set models directory", example: "OLLAMA_MODELS=/path/to/models ollama serve" },
      { cmd: "OLLAMA_KEEP_ALIVE", description: "Keep model loaded", example: "OLLAMA_KEEP_ALIVE=24h ollama serve" },
    ]
  }
]

const popularModels = [
  { name: "llama3.2", size: "3B", description: "Meta's latest Llama model" },
  { name: "llama3.2:70b", size: "70B", description: "Large Llama 3.2" },
  { name: "mistral", size: "7B", description: "Mistral 7B" },
  { name: "mixtral", size: "47B", description: "Mixture of Experts" },
  { name: "codellama", size: "7B", description: "Code-focused Llama" },
  { name: "phi3", size: "3.8B", description: "Microsoft Phi-3" },
  { name: "gemma2", size: "9B", description: "Google Gemma 2" },
  { name: "qwen2.5", size: "7B", description: "Alibaba Qwen 2.5" },
  { name: "deepseek-coder", size: "6.7B", description: "DeepSeek Coder" },
  { name: "nomic-embed-text", size: "137M", description: "Text embeddings" },
]

const apiExamples = [
  {
    name: "Generate",
    description: "Generate a response",
    code: `curl http://localhost:11434/api/generate -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?",
  "stream": false
}'`
  },
  {
    name: "Chat",
    description: "Multi-turn conversation",
    code: `curl http://localhost:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [
    { "role": "user", "content": "Hello!" }
  ],
  "stream": false
}'`
  },
  {
    name: "Embeddings",
    description: "Generate embeddings",
    code: `curl http://localhost:11434/api/embed -d '{
  "model": "nomic-embed-text",
  "input": "The quick brown fox"
}'`
  },
  {
    name: "List Models",
    description: "Get available models",
    code: `curl http://localhost:11434/api/tags`
  },
  {
    name: "Model Info",
    description: "Get model details",
    code: `curl http://localhost:11434/api/show -d '{
  "name": "llama3.2"
}'`
  }
]

const modelfileExample = `# Modelfile
FROM llama3.2

# Set parameters
PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40
PARAMETER num_ctx 4096

# Set system prompt
SYSTEM """
You are a helpful AI assistant specialized in coding.
You write clean, well-documented code.
"""

# Set template (optional)
TEMPLATE """
{{ if .System }}<|system|>
{{ .System }}<|end|>
{{ end }}{{ if .Prompt }}<|user|>
{{ .Prompt }}<|end|>
{{ end }}<|assistant|>
{{ .Response }}<|end|>
"""`

export default function OllamaPage() {
  const [search, setSearch] = useState("")
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null)

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedCmd(text)
    setTimeout(() => setCopiedCmd(null), 2000)
  }

  const filterCommands = (commands: Command[]) => {
    if (!search) return commands
    return commands.filter(cmd =>
      cmd.cmd.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
    )
  }

  return (
    <ToolLayout
      title="Ollama Commands"
      description="Pull, run, list models, create modelfiles, and API usage"
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

        <Tabs defaultValue="commands">
          <TabsList className="bg-secondary">
            <TabsTrigger value="commands" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Commands
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Models
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="modelfile" className="flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              Modelfile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commands" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {sections.map((section) => {
                const filtered = filterCommands(section.commands)
                if (filtered.length === 0) return null

                return (
                  <Card key={section.name} className="border-border bg-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-sm">
                        <section.icon className={cn("h-4 w-4", section.color)} />
                        {section.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {filtered.map((command) => (
                        <div
                          key={command.cmd}
                          className="flex items-start justify-between gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <code className="font-mono text-xs text-primary block truncate">
                              {command.example || command.cmd}
                            </code>
                            <p className="text-xs text-muted-foreground mt-1">{command.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(command.example || command.cmd)}
                            className="h-7 w-7 p-0 shrink-0"
                          >
                            {copiedCmd === (command.example || command.cmd) ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="models" className="mt-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-sm">Popular Models</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {popularModels.map((model) => (
                    <div
                      key={model.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div>
                        <code className="font-mono text-sm text-primary">{model.name}</code>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary rounded">{model.size}</span>
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`ollama pull ${model.name}`)}
                        className="h-7 w-7 p-0"
                      >
                        {copiedCmd === `ollama pull ${model.name}` ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {apiExamples.map((example) => (
                <Card key={example.name} className="border-border bg-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{example.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(example.code)}
                        className="h-7"
                      >
                        {copiedCmd === example.code ? (
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">{example.description}</p>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-xs font-mono bg-secondary p-3 rounded-lg overflow-x-auto text-foreground whitespace-pre">
                      {example.code}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="modelfile" className="mt-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Modelfile Example</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(modelfileExample)}
                  >
                    {copiedCmd === modelfileExample ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs font-mono bg-secondary p-4 rounded-lg overflow-x-auto text-foreground whitespace-pre">
                  {modelfileExample}
                </pre>
              </CardContent>
            </Card>

            <Card className="mt-4 border-border bg-card/50">
              <CardContent className="py-4">
                <h3 className="font-semibold text-foreground mb-3">Modelfile Instructions</h3>
                <div className="grid gap-2 text-sm text-muted-foreground">
                  <p><code className="text-primary">FROM</code> - Base model to use</p>
                  <p><code className="text-primary">PARAMETER</code> - Set model parameters (temperature, top_p, etc.)</p>
                  <p><code className="text-primary">SYSTEM</code> - Set system prompt</p>
                  <p><code className="text-primary">TEMPLATE</code> - Set prompt template</p>
                  <p><code className="text-primary">ADAPTER</code> - Apply LoRA adapter</p>
                  <p><code className="text-primary">LICENSE</code> - Specify license</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  )
}
