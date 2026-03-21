"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { RotateCcw, Play, Timer, Target, Zap, Trophy } from "lucide-react"

const paragraphs = {
  easy: [
    "The quick brown fox jumps over the lazy dog. This simple sentence contains every letter of the alphabet. It has been used for typing practice for many years.",
    "A warm cup of coffee sits on the desk. The morning sun shines through the window. Birds sing outside as a new day begins.",
    "The cat sleeps on the soft pillow. It dreams of chasing mice in the garden. A gentle breeze moves the curtains nearby.",
    "Books line the wooden shelves along the wall. Each one holds a different story waiting to be read. The room smells of old paper.",
    "Rain falls gently on the roof above. The sound is calming and peaceful. A good day to stay inside and read a book.",
  ],
  medium: [
    "Programming is the art of telling a computer what to do through a sequence of instructions. Each line of code contributes to the larger functionality of the application being developed.",
    "The development of artificial intelligence has transformed how we interact with technology. Machine learning algorithms now power everything from search engines to personal assistants.",
    "Version control systems like Git have revolutionized collaborative software development. They allow multiple developers to work on the same codebase without conflicts.",
    "Cloud computing has changed the landscape of infrastructure management. Companies can now scale their applications dynamically based on real-time demand patterns.",
    "Cybersecurity remains a critical concern as more systems move online. Protecting sensitive data requires constant vigilance and updated security protocols.",
  ],
  hard: [
    "The implementation of microservices architecture necessitates careful consideration of inter-service communication patterns, including synchronous RESTful APIs, asynchronous message queues, and event-driven architectures utilizing technologies such as Apache Kafka or RabbitMQ.",
    "Containerization through Docker and orchestration via Kubernetes have fundamentally transformed deployment strategies, enabling organizations to achieve unprecedented levels of scalability, reproducibility, and infrastructure-as-code capabilities across heterogeneous environments.",
    "Functional programming paradigms, characterized by immutability, pure functions, and declarative constructs, offer significant advantages in concurrent systems by eliminating race conditions and simplifying reasoning about program behavior.",
    "The integration of continuous integration and continuous deployment pipelines automates the software delivery process, reducing manual intervention while simultaneously improving code quality through automated testing frameworks and static analysis tools.",
    "Distributed systems introduce complex challenges including network partitioning, eventual consistency, and the CAP theorem constraints, requiring sophisticated approaches to data replication, consensus algorithms, and fault tolerance mechanisms.",
  ],
}

type Difficulty = "easy" | "medium" | "hard"

export default function TypingTestPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [text, setText] = useState("")
  const [input, setInput] = useState("")
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [errors, setErrors] = useState<Set<number>>(new Set())
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const getRandomParagraph = useCallback((diff: Difficulty) => {
    const paragraphList = paragraphs[diff]
    return paragraphList[Math.floor(Math.random() * paragraphList.length)]
  }, [])

  useEffect(() => {
    setText(getRandomParagraph(difficulty))
  }, [difficulty, getRandomParagraph])

  useEffect(() => {
    if (started && !finished && startTime) {
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        setElapsedTime(elapsed)

        // Calculate WPM
        const words = input.trim().split(/\s+/).filter(Boolean).length
        const minutes = elapsed / 60
        if (minutes > 0) {
          setWpm(Math.round(words / minutes))
        }
      }, 100)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [started, finished, startTime, input])

  const handleStart = () => {
    setText(getRandomParagraph(difficulty))
    setInput("")
    setStarted(true)
    setFinished(false)
    setStartTime(Date.now())
    setWpm(0)
    setAccuracy(100)
    setElapsedTime(0)
    setErrors(new Set())
    inputRef.current?.focus()
  }

  const handleReset = () => {
    setInput("")
    setStarted(false)
    setFinished(false)
    setStartTime(null)
    setWpm(0)
    setAccuracy(100)
    setElapsedTime(0)
    setErrors(new Set())
    setText(getRandomParagraph(difficulty))
  }

  const handleInputChange = (value: string) => {
    if (!started || finished) return

    setInput(value)

    // Check for errors
    const newErrors = new Set<number>()
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        newErrors.add(i)
      }
    }
    setErrors(newErrors)

    // Calculate accuracy
    const totalTyped = value.length
    const correctChars = totalTyped - newErrors.size
    const acc = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100
    setAccuracy(acc)

    // Check if finished
    if (value.length >= text.length) {
      setFinished(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const renderText = () => {
    return text.split("").map((char, index) => {
      let className = "text-muted-foreground"

      if (index < input.length) {
        if (errors.has(index)) {
          className = "text-red-400 bg-red-400/20"
        } else {
          className = "text-primary"
        }
      } else if (index === input.length) {
        className = "text-foreground bg-primary/20 animate-pulse"
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      )
    })
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <ToolLayout
      title="Typing Speed Test"
      description="Test your typing speed with random prompts. Track WPM, accuracy, and see highlighted errors."
    >
      <div className="space-y-8">
        {/* Controls */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Difficulty
                </label>
                <div className="flex gap-2">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
                    <Button
                      key={level}
                      variant={difficulty === level ? "default" : "secondary"}
                      size="sm"
                      onClick={() => {
                        setDifficulty(level)
                        handleReset()
                      }}
                      disabled={started && !finished}
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {!started ? (
                  <Button onClick={handleStart}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Test
                  </Button>
                ) : (
                  <Button onClick={handleReset} variant="secondary">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  WPM
                </p>
                <p className="text-2xl font-bold text-foreground">{wpm}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Accuracy
                </p>
                <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center">
                <Timer className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Time
                </p>
                <p className="text-2xl font-bold text-foreground font-mono">
                  {formatTime(elapsedTime)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-400/10 flex items-center justify-center">
                <span className="text-lg font-bold text-red-400">{errors.size}</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Errors
                </p>
                <p className="text-2xl font-bold text-foreground">{errors.size}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Typing Area */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 space-y-6">
            {/* Text to type */}
            <div
              className={cn(
                "p-4 rounded-lg bg-secondary/30 font-mono text-lg leading-relaxed",
                !started && "opacity-50"
              )}
            >
              {renderText()}
            </div>

            {/* Input */}
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                disabled={!started || finished}
                placeholder={
                  !started
                    ? "Click 'Start Test' to begin..."
                    : "Start typing..."
                }
                className={cn(
                  "w-full h-32 p-4 rounded-lg font-mono text-lg leading-relaxed resize-none",
                  "bg-input border border-border text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                  "placeholder:text-muted-foreground",
                  finished && "opacity-50"
                )}
                spellCheck={false}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>
                  {input.length} / {text.length} characters
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-100"
                  style={{
                    width: `${Math.min((input.length / text.length) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {finished && (
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Test Complete!
              </h3>
              <p className="text-muted-foreground mb-6">
                Here are your final results
              </p>

              <div className="grid gap-4 sm:grid-cols-3 max-w-md mx-auto">
                <div className="p-4 rounded-lg bg-card">
                  <p className="text-3xl font-bold text-primary">{wpm}</p>
                  <p className="text-sm text-muted-foreground">Words per minute</p>
                </div>
                <div className="p-4 rounded-lg bg-card">
                  <p className="text-3xl font-bold text-emerald-400">{accuracy}%</p>
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                </div>
                <div className="p-4 rounded-lg bg-card">
                  <p className="text-3xl font-bold text-foreground font-mono">
                    {formatTime(elapsedTime)}
                  </p>
                  <p className="text-sm text-muted-foreground">Time</p>
                </div>
              </div>

              <Button onClick={handleStart} className="mt-6">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </ToolLayout>
  )
}
