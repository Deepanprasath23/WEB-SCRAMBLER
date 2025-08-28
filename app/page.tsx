"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Globe, Shuffle, Download, Sparkles, Brain } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

type ScrambleType =  "sentences" | "links" 

interface ScrambleResult {
  originalText: string
  scrambledText: string
  url: string
  scrambleType: ScrambleType
}

export default function WebScrambler() {
  const [url, setUrl] = useState("")
  const [scrambleType, setScrambleType] = useState<ScrambleType>("words")
  const [result, setResult] = useState<ScrambleResult | null>(null)
  const [summary, setSummary] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [error, setError] = useState("")

  const handleScramble = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL")
      return
    }

    setLoading(true)
    setError("")
    setSummary("")

    try {
      const response = await fetch("/api/scramble", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, scrambleType }),
      })

      if (!response.ok) {
        throw new Error("Failed to scramble content")
      }

      const data = await response.json()
      setResult(data)

      // Generate AI summary
      if (data.originalText && data.originalText.trim().length > 0) {
        setSummaryLoading(true)
        try {
          const summaryResponse = await fetch("/api/summary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: data.originalText }),
          })

          if (summaryResponse.ok) {
            const summaryData = await summaryResponse.json()
            setSummary(summaryData.summary)
          }
        } catch (summaryError) {
          console.error("Failed to generate summary:", summaryError)
        } finally {
          setSummaryLoading(false)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const exportResult = () => {
    if (!result) return

    const exportData = {
      url: result.url,
      method: result.scrambleType,
      date: new Date().toISOString(),
      originalText: result.originalText,
      scrambledText: result.scrambledText,
      aiSummary: summary,
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `scramble-result-${Date.now()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Enhanced Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                  <Shuffle className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-heading bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Web Scrambler
                </h1>
                <p className="text-muted-foreground font-medium">Transform website text with AI-powered analysis</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Input Section */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="font-heading flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  URL Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="url" className="text-sm font-semibold text-foreground">
                    Website URL
                  </label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-input border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-200"
                  />
                </div>

                <div className="space-y-3">
                  <label htmlFor="scramble-type" className="text-sm font-semibold text-foreground">
                    Scrambling Method
                  </label>
                  <Select value={scrambleType} onValueChange={(value: ScrambleType) => setScrambleType(value)}>
                    <SelectTrigger className="bg-input border-border/50 focus:border-primary/50 focus:ring-primary/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {/* <SelectItem value="letters">🔤 Scramble Letters</SelectItem>
                      <SelectItem value="words">📝 Scramble Words</SelectItem> */}
                      <SelectItem value="sentences">📄 Scramble Sentences</SelectItem>
                      <SelectItem value="links">🔗 Scramble Links</SelectItem>
                      {/* <SelectItem value="images">🖼️ Scramble Images</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-sm text-destructive font-medium">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleScramble}
                  disabled={loading || !url.trim()}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing & Scrambling...
                    </>
                  ) : (
                    <>
                      <Shuffle className="w-5 h-5 mr-2" />
                      Scramble Text
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {result ? (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-heading text-foreground">Results</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportResult}
                    className="flex items-center gap-2 border-border/50 hover:bg-accent/10 hover:border-accent/50 transition-all duration-200 bg-transparent"
                  >
                    <Download className="w-4 h-4" />
                    Export Result
                  </Button>
                </div>

                {/* AI Summary Card */}
                {(summary || summaryLoading) && (
                  <Card className="border-accent/20 bg-gradient-to-r from-accent/5 to-primary/5 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="font-heading flex items-center gap-3 text-lg">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <Brain className="w-5 h-5 text-accent" />
                        </div>
                        AI Content Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {summaryLoading ? (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Generating AI summary...</span>
                        </div>
                      ) : (
                        <p className="text-sm text-foreground leading-relaxed">{summary}</p>
                      )}
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="font-heading text-lg text-foreground">Original Text</CardTitle>
                      <p className="text-sm text-muted-foreground font-medium">From: {result.url}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/50 border border-border/30 p-4 rounded-lg max-h-64 overflow-y-auto">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {result.originalText}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-accent/20 shadow-lg bg-card/80 backdrop-blur-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="font-heading text-lg text-foreground">Scramble</CardTitle>
                      <p className="text-sm text-accent font-medium">
                        Method: {result.scrambleType.charAt(0).toUpperCase() + result.scrambleType.slice(1)}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-br from-accent/5 to-primary/5 border border-accent/20 p-4 rounded-lg max-h-64 overflow-y-auto">
                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                          {result.scrambledText}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card className="border-border/50 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="flex items-center justify-center py-16">
                  <div className="text-center space-y-4">
                    <div className="relative mx-auto">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                        <Shuffle className="w-10 h-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="font-heading text-xl text-foreground">Ready to Scramble</h3>
                    <p className="text-muted-foreground max-w-md leading-relaxed">
                      Enter a website URL and choose your scrambling method to get started. AI-powered analysis will
                      provide insights about the content.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
