"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check, Download, FileText } from "lucide-react"

interface IncidentData {
  title: string
  date: string
  duration: string
  severity: string
  summary: string
  impact: string
  affectedSystems: string
  rootCause: string
  timeline: string
  resolution: string
  preventionMeasures: string
  lessonsLearned: string
  author: string
}

const initialData: IncidentData = {
  title: "",
  date: new Date().toISOString().split("T")[0],
  duration: "",
  severity: "major",
  summary: "",
  impact: "",
  affectedSystems: "",
  rootCause: "",
  timeline: "",
  resolution: "",
  preventionMeasures: "",
  lessonsLearned: "",
  author: ""
}

export default function IncidentReportPage() {
  const [data, setData] = useState<IncidentData>(initialData)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")

  const updateField = (field: keyof IncidentData, value: string) => {
    setData({ ...data, [field]: value })
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "critical": return "SEV1 - Critical"
      case "major": return "SEV2 - Major"
      case "minor": return "SEV3 - Minor"
      case "low": return "SEV4 - Low"
      default: return severity
    }
  }

  const generateReport = () => {
    const report = `# Incident Postmortem Report

## ${data.title || "Incident Title"}

| Field | Value |
|-------|-------|
| **Date** | ${data.date || "N/A"} |
| **Duration** | ${data.duration || "N/A"} |
| **Severity** | ${getSeverityLabel(data.severity)} |
| **Author** | ${data.author || "N/A"} |

---

## Executive Summary

${data.summary || "_Provide a brief overview of the incident._"}

---

## Impact

${data.impact || "_Describe the impact on users, business, and systems._"}

### Affected Systems

${data.affectedSystems || "_List all affected systems, services, or components._"}

---

## Root Cause

${data.rootCause || "_Explain the underlying cause of the incident._"}

---

## Timeline

${data.timeline || `_Document the sequence of events. Example:_

- **HH:MM** - Issue first detected
- **HH:MM** - Team alerted
- **HH:MM** - Investigation started
- **HH:MM** - Root cause identified
- **HH:MM** - Fix deployed
- **HH:MM** - Service restored`}

---

## Resolution

${data.resolution || "_Describe the steps taken to resolve the incident._"}

---

## Prevention Measures

${data.preventionMeasures || `_List action items to prevent recurrence:_

- [ ] Action item 1
- [ ] Action item 2
- [ ] Action item 3`}

---

## Lessons Learned

${data.lessonsLearned || `_What went well? What could be improved?_

### What Went Well
- 

### What Could Be Improved
- `}

---

*This report was generated using DevTools Hub Incident Report Generator.*
`
    return report
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateReport())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadReport = () => {
    const blob = new Blob([generateReport()], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `incident-report-${data.date || "draft"}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="Incident Report Generator"
      description="Generate professional postmortem reports for incidents and outages."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-secondary">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-border"
              onClick={downloadReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-border"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="space-y-6">
          {/* Basic Info */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Incident Title</Label>
                  <Input
                    placeholder="e.g., Database Outage in Production"
                    value={data.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <Input
                    type="date"
                    value={data.date}
                    onChange={(e) => updateField("date", e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Duration</Label>
                  <Input
                    placeholder="e.g., 2 hours 15 minutes"
                    value={data.duration}
                    onChange={(e) => updateField("duration", e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Severity</Label>
                  <Select value={data.severity} onValueChange={(v) => updateField("severity", v)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">SEV1 - Critical</SelectItem>
                      <SelectItem value="major">SEV2 - Major</SelectItem>
                      <SelectItem value="minor">SEV3 - Minor</SelectItem>
                      <SelectItem value="low">SEV4 - Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Author</Label>
                  <Input
                    placeholder="Your name"
                    value={data.author}
                    onChange={(e) => updateField("author", e.target.value)}
                    className="bg-secondary border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary & Impact */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Summary & Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Executive Summary</Label>
                <Textarea
                  placeholder="Brief overview of what happened..."
                  value={data.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  className="bg-secondary border-border min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Impact</Label>
                <Textarea
                  placeholder="How were users and systems affected? Include metrics if available..."
                  value={data.impact}
                  onChange={(e) => updateField("impact", e.target.value)}
                  className="bg-secondary border-border min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Affected Systems</Label>
                <Textarea
                  placeholder="List all affected services, APIs, databases, etc."
                  value={data.affectedSystems}
                  onChange={(e) => updateField("affectedSystems", e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Root Cause & Timeline */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Root Cause & Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Root Cause</Label>
                <Textarea
                  placeholder="What was the underlying cause of the incident?"
                  value={data.rootCause}
                  onChange={(e) => updateField("rootCause", e.target.value)}
                  className="bg-secondary border-border min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Timeline</Label>
                <Textarea
                  placeholder="Document the sequence of events with timestamps..."
                  value={data.timeline}
                  onChange={(e) => updateField("timeline", e.target.value)}
                  className="bg-secondary border-border min-h-[150px] font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resolution & Prevention */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Resolution & Prevention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Resolution</Label>
                <Textarea
                  placeholder="Steps taken to resolve the incident..."
                  value={data.resolution}
                  onChange={(e) => updateField("resolution", e.target.value)}
                  className="bg-secondary border-border min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Prevention Measures</Label>
                <Textarea
                  placeholder="Action items to prevent recurrence..."
                  value={data.preventionMeasures}
                  onChange={(e) => updateField("preventionMeasures", e.target.value)}
                  className="bg-secondary border-border min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Lessons Learned</Label>
                <Textarea
                  placeholder="What went well? What could be improved?"
                  value={data.lessonsLearned}
                  onChange={(e) => updateField("lessonsLearned", e.target.value)}
                  className="bg-secondary border-border min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="bg-secondary rounded-lg p-6 text-sm font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
                  {generateReport()}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  )
}
