"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Copy, Check, Plus, Minus } from "lucide-react"

export default function FlexboxPage() {
  const [copied, setCopied] = useState(false)
  const [itemCount, setItemCount] = useState(4)
  const [flexDirection, setFlexDirection] = useState("row")
  const [justifyContent, setJustifyContent] = useState("flex-start")
  const [alignItems, setAlignItems] = useState("stretch")
  const [flexWrap, setFlexWrap] = useState("nowrap")
  const [gap, setGap] = useState(16)
  const [containerHeight, setContainerHeight] = useState(300)

  const generateCSS = () => {
    return `.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
  height: ${containerHeight}px;
}`
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateCSS())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const justifyOptions = [
    { value: "flex-start", label: "flex-start" },
    { value: "flex-end", label: "flex-end" },
    { value: "center", label: "center" },
    { value: "space-between", label: "space-between" },
    { value: "space-around", label: "space-around" },
    { value: "space-evenly", label: "space-evenly" },
  ]

  const alignOptions = [
    { value: "flex-start", label: "flex-start" },
    { value: "flex-end", label: "flex-end" },
    { value: "center", label: "center" },
    { value: "stretch", label: "stretch" },
    { value: "baseline", label: "baseline" },
  ]

  return (
    <ToolLayout
      title="Flexbox Playground"
      description="Visual flex container builder with live CSS output"
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <h3 className="font-semibold text-foreground">Container Properties</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>flex-direction</Label>
                <Select value={flexDirection} onValueChange={setFlexDirection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="row">row</SelectItem>
                    <SelectItem value="row-reverse">row-reverse</SelectItem>
                    <SelectItem value="column">column</SelectItem>
                    <SelectItem value="column-reverse">column-reverse</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>justify-content</Label>
                <Select value={justifyContent} onValueChange={setJustifyContent}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {justifyOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>align-items</Label>
                <Select value={alignItems} onValueChange={setAlignItems}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {alignOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>flex-wrap</Label>
                <Select value={flexWrap} onValueChange={setFlexWrap}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nowrap">nowrap</SelectItem>
                    <SelectItem value="wrap">wrap</SelectItem>
                    <SelectItem value="wrap-reverse">wrap-reverse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>gap: {gap}px</Label>
                <Slider
                  value={[gap]}
                  onValueChange={([v]) => setGap(v)}
                  min={0}
                  max={64}
                  step={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Container Height: {containerHeight}px</Label>
                <Slider
                  value={[containerHeight]}
                  onValueChange={([v]) => setContainerHeight(v)}
                  min={100}
                  max={500}
                  step={10}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Items: {itemCount}</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setItemCount(Math.max(1, itemCount - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(itemCount / 10) * 100}%` }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setItemCount(Math.min(10, itemCount + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* CSS Output */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
              <span className="text-sm font-medium text-foreground">Generated CSS</span>
              <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <pre className="p-4 text-sm font-mono text-muted-foreground overflow-x-auto">
              {generateCSS()}
            </pre>
          </div>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground mb-4">Preview</h3>
          <div
            className="rounded-lg border-2 border-dashed border-border bg-secondary/20 p-4 transition-all"
            style={{
              display: "flex",
              flexDirection: flexDirection as React.CSSProperties["flexDirection"],
              justifyContent,
              alignItems,
              flexWrap: flexWrap as React.CSSProperties["flexWrap"],
              gap: `${gap}px`,
              height: `${containerHeight}px`,
            }}
          >
            {Array.from({ length: itemCount }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-center rounded-lg bg-primary/80 text-primary-foreground font-mono text-sm font-bold min-w-[60px] min-h-[60px] px-4 py-2"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
