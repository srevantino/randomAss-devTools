"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Check, BookOpen, Eye, Code } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const badges = [
  { id: "mit", label: "MIT License", markdown: "![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)" },
  { id: "npm", label: "npm version", markdown: "![npm version](https://img.shields.io/npm/v/YOUR_PACKAGE.svg)" },
  { id: "build", label: "Build Status", markdown: "![Build Status](https://img.shields.io/github/actions/workflow/status/USER/REPO/ci.yml)" },
  { id: "coverage", label: "Code Coverage", markdown: "![Coverage](https://img.shields.io/codecov/c/github/USER/REPO)" },
  { id: "stars", label: "GitHub Stars", markdown: "![GitHub stars](https://img.shields.io/github/stars/USER/REPO)" },
  { id: "issues", label: "Open Issues", markdown: "![GitHub issues](https://img.shields.io/github/issues/USER/REPO)" },
  { id: "prs", label: "PRs Welcome", markdown: "![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)" },
  { id: "ts", label: "TypeScript", markdown: "![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)" },
]

const techStacks = [
  "React", "Next.js", "Vue", "Nuxt", "Angular", "Svelte", "Node.js", "Express",
  "TypeScript", "JavaScript", "Python", "Go", "Rust", "PostgreSQL", "MongoDB",
  "Redis", "Docker", "Kubernetes", "AWS", "Vercel", "Tailwind CSS", "GraphQL"
]

