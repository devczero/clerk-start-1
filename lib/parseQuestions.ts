/**
 * Utility to parse various question formats from text files into standardized JSON
 *
 * Usage:
 * 1. Place your qna.txt or qna2.txt in the /public folder
 * 2. Parse it using this utility
 * 3. Save the output as questions.json or questions2.json
 * 4. Pass the file path to TestComponent
 *
 * Example formats supported:
 * - Structured JSON format (already parsed)
 * - Plain text with options labeled A, B, C, D
 * - Mixed format with explanations
 */

export type Question = {
  id: number
  question: string
  options: Record<string, string>
  correctAnswer: string | string[]
  explanation: string
}

/**
 * Parses raw text content into structured question format
 * This function handles multiple input formats
 */
export function parseQuestionsFromText(text: string): Question[] {
  const questions: Question[] = []

  // Try parsing as JSON first
  try {
    const parsed = JSON.parse(text)
    if (Array.isArray(parsed)) {
      return parsed
    }
  } catch {
    // Not JSON, continue with text parsing
  }

  // Split by question blocks (looking for patterns like "Question" or numbers followed by period)
  const blocks = text.split(/\n\n+/)

  let currentId = 1

  for (const block of blocks) {
    if (!block.trim()) continue

    try {
      const question = parseQuestionBlock(block, currentId)
      if (question) {
        questions.push(question)
        currentId++
      }
    } catch (error) {
      console.warn(`Failed to parse question block: ${error}`)
      continue
    }
  }

  return questions
}

function parseQuestionBlock(block: string, id: number): Question | null {
  const lines = block.split('\n').map(l => l.trim()).filter(l => l)

  if (lines.length === 0) return null

  let question = ''
  const options: Record<string, string> = {}
  let correctAnswer: string | string[] = ''
  let explanation = ''

  let currentSection: 'question' | 'options' | 'answer' | 'explanation' = 'question'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Detect section changes
    if (line.toLowerCase().startsWith('options') || line.match(/^[A-E]\)/)) {
      currentSection = 'options'
      if (line.toLowerCase().startsWith('options')) continue
    } else if (line.toLowerCase().includes('correct answer')) {
      currentSection = 'answer'
    } else if (line.toLowerCase().includes('explanation')) {
      currentSection = 'explanation'
      continue
    }

    // Process based on current section
    switch (currentSection) {
      case 'question':
        question += (question ? ' ' : '') + line
        break

      case 'options':
        // Match patterns like "A)" or "A:" or "A."
        const optionMatch = line.match(/^([A-E])[\):\.]\s*(.+)/)
        if (optionMatch) {
          options[optionMatch[1]] = optionMatch[2].trim()
        } else if (line.startsWith('-') && Object.keys(options).length > 0) {
          // Continuation of previous option
          const lastKey = Object.keys(options).pop()!
          options[lastKey] += ' ' + line.substring(1).trim()
        }
        break

      case 'answer':
        // Extract answer(s)
        const answerMatch = line.match(/([A-E](?:,\s*[A-E])*)/g)
        if (answerMatch) {
          const answers = answerMatch[0].split(',').map(a => a.trim())
          correctAnswer = answers.length > 1 ? answers : answers[0]
        }
        break

      case 'explanation':
        explanation += (explanation ? ' ' : '') + line
        break
    }
  }

  // Validate we have minimum required fields
  if (!question || Object.keys(options).length === 0 || !correctAnswer) {
    return null
  }

  return {
    id,
    question,
    options,
    correctAnswer,
    explanation: explanation || 'No explanation provided.'
  }
}

/**
 * Validates that questions follow the expected format
 */
export function validateQuestions(questions: Question[]): boolean {
  return questions.every(q => {
    return (
      typeof q.id === 'number' &&
      typeof q.question === 'string' &&
      q.question.length > 0 &&
      typeof q.options === 'object' &&
      Object.keys(q.options).length > 0 &&
      (typeof q.correctAnswer === 'string' || Array.isArray(q.correctAnswer)) &&
      typeof q.explanation === 'string'
    )
  })
}

/**
 * Example usage in Node.js or a build script:
 *
 * import fs from 'fs'
 * import { parseQuestionsFromText } from './lib/parseQuestions'
 *
 * const rawText = fs.readFileSync('public/qna2.txt', 'utf-8')
 * const questions = parseQuestionsFromText(rawText)
 * fs.writeFileSync('public/questions2.json', JSON.stringify(questions, null, 2))
 */
