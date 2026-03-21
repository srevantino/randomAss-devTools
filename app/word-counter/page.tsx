"use client"

import { useState, useEffect, useMemo } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Clock, Hash, Type, AlignLeft, BookOpen } from "lucide-react"

interface Stats {
  characters: number
  charactersNoSpaces: number
  words: number
  sentences: number
  paragraphs: number
  readingTime: number
  speakingTime: number
  avgWordLength: number
  longestWord: string
}

export default function WordCounterPage() {
  const [text, setText] = useState("")
  const [stats, setStats] = useState<Stats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
    avgWordLength: 0,
    longestWord: "",
  })

  const calculateStats = useMemo(() => {
    return (input: string): Stats => {
      const trimmed = input.trim()
      
      if (!trimmed) {
        return {
          characters: 0,
          charactersNoSpaces: 0,
          words: 0,
          sentences: 0,
          paragraphs: 0,
          readingTime: 0,
          speakingTime: 0,
          avgWordLength: 0,
          longestWord: "",
        }
      }

      const characters = input.length
      const charactersNoSpaces = input.replace(/\s/g, "").length
      
      const words = trimmed.split(/\s+/).filter(w => w.length > 0)
      const wordCount = words.length
      
      const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const paragraphs = trimmed.split(/\n\n+/).filter(p => p.trim().length > 0).length

      // Average reading speed: 200-250 words per minute
      const readingTime = Math.ceil(wordCount / 225)
      // Average speaking speed: 125-150 words per minute
      const speakingTime = Math.ceil(wordCount / 130)

      const totalWordLength = words.reduce((sum, word) => sum + word.replace(/[^a-zA-Z]/g, "").length, 0)
      const avgWordLength = wordCount > 0 ? Math.round((totalWordLength / wordCount) * 10) / 10 : 0

      const longestWord = words.reduce((longest, word) => {
        const cleanWord = word.replace(/[^a-zA-Z]/g, "")
        return cleanWord.length > longest.length ? cleanWord : longest
      }, "")

      return {
        characters,
        charactersNoSpaces,
        words: wordCount,
        sentences,
        paragraphs,
        readingTime,
        speakingTime,
        avgWordLength,
        longestWord,
      }
    }
  }, [])

  useEffect(() => {
    setStats(calculateStats(text))
  }, [text, calculateStats])

  const statCards = [
    { label: "Characters", value: stats.characters.toLocaleString(), icon: Type, color: "text-blue-400" },
    { label: "Characters (no spaces)", value: stats.charactersNoSpaces.toLocaleString(), icon: Type, color: "text-cyan-400" },
    { label: "Words", value: stats.words.toLocaleString(), icon: Hash, color: "text-emerald-400" },
    { label: "Sentences", value: stats.sentences.toLocaleString(), icon: AlignLeft, color: "text-amber-400" },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString(), icon: FileText, color: "text-orange-400" },
    { label: "Reading Time", value: `${stats.readingTime} min`, icon: Clock, color: "text-violet-400" },
    { label: "Speaking Time", value: `${stats.speakingTime} min`, icon: BookOpen, color: "text-pink-400" },
    { label: "Avg Word Length", value: `${stats.avgWordLength} chars`, icon: Type, color: "text-rose-400" },
  ]

  return (
    <ToolLayout
      title="Word & Character Counter"
      description="Paste text to see word count, character count, reading time, and more"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-border bg-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5 text-primary" />
                Enter Text
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste or type your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[400px] bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {statCards.map((stat) => (
              <Card key={stat.label} className="border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {stats.longestWord && (
            <Card className="border-border bg-card">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Longest Word</p>
                <p className="font-mono text-sm text-foreground break-all">{stats.longestWord}</p>
                <p className="text-xs text-muted-foreground mt-1">{stats.longestWord.length} characters</p>
              </CardContent>
            </Card>
          )}

          <Card className="border-border bg-card/50">
            <CardContent className="p-4 space-y-2 text-xs text-muted-foreground">
              <p><strong className="text-foreground">Reading time</strong> based on 225 words/min average</p>
              <p><strong className="text-foreground">Speaking time</strong> based on 130 words/min average</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  )
}
