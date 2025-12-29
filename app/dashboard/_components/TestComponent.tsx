"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

type Question = {
  id: number
  question: string
  options: Record<string, string>
  correctAnswer: string | string[]
  explanation: string
}

type TestComponentProps = {
  questionsFile?: string
}

export default function TestComponent({ questionsFile = "/questions.json" }: TestComponentProps) {
  const { isDarkMode, toggleTheme } = useTheme()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | string[]>>({})
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({})
  const [score, setScore] = useState(0)
  const [isTestComplete, setIsTestComplete] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fontSize, setFontSize] = useState(100) // percentage
  const [layout, setLayout] = useState<1 | 2>(1)
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0)
  const [incorrectQuestionIds, setIncorrectQuestionIds] = useState<number[]>([])
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null)
  const [showBatchSelection, setShowBatchSelection] = useState(true)

  // Theme colors
  const theme = {
    bg: isDarkMode ? "#000000" : "#ffffff",
    cardBg: isDarkMode ? "#121212" : "#f8f9fa",
    cardBorder: isDarkMode ? "#1A1A1A" : "#e0e0e0",
    text: isDarkMode ? "#ffffff" : "#000000",
    textMuted: isDarkMode ? "#9ca3af" : "#6b7280",
    optionBg: isDarkMode ? "#0A0A0A" : "#ffffff",
    optionBorder: isDarkMode ? "#1A1A1A" : "#d1d5db",
    optionHoverBorder: isDarkMode ? "#242424" : "#9ca3af",
    optionSelectedBg: isDarkMode ? "#242424" : "#e5e7eb",
    optionSelectedBorder: isDarkMode ? "#ffffff" : "#000000",
    buttonBg: isDarkMode ? "#0A0A0A" : "#ffffff",
    buttonBorder: isDarkMode ? "#1A1A1A" : "#d1d5db",
    buttonHoverBg: isDarkMode ? "#242424" : "#f3f4f6",
    submitButtonBg: isDarkMode ? "#ffffff" : "#000000",
    submitButtonText: isDarkMode ? "#000000" : "#ffffff",
    submitButtonHoverBg: isDarkMode ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)",
    explanationBg: isDarkMode ? "#0A0A0A" : "#f3f4f6",
    explanationBorder: isDarkMode ? "#1A1A1A" : "#d1d5db",
    warningBg: isDarkMode ? "#242424" : "#fef3c7",
    warningBorder: isDarkMode ? "#ffffff" : "#f59e0b",
    warningText: isDarkMode ? "#ffffff" : "#92400e",
  }

  useEffect(() => {
    if (!selectedBatch) return

    setLoading(true)
    fetch(selectedBatch)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error loading questions:", error)
        setLoading(false)
      })
  }, [selectedBatch])

  // Reset focused option when question changes
  useEffect(() => {
    setFocusedOptionIndex(0)
  }, [currentQuestionIndex])

  // Keyboard navigation
  useEffect(() => {
    if (isTestComplete || loading || questions.length === 0) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentQuestion = questions[currentQuestionIndex]
      const hasSubmitted = submittedAnswers[currentQuestion.id]
      const optionKeys = Object.keys(currentQuestion.options)
      const totalOptions = optionKeys.length

      // Arrow Down - move focus down
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setFocusedOptionIndex((prev) => Math.min(prev + 1, totalOptions))
      }

      // Arrow Up - move focus up
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setFocusedOptionIndex((prev) => Math.max(prev - 1, 0))
      }

      // Shift key - focus and activate Submit/Next button
      if (e.key === "Shift") {
        e.preventDefault()
        if (!hasSubmitted) {
          handleSubmit()
        } else {
          handleNext()
        }
      }

      // Q key - previous question
      if (e.key === "q" || e.key === "Q") {
        e.preventDefault()
        handlePrevious()
      }

      // E key - next question
      if (e.key === "e" || e.key === "E") {
        e.preventDefault()
        handleNext()
      }

      // Enter key or Arrow Right - select/submit
      if (e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault()

        // If focused on Submit/Next button (index === totalOptions)
        if (focusedOptionIndex === totalOptions) {
          if (!hasSubmitted) {
            handleSubmit()
          } else {
            handleNext()
          }
        } else {
          // Focused on an option
          if (!hasSubmitted) {
            const optionKey = optionKeys[focusedOptionIndex]
            const isMultiSelect = Array.isArray(currentQuestion.correctAnswer)

            if (isMultiSelect) {
              const current = (selectedAnswers[currentQuestion.id] as string[]) || []
              const isCurrentlySelected = current.includes(optionKey)
              handleMultiSelect(optionKey, !isCurrentlySelected)
            } else {
              handleSingleSelect(optionKey)
            }
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isTestComplete, loading, questions, currentQuestionIndex, submittedAnswers, focusedOptionIndex, selectedAnswers])

  // Batch selection screen
  if (showBatchSelection) {
    const batches = [
      { id: "/questions.json", name: "Main Questions", description: "Primary question set" },
      { id: "/questions1.json", name: "Batch 1", description: "Additional practice questions" },
      { id: "/questions2.json", name: "Batch 2", description: "Advanced questions" },
    ]

    return (
      <div className="min-h-screen p-8 flex items-center justify-center" style={{ backgroundColor: theme.bg, color: theme.text }}>
        <Card className="max-w-2xl w-full" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
          <CardHeader>
            <CardTitle className="text-3xl text-center" style={{ color: theme.text }}>Select Question Batch</CardTitle>
            <CardDescription className="text-center mt-2" style={{ color: theme.textMuted }}>
              Choose which set of questions you want to practice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {batches.map((batch) => (
              <div
                key={batch.id}
                className="p-6 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: theme.optionBg,
                  borderColor: theme.optionBorder,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.optionSelectedBorder
                  e.currentTarget.style.backgroundColor = theme.optionSelectedBg
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.optionBorder
                  e.currentTarget.style.backgroundColor = theme.optionBg
                }}
                onClick={() => {
                  setSelectedBatch(batch.id)
                  setShowBatchSelection(false)
                }}
              >
                <h3 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>{batch.name}</h3>
                <p style={{ color: theme.textMuted }}>{batch.description}</p>
              </div>
            ))}
            <div className="flex justify-center mt-6">
              <Button
                onClick={toggleTheme}
                variant="outline"
                style={{
                  backgroundColor: theme.buttonBg,
                  borderColor: theme.buttonBorder,
                  color: theme.text
                }}
              >
                {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.bg, color: theme.text }}>
        <p className="text-xl">Loading test...</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: theme.bg, color: theme.text }}>
        <p className="text-xl">No questions available</p>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const isMultiSelect = Array.isArray(currentQuestion.correctAnswer)
  const hasSubmitted = submittedAnswers[currentQuestion.id]
  const currentAnswer = selectedAnswers[currentQuestion.id]

  const handleSingleSelect = (value: string) => {
    if (!hasSubmitted) {
      setSelectedAnswers({
        ...selectedAnswers,
        [currentQuestion.id]: value,
      })
    }
  }

  const handleMultiSelect = (optionKey: string, checked: boolean) => {
    if (!hasSubmitted) {
      const current = (selectedAnswers[currentQuestion.id] as string[]) || []
      if (checked) {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQuestion.id]: [...current, optionKey],
        })
      } else {
        setSelectedAnswers({
          ...selectedAnswers,
          [currentQuestion.id]: current.filter((k) => k !== optionKey),
        })
      }
    }
  }

  const checkAnswer = () => {
    if (!currentAnswer) return false

    if (isMultiSelect) {
      const correctAnswers = currentQuestion.correctAnswer as string[]
      const userAnswers = currentAnswer as string[]
      return (
        correctAnswers.length === userAnswers.length &&
        correctAnswers.every((ans) => userAnswers.includes(ans))
      )
    } else {
      return currentAnswer === currentQuestion.correctAnswer
    }
  }

  const handleSubmit = () => {
    const isCorrect = checkAnswer()
    setSubmittedAnswers({
      ...submittedAnswers,
      [currentQuestion.id]: true,
    })

    if (isCorrect) {
      setScore(score + 1)
    } else {
      // Track incorrect answers
      if (!incorrectQuestionIds.includes(currentQuestion.id)) {
        setIncorrectQuestionIds([...incorrectQuestionIds, currentQuestion.id])
      }
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsTestComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const restartTest = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setSubmittedAnswers({})
    setScore(0)
    setIsTestComplete(false)
    setShowOnlyIncorrect(false)
    setIncorrectQuestionIds([])
    setShowBatchSelection(true)
    setSelectedBatch(null)
  }

  const restartIncorrectOnly = () => {
    if (incorrectQuestionIds.length === 0) return

    // Filter questions to only show incorrect ones
    const incorrectQuestions = questions.filter((q) => incorrectQuestionIds.includes(q.id))
    setQuestions(incorrectQuestions)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setSubmittedAnswers({})
    setScore(0)
    setIsTestComplete(false)
    setShowOnlyIncorrect(true)
    setIncorrectQuestionIds([])
  }

  const getOptionClassName = (optionKey: string, index: number) => {
    const isFocused = focusedOptionIndex === index

    if (!hasSubmitted) {
      const isSelected = isMultiSelect
        ? (currentAnswer as string[] || []).includes(optionKey)
        : currentAnswer === optionKey

      if (isSelected) {
        return `p-4 rounded-lg border-2 transition-all cursor-pointer`
      }
      if (isFocused) {
        return `p-4 rounded-lg border-2 transition-all cursor-pointer border-blue-500 ring-2 ring-blue-500/50`
      }
      return `p-4 rounded-lg border-2 transition-all cursor-pointer`
    }

    const correctAnswers = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer
      : [currentQuestion.correctAnswer]

    const isCorrectOption = correctAnswers.includes(optionKey)
    const isSelectedOption = isMultiSelect
      ? (currentAnswer as string[] || []).includes(optionKey)
      : currentAnswer === optionKey

    if (isCorrectOption) {
      return "p-4 rounded-lg border-2 border-green-500 bg-green-500/10"
    }

    if (isSelectedOption && !isCorrectOption) {
      return "p-4 rounded-lg border-2 border-red-500 bg-red-500/10"
    }

    return "p-4 rounded-lg border-2"
  }

  const getOptionStyle = (optionKey: string) => {
    if (!hasSubmitted) {
      const isSelected = isMultiSelect
        ? (currentAnswer as string[] || []).includes(optionKey)
        : currentAnswer === optionKey

      return {
        backgroundColor: isSelected ? theme.optionSelectedBg : theme.optionBg,
        borderColor: isSelected ? theme.optionSelectedBorder : theme.optionBorder,
      }
    }

    // After submission - show correct/incorrect with green/red
    const correctAnswers = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer
      : [currentQuestion.correctAnswer]

    const isCorrectOption = correctAnswers.includes(optionKey)
    const isSelectedOption = isMultiSelect
      ? (currentAnswer as string[] || []).includes(optionKey)
      : currentAnswer === optionKey

    if (isCorrectOption) {
      return {
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderColor: "#22c55e",
      }
    }

    if (isSelectedOption && !isCorrectOption) {
      return {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "#ef4444",
      }
    }

    return {
      backgroundColor: theme.optionBg,
      borderColor: theme.optionBorder,
    }
  }

  if (isTestComplete) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="min-h-screen p-8" style={{ backgroundColor: theme.bg, color: theme.text }}>
        <Card className="max-w-2xl mx-auto" style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
          <CardHeader>
            <CardTitle className="text-3xl text-center" style={{ color: theme.text }}>Test Complete!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="text-6xl font-bold" style={{ color: theme.text }}>{percentage}%</div>
            <p className="text-2xl" style={{ color: theme.textMuted }}>
              You scored {score} out of {questions.length}
            </p>
            {incorrectQuestionIds.length > 0 && (
              <p className="text-lg" style={{ color: theme.textMuted }}>
                {incorrectQuestionIds.length} incorrect answer{incorrectQuestionIds.length !== 1 ? 's' : ''}
              </p>
            )}
            <div className="space-y-3">
              <Button
                onClick={restartTest}
                size="lg"
                className="w-full"
                style={{ backgroundColor: theme.submitButtonBg, color: theme.submitButtonText }}
              >
                Restart Full Test
              </Button>
              {incorrectQuestionIds.length > 0 && (
                <Button onClick={restartIncorrectOnly} size="lg" className="w-full bg-red-600 text-white hover:bg-red-700">
                  Retry Incorrect Questions Only ({incorrectQuestionIds.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (layout === 2) {
    // Layout 2: Navigation on sides
    return (
      <div className={cn("min-h-screen", focusMode ? "p-0" : "p-8")} style={{ fontSize: `${fontSize}%`, backgroundColor: theme.bg, color: theme.text }}>
        <div className="max-w-7xl mx-auto">
          {!focusMode && (
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-md opacity-30 font-bold"></h1>
              <div className="text-lg" style={{ color: theme.textMuted }}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
          )}

          <div className="flex gap-6 items-start">
            {/* Left Navigation */}
            <div className="flex-shrink-0">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="h-[600px] w-20"
                style={{
                  fontSize: '2rem',
                  backgroundColor: theme.buttonBg,
                  borderColor: theme.buttonBorder,
                  color: theme.text
                }}
              >
                ←
              </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <Card style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
                <CardHeader>
                  <div
                    className="leading-relaxed text-xl mb-2 whitespace-pre-line"
                    style={{
                      fontSize: "1.35em",
                      lineHeight: "1.7",
                      letterSpacing: "0.01em",
                      color: theme.text
                    }}
                  >
                    {currentQuestion.question}
                  </div>
                  {isMultiSelect && (
                    <CardDescription className="font-bold mt-3 flex items-center gap-2" style={{ fontSize: '1.125em' }}>
                      <span
                        className="px-3 py-1 rounded-full border-2"
                        style={{
                          backgroundColor: theme.warningBg,
                          borderColor: theme.warningBorder,
                          color: theme.warningText
                        }}
                      >
                        ⚠️ SELECT {(currentQuestion.correctAnswer as string[]).length} ANSWERS
                      </span>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {isMultiSelect ? (
                    <div className="space-y-3">
                      {Object.entries(currentQuestion.options).map(([key, value], index) => (
                        <div
                          key={key}
                          className={getOptionClassName(key, index)}
                          style={getOptionStyle(key)}
                          onClick={() => {
                            if (!hasSubmitted) {
                              const isCurrentlySelected = (currentAnswer as string[] || []).includes(key)
                              handleMultiSelect(key, !isCurrentlySelected)
                            }
                          }}
                        >
                          <div className="flex items-start space-x-3" style={{ fontSize: '1.1em' }}>
                            <div className="flex-1">
                              <span className="font-semibold" style={{ color: theme.textMuted }}>{key}:</span>{" "}
                              <span style={{ color: theme.text }}>{value}</span>
                            </div>
                            {(currentAnswer as string[] || []).includes(key) && (
                              <span className="text-xl" style={{ color: theme.text }}>✓</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Object.entries(currentQuestion.options).map(([key, value], index) => (
                        <div
                          key={key}
                          className={getOptionClassName(key, index)}
                          style={getOptionStyle(key)}
                          onClick={() => {
                            if (!hasSubmitted) {
                              handleSingleSelect(key)
                            }
                          }}
                        >
                          <div className="flex items-start space-x-3" style={{ fontSize: '1.1em' }}>
                            <div className="flex-1">
                              <span className="font-semibold" style={{ color: theme.textMuted }}>{key}:</span>{" "}
                              <span style={{ color: theme.text }}>{value}</span>
                            </div>
                            {currentAnswer === key && (
                              <span className="text-xl" style={{ color: theme.text }}>✓</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {hasSubmitted && (
                    <div
                      className="mt-6 p-6 rounded-lg border-2"
                      style={{
                        backgroundColor: theme.explanationBg,
                        borderColor: theme.explanationBorder
                      }}
                    >
                      <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>Explanation:</h3>
                      <p className="leading-relaxed" style={{ color: theme.textMuted }}>{currentQuestion.explanation}</p>
                      <div className="mt-4 text-center">
                        {checkAnswer() ? (
                          <span className="text-2xl font-bold text-green-500">✓ Correct!</span>
                        ) : (
                          <span className="text-2xl font-bold text-red-500">✗ Incorrect</span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-center items-center pt-4">
                    {!hasSubmitted ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={!currentAnswer || (isMultiSelect && (currentAnswer as string[]).length === 0)}
                        className={cn(
                          focusedOptionIndex === Object.keys(currentQuestion.options).length && "ring-4 ring-blue-500"
                        )}
                        style={{
                          backgroundColor: theme.submitButtonBg,
                          color: theme.submitButtonText
                        }}
                      >
                        Submit Answer
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNext}
                        className={cn(
                          focusedOptionIndex === Object.keys(currentQuestion.options).length && "ring-4 ring-blue-500"
                        )}
                        style={{
                          backgroundColor: theme.submitButtonBg,
                          color: theme.submitButtonText
                        }}
                      >
                        {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Test"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Navigation */}
            <div className="flex-shrink-0">
              <Button
                onClick={handleNext}
                disabled={!hasSubmitted && currentQuestionIndex === questions.length - 1}
                variant="outline"
                className="h-[600px] w-20"
                style={{
                  fontSize: '2rem',
                  backgroundColor: theme.buttonBg,
                  borderColor: theme.buttonBorder,
                  color: theme.text
                }}
              >
                →
              </Button>
            </div>
          </div>

          {!focusMode && (
            <>
              <div className="flex justify-center gap-2 mt-6">
                {questions.map((_, index) => {
                  const question = questions[index]
                  const isSubmitted = submittedAnswers[question.id]
                  const isIncorrect = incorrectQuestionIds.includes(question.id)

                  let dotColor = theme.optionBorder
                  if (index === currentQuestionIndex) {
                    dotColor = theme.optionSelectedBorder
                  } else if (isSubmitted) {
                    dotColor = isIncorrect ? "#ef4444" : "#22c55e"
                  }

                  return (
                    <div
                      key={index}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: dotColor }}
                    />
                  )
                })}
              </div>

              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  onClick={() => setFontSize(Math.max(60, fontSize - 10))}
                  variant="outline"
                  className="w-12 h-12 text-2xl"
                  style={{
                    backgroundColor: theme.buttonBg,
                    borderColor: theme.buttonBorder,
                    color: theme.text
                  }}
                >
                  −
                </Button>
                <span className="text-sm" style={{ color: theme.text }}>Font Size: {fontSize}%</span>
                <Button
                  onClick={() => setFontSize(Math.min(200, fontSize + 10))}
                  variant="outline"
                  className="w-12 h-12 text-2xl"
                  style={{
                    backgroundColor: theme.buttonBg,
                    borderColor: theme.buttonBorder,
                    color: theme.text
                  }}
                >
                  +
                </Button>
              </div>

              <div className="flex justify-center items-center gap-4 mt-4">
                <Button
                  onClick={() => setLayout(1)}
                  variant="outline"
                  style={{
                    backgroundColor: theme.buttonBg,
                    borderColor: theme.buttonBorder,
                    color: theme.text
                  }}
                >
                  Layout 1
                </Button>
                <Button
                  onClick={() => setLayout(2)}
                  variant="outline"
                  style={{
                    backgroundColor: theme.buttonBg,
                    borderColor: theme.optionSelectedBorder,
                    borderWidth: '2px',
                    color: theme.text
                  }}
                >
                  Layout 2
                </Button>
                <Button
                  onClick={() => setFocusMode(!focusMode)}
                  variant="outline"
                  style={{
                    backgroundColor: theme.buttonBg,
                    borderColor: focusMode ? theme.optionSelectedBorder : theme.buttonBorder,
                    borderWidth: focusMode ? '2px' : '1px',
                    color: theme.text
                  }}
                >
                  {focusMode ? "Exit Focus" : "Focus Mode"}
                </Button>
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  style={{
                    backgroundColor: theme.buttonBg,
                    borderColor: theme.buttonBorder,
                    color: theme.text
                  }}
                >
                  {isDarkMode ? "☀️ Light" : "🌙 Dark"}
                </Button>
              </div>
            </>
          )}
          {focusMode && (
            <Button
              onClick={() => setFocusMode(false)}
              variant="outline"
              className="fixed top-4 right-4 z-50"
              style={{
                backgroundColor: theme.buttonBg,
                borderColor: theme.buttonBorder,
                color: theme.text
              }}
            >
              Exit Focus Mode
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Layout 1: Original layout with bottom navigation
  return (
    <div className={cn("min-h-screen", focusMode ? "p-0" : "p-8")} style={{ fontSize: `${fontSize}%`, backgroundColor: theme.bg, color: theme.text }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {!focusMode && (
          <div className="flex justify-between items-center">
            <h1 className="text-md opacity-30 font-bold"></h1>
            <div className="text-lg" style={{ color: theme.textMuted }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        )}

        <Card style={{ backgroundColor: theme.cardBg, borderColor: theme.cardBorder }}>
          <CardHeader>
            <div className="font-semibold leading-tight" style={{ fontSize: '1.25em', color: theme.text }}>
              {currentQuestion.question}
            </div>
            {isMultiSelect && (
              <CardDescription className="font-bold mt-3 flex items-center gap-2" style={{ fontSize: '1.125em' }}>
                <span
                  className="px-3 py-1 rounded-full border-2"
                  style={{
                    backgroundColor: theme.warningBg,
                    borderColor: theme.warningBorder,
                    color: theme.warningText
                  }}
                >
                  ⚠️ SELECT {(currentQuestion.correctAnswer as string[]).length} ANSWERS
                </span>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isMultiSelect ? (
              <div className="space-y-3">
                {Object.entries(currentQuestion.options).map(([key, value], index) => (
                  <div
                    key={key}
                    className={getOptionClassName(key, index)}
                    style={getOptionStyle(key)}
                    onClick={() => {
                      if (!hasSubmitted) {
                        const isCurrentlySelected = (currentAnswer as string[] || []).includes(key)
                        handleMultiSelect(key, !isCurrentlySelected)
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3" style={{ fontSize: '1.1em' }}>
                      <div className="flex-1">
                        <span className="font-semibold" style={{ color: theme.textMuted }}>{key}:</span>{" "}
                        <span style={{ color: theme.text }}>{value}</span>
                      </div>
                      {(currentAnswer as string[] || []).includes(key) && (
                        <span className="text-xl" style={{ color: theme.text }}>✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(currentQuestion.options).map(([key, value], index) => (
                  <div
                    key={key}
                    className={getOptionClassName(key, index)}
                    style={getOptionStyle(key)}
                    onClick={() => {
                      if (!hasSubmitted) {
                        handleSingleSelect(key)
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3" style={{ fontSize: '1.1em' }}>
                      <div className="flex-1">
                        <span className="font-semibold" style={{ color: theme.textMuted }}>{key}:</span>{" "}
                        <span style={{ color: theme.text }}>{value}</span>
                      </div>
                      {currentAnswer === key && (
                        <span className="text-xl" style={{ color: theme.text }}>✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasSubmitted && (
              <div
                className="mt-6 p-6 rounded-lg border-2"
                style={{
                  backgroundColor: theme.explanationBg,
                  borderColor: theme.explanationBorder
                }}
              >
                <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>Explanation:</h3>
                <p className="leading-relaxed" style={{ color: theme.textMuted }}>{currentQuestion.explanation}</p>
                <div className="mt-4 text-center">
                  {checkAnswer() ? (
                    <span className="text-2xl font-bold text-green-500">✓ Correct!</span>
                  ) : (
                    <span className="text-2xl font-bold text-red-500">✗ Incorrect</span>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                style={{
                  backgroundColor: theme.buttonBg,
                  borderColor: theme.buttonBorder,
                  color: theme.text
                }}
              >
                Previous
              </Button>

              {!hasSubmitted ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!currentAnswer || (isMultiSelect && (currentAnswer as string[]).length === 0)}
                  className={cn(
                    focusedOptionIndex === Object.keys(currentQuestion.options).length && "ring-4 ring-blue-500"
                  )}
                  style={{
                    backgroundColor: theme.submitButtonBg,
                    color: theme.submitButtonText
                  }}
                >
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className={cn(
                    focusedOptionIndex === Object.keys(currentQuestion.options).length && "ring-4 ring-blue-500"
                  )}
                  style={{
                    backgroundColor: theme.submitButtonBg,
                    color: theme.submitButtonText
                  }}
                >
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Test"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {!focusMode && (
          <>
            <div className="flex justify-center gap-2">
              {questions.map((_, index) => {
                const question = questions[index]
                const isSubmitted = submittedAnswers[question.id]
                const isIncorrect = incorrectQuestionIds.includes(question.id)

                let dotColor = theme.optionBorder
                if (index === currentQuestionIndex) {
                  dotColor = theme.optionSelectedBorder
                } else if (isSubmitted) {
                  dotColor = isIncorrect ? "#ef4444" : "#22c55e"
                }

                return (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                )
              })}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                onClick={() => setFontSize(Math.max(60, fontSize - 10))}
                variant="outline"
                className="w-12 h-12 text-2xl"
                style={{
                  backgroundColor: theme.buttonBg,
                  borderColor: theme.buttonBorder,
                  color: theme.text
                }}
              >
                −
              </Button>
              <span className="text-sm" style={{ color: theme.text }}>Font Size: {fontSize}%</span>
              <Button
                onClick={() => setFontSize(Math.min(200, fontSize + 10))}
                variant="outline"
                className="w-12 h-12 text-2xl"
                style={{
                  backgroundColor: theme.buttonBg,
                  borderColor: theme.buttonBorder,
                  color: theme.text
                }}
              >
                +
              </Button>
            </div>

            <div className="flex justify-center items-center gap-4 mt-4">
              <Button
                onClick={() => setLayout(1)}
                variant="outline"
                style={{
                  backgroundColor: theme.buttonBg,
                  borderColor: theme.optionSelectedBorder,
                  borderWidth: '2px',
                  color: theme.text
                }}
              >
                Layout 1
              </Button>
              <Button
                onClick={() => setLayout(2)}
                variant="outline"
                style={{
                  backgroundColor: theme.buttonBg,
                  borderColor: theme.buttonBorder,
                  color: theme.text
                }}
              >
                Layout 2
              </Button>
              <Button
                onClick={() => setFocusMode(!focusMode)}
                variant="outline"
                style={{
                  backgroundColor: theme.buttonBg,
                  borderColor: focusMode ? theme.optionSelectedBorder : theme.buttonBorder,
                  borderWidth: focusMode ? '2px' : '1px',
                  color: theme.text
                }}
              >
                {focusMode ? "Exit Focus" : "Focus Mode"}
              </Button>
              <Button
                onClick={toggleTheme}
                variant="outline"
                style={{
                  backgroundColor: theme.buttonBg,
                  borderColor: theme.buttonBorder,
                  color: theme.text
                }}
              >
                {isDarkMode ? "☀️ Light" : "🌙 Dark"}
              </Button>
            </div>
          </>
        )}
        {focusMode && (
          <Button
            onClick={() => setFocusMode(false)}
            variant="outline"
            className="fixed top-4 right-4 z-50"
            style={{
              backgroundColor: theme.buttonBg,
              borderColor: theme.buttonBorder,
              color: theme.text
            }}
          >
            Exit Focus Mode
          </Button>
        )}
      </div>
    </div>
  )
}
