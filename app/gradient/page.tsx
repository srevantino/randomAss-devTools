"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Copy, Check, Plus, X } from "lucide-react"

interface ColorStop {
  id: string
  color: string
  position: number
}

export default function GradientPage() {
  const [copied, setCopied] = useState(false)
  const [gradientType, setGradientType] = useState<"linear" | "radial" | "conic">("linear")
  const [angle, setAngle] = useState(90)
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: "1", color: "#10b981", position: 0 },
    { id: "2", color: "#3b82f6", position: 50 },
    { id: "3", color: "#8b5cf6", position: 100 },
  ])

  const generateGradient = () => {
    const stops = colorStops
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ")

    switch (gradientType) {
      case "linear":
        return `linear-gradient(${angle}deg, ${stops})`
      case "radial":
        return `radial-gradient(circle, ${stops})`
      case "conic":
        return `conic-gradient(from ${angle}deg, ${stops})`
    }
  }

  const generateCSS = () => {
    return `background: ${generateGradient()};`
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateCSS())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const addColorStop = () => {
    const newId = Date.now().toString()
    const lastPosition = colorStops.length > 0 
      ? colorStops[colorStops.length - 1].position 
      : 0
    const newPosition = Math.min(100, lastPosition + 20)
    setColorStops([
      ...colorStops,
      { id: newId, color: "#ffffff", position: newPosition }
    ])
  }

  const removeColorStop = (id: string) => {
    if (colorStops.length > 2) {
      setColorStops(colorStops.filter((s) => s.id !== id))
    }
  }

  const updateColorStop = (id: string, updates: Partial<ColorStop>) => {
    setColorStops(
      colorStops.map((s) => (s.id === id ? { ...s, ...updates } : s))
    )
  }

  return (
    <ToolLayout
      title="Gradient Studio"
      description="Multi-stop gradient builder with angle control"
    >
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="space-y-6">
          <div
            className="rounded-xl border border-border aspect-video flex items-center justify-center"
            style={{ background: generateGradient() }}
          >
            <div className="text-center p-8 bg-background/80 backdrop-blur rounded-lg">
              <p className="font-mono text-sm text-foreground">Live Preview</p>
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

        {/* Controls */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <h3 className="font-semibold text-foreground">Gradient Settings</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={gradientType} onValueChange={(v) => setGradientType(v as typeof gradientType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="conic">Conic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(gradientType === "linear" || gradientType === "conic") && (
                <div className="space-y-2">
                  <Label>Angle: {angle}°</Label>
                  <Slider
                    value={[angle]}
                    onValueChange={([v]) => setAngle(v)}
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>
              )}
            </div>

            {/* Angle visual */}
            {(gradientType === "linear" || gradientType === "conic") && (
              <div className="flex justify-center">
                <div className="relative w-32 h-32 rounded-full border-2 border-border bg-secondary/20">
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div className="w-1 h-14 bg-primary rounded-full origin-bottom" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-mono text-muted-foreground">{angle}°</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Color Stops */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Color Stops</h3>
              <Button variant="outline" size="sm" onClick={addColorStop}>
                <Plus className="h-4 w-4 mr-1" />
                Add Stop
              </Button>
            </div>

            <div className="space-y-3">
              {colorStops.map((stop) => (
                <div key={stop.id} className="flex items-center gap-3">
                  <div className="relative">
                    <Input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                  </div>
                  <Input
                    type="text"
                    value={stop.color}
                    onChange={(e) => updateColorStop(stop.id, { color: e.target.value })}
                    className="flex-1 font-mono text-sm"
                  />
                  <div className="w-24">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={stop.position}
                        onChange={(e) => updateColorStop(stop.id, { position: Number(e.target.value) })}
                        min={0}
                        max={100}
                        className="text-sm"
                      />
                      <span className="text-muted-foreground text-sm">%</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeColorStop(stop.id)}
                    disabled={colorStops.length <= 2}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Gradient bar preview */}
            <div
              className="h-6 rounded-lg mt-4"
              style={{ background: `linear-gradient(90deg, ${colorStops.sort((a, b) => a.position - b.position).map((s) => `${s.color} ${s.position}%`).join(", ")})` }}
            />
          </div>

          {/* Presets */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-foreground">Presets</h3>
            <div className="grid grid-cols-4 gap-2">
              {[
                [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }],
                [{ color: "#f093fb", position: 0 }, { color: "#f5576c", position: 100 }],
                [{ color: "#4facfe", position: 0 }, { color: "#00f2fe", position: 100 }],
                [{ color: "#43e97b", position: 0 }, { color: "#38f9d7", position: 100 }],
                [{ color: "#fa709a", position: 0 }, { color: "#fee140", position: 100 }],
                [{ color: "#a8edea", position: 0 }, { color: "#fed6e3", position: 100 }],
                [{ color: "#ff0844", position: 0 }, { color: "#ffb199", position: 100 }],
                [{ color: "#30cfd0", position: 0 }, { color: "#330867", position: 100 }],
              ].map((preset, i) => (
                <button
                  key={i}
                  className="aspect-square rounded-lg border border-border hover:ring-2 ring-primary transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${preset.map((p) => `${p.color} ${p.position}%`).join(", ")})`
                  }}
                  onClick={() => setColorStops(preset.map((p, j) => ({ id: `preset-${j}`, ...p })))}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}