export default function ReadmePage() {
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedBadges, setSelectedBadges] = useState<string[]>([])
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [features, setFeatures] = useState("")
  const [installation, setInstallation] = useState("npm install")
  const [usage, setUsage] = useState("")
  const [contributing, setContributing] = useState(true)
  const [license, setLicense] = useState("MIT")
  const [author, setAuthor] = useState("")
  const [copied, setCopied] = useState(false)

  const toggleBadge = (id: string) => {
    setSelectedBadges(prev =>
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    )
  }

  const toggleTech = (tech: string) => {
    setSelectedTech(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    )
  }

  const generateReadme = () => {
    const lines: string[] = []

    // Title
    lines.push(`# ${projectName || "Project Name"}`)
    lines.push("")

    // Badges
    if (selectedBadges.length > 0) {
      const badgeLines = selectedBadges
        .map(id => badges.find(b => b.id === id)?.markdown)
        .filter(Boolean)
        .join(" ")
      lines.push(badgeLines)
      lines.push("")
    }

    // Description
    if (description) {
      lines.push(description)
      lines.push("")
    }

    // Tech Stack
    if (selectedTech.length > 0) {
      lines.push("## Tech Stack")
      lines.push("")
      lines.push(selectedTech.map(t => `- ${t}`).join("\n"))
      lines.push("")
    }

    // Features
    if (features) {
      lines.push("## Features")
      lines.push("")
      const featureList = features.split("\n").filter(f => f.trim())
      lines.push(featureList.map(f => `- ${f.trim()}`).join("\n"))
      lines.push("")
    }

    // Installation
    lines.push("## Installation")
    lines.push("")
    lines.push("```bash")
    lines.push(installation || "npm install")
    lines.push("```")
    lines.push("")

    // Usage
    if (usage) {
      lines.push("## Usage")
      lines.push("")
      lines.push("```bash")
      lines.push(usage)
      lines.push("```")
      lines.push("")
    }

    // Contributing
    if (contributing) {
      lines.push("## Contributing")
      lines.push("")
      lines.push("Contributions are welcome! Please feel free to submit a Pull Request.")
      lines.push("")
      lines.push("1. Fork the project")
      lines.push("2. Create your feature branch (`git checkout -b feature/AmazingFeature`)")
      lines.push("3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)")
      lines.push("4. Push to the branch (`git push origin feature/AmazingFeature`)")
      lines.push("5. Open a Pull Request")
      lines.push("")
    }

    // License
    lines.push("## License")
    lines.push("")
    lines.push(`This project is licensed under the ${license} License - see the [LICENSE](LICENSE) file for details.`)
    lines.push("")

    // Author
    if (author) {
      lines.push("## Author")
      lines.push("")
      lines.push(`**${author}**`)
      lines.push("")
    }

    // Footer
    lines.push("---")
    lines.push("")
    lines.push("Made with love")

    return lines.join("\n")
  }

  const readme = generateReadme()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(readme)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <ToolLayout
      title="README Generator"
      description="Generate professional README.md files with badges and sections"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Form */}
        <div className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <BookOpen className="h-5 w-5 text-primary" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  placeholder="My Awesome Project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="A brief description of what your project does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  placeholder="Your Name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>License</Label>
                <Input
                  placeholder="MIT"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <Button
                    key={badge.id}
                    variant={selectedBadges.includes(badge.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleBadge(badge.id)}
                    className="text-xs"
                  >
                    {badge.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {techStacks.map((tech) => (
                  <Button
                    key={tech}
                    variant={selectedTech.includes(tech) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleTech(tech)}
                    className="text-xs"
                  >
                    {tech}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm text-foreground">Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Features (one per line)</Label>
                <Textarea
                  placeholder="Fast and efficient&#10;Easy to use&#10;Well documented"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Installation Command</Label>
                <Input
                  placeholder="npm install your-package"
                  value={installation}
                  onChange={(e) => setInstallation(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Usage Example</Label>
                <Textarea
                  placeholder="npm run dev"
                  value={usage}
                  onChange={(e) => setUsage(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="contributing"
                  checked={contributing}
                  onCheckedChange={(checked) => setContributing(checked === true)}
                />
                <Label htmlFor="contributing" className="text-sm cursor-pointer">
                  Include Contributing section
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <Card className="border-border bg-card sticky top-20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Generated README</CardTitle>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
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
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="raw">
                <TabsList className="mb-4 bg-secondary">
                  <TabsTrigger value="raw" className="flex items-center gap-1">
                    <Code className="h-3.5 w-3.5" />
                    Raw
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="raw">
                  <pre className="text-xs font-mono bg-secondary p-4 rounded-lg overflow-auto max-h-[600px] text-foreground whitespace-pre-wrap">
                    {readme}
                  </pre>
                </TabsContent>

                <TabsContent value="preview">
                  <div className="prose prose-invert prose-sm max-w-none bg-secondary p-4 rounded-lg overflow-auto max-h-[600px]">
                    <div className="space-y-4 text-foreground">
                      <h1 className="text-2xl font-bold text-foreground border-b border-border pb-2">
                        {projectName || "Project Name"}
                      </h1>
                      
                      {selectedBadges.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedBadges.map(id => {
                            const badge = badges.find(b => b.id === id)
                            return badge && (
                              <span key={id} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                                {badge.label}
                              </span>
                            )
                          })}
                        </div>
                      )}

                      {description && <p className="text-muted-foreground">{description}</p>}

                      {selectedTech.length > 0 && (
                        <>
                          <h2 className="text-lg font-semibold text-foreground">Tech Stack</h2>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {selectedTech.map(t => <li key={t}>{t}</li>)}
                          </ul>
                        </>
                      )}

                      {features && (
                        <>
                          <h2 className="text-lg font-semibold text-foreground">Features</h2>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {features.split("\n").filter(f => f.trim()).map((f, i) => (
                              <li key={i}>{f.trim()}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      <h2 className="text-lg font-semibold text-foreground">Installation</h2>
                      <code className="block bg-background p-2 rounded text-sm">
                        {installation || "npm install"}
                      </code>

                      {usage && (
                        <>
                          <h2 className="text-lg font-semibold text-foreground">Usage</h2>
                          <code className="block bg-background p-2 rounded text-sm">{usage}</code>
                        </>
                      )}

                      <h2 className="text-lg font-semibold text-foreground">License</h2>
                      <p className="text-muted-foreground">{license} License</p>

                      {author && (
                        <>
                          <h2 className="text-lg font-semibold text-foreground">Author</h2>
                          <p className="text-muted-foreground font-medium">{author}</p>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  )
}
