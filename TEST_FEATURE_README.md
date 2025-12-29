# Test Feature Documentation

## Overview

This app includes a dynamic test-taking system with a dark UI built using shadcn components. The test system supports both single-select and multi-select questions with instant feedback and explanations.

## Features

- **Dark Theme UI**: Clean, modern interface with shadcn components
- **Single & Multi-Select Questions**: Automatically detects question type
- **Instant Feedback**: Shows correct answers in green, wrong answers in red
- **Explanations**: Displays detailed explanations after answer submission
- **Progress Tracking**: Visual indicators for question progress
- **Dynamic Question Loading**: Load different question sets easily
- **Score Calculation**: Final score with percentage display

## How to Use

### Taking the Default Test

1. Navigate to the Dashboard
2. Click the "TAKE A TEST" button
3. Read the question and select your answer(s)
4. Click "Submit Answer" to check your response
5. Read the explanation
6. Click "Next Question" to continue
7. View your final score at the end

### Loading Different Question Sets

The test system is designed to be dynamic. You can easily load different question sets:

```tsx
// In your component
<TestComponent questionsFile="/questions.json" />  // Default
<TestComponent questionsFile="/questions2.json" /> // Different set
<TestComponent questionsFile="/salesforce-advanced.json" /> // Another set
```

## Question Format

Questions must be in JSON format with the following structure:

### Single-Select Question
```json
{
  "id": 1,
  "question": "What is the correct answer?",
  "options": {
    "A": "Option A text",
    "B": "Option B text",
    "C": "Option C text",
    "D": "Option D text"
  },
  "correctAnswer": "A",
  "explanation": "Explanation of why A is correct..."
}
```

### Multi-Select Question
```json
{
  "id": 2,
  "question": "Which three options are correct?",
  "options": {
    "A": "Option A text",
    "B": "Option B text",
    "C": "Option C text",
    "D": "Option D text",
    "E": "Option E text"
  },
  "correctAnswer": ["A", "C", "D"],
  "explanation": "Explanation of why A, C, and D are correct..."
}
```

**Note**: If `correctAnswer` is an array, the question automatically becomes multi-select.

## Adding New Question Sets

### Method 1: Manual JSON Creation

1. Create a new JSON file in `/public` (e.g., `questions2.json`)
2. Format your questions according to the structure above
3. Update your component to use the new file:
   ```tsx
   <TestComponent questionsFile="/questions2.json" />
   ```

### Method 2: Using the Parser Utility

If you have questions in plain text format (like your current `qna.txt`):

1. Create a script to parse the text:

```typescript
// scripts/parseQuestions.ts
import fs from 'fs'
import { parseQuestionsFromText } from '../lib/parseQuestions'

const rawText = fs.readFileSync('public/qna2.txt', 'utf-8')
const questions = parseQuestionsFromText(rawText)

// Validate
if (questions.length > 0) {
  fs.writeFileSync(
    'public/questions2.json',
    JSON.stringify(questions, null, 2)
  )
  console.log(`Parsed ${questions.length} questions`)
} else {
  console.error('No questions parsed')
}
```

2. Run the script:
```bash
npx tsx scripts/parseQuestions.ts
```

3. Use the generated JSON file in your test component

## Customization

### Changing the Test Route

To create a separate test page:

1. Create `/app/test/page.tsx`:
```tsx
'use client'

import TestComponent from '@/app/dashboard/_components/TestComponent'

export default function TestPage() {
  return <TestComponent questionsFile="/questions.json" />
}
```

2. Navigate to `/test` to take the exam

### Multiple Test Types

You can create different test pages for different topics:

```tsx
// app/test/salesforce-basics/page.tsx
<TestComponent questionsFile="/salesforce-basics.json" />

// app/test/salesforce-advanced/page.tsx
<TestComponent questionsFile="/salesforce-advanced.json" />

// app/test/javascript/page.tsx
<TestComponent questionsFile="/javascript-questions.json" />
```

### Styling Customization

The test uses Tailwind CSS and can be customized by editing:
- `/app/dashboard/_components/TestComponent.tsx` - Main test component
- `/components/ui/*` - UI components (Button, Card, RadioGroup, Checkbox)

## UI Components Used

- **Button**: Primary actions (Submit, Next, Previous)
- **Card**: Question containers
- **RadioGroup**: Single-select questions
- **Checkbox**: Multi-select questions

All components follow shadcn/ui design patterns with dark theme support.

## Tips for Creating Good Questions

1. **Clear Questions**: Make questions unambiguous
2. **Detailed Explanations**: Help users learn, don't just give answers
3. **Consistent Options**: Use A, B, C, D, E for options
4. **Balanced Difficulty**: Mix easy and hard questions
5. **Unique IDs**: Ensure each question has a unique ID

## Example: Adding a New Test

1. Create `public/qna2.txt` with your questions
2. Run the parser or manually create `public/questions2.json`
3. Update your dashboard to offer multiple tests:

```tsx
<Button onClick={() => setCurrentTest('/questions.json')}>
  Salesforce Basics
</Button>
<Button onClick={() => setCurrentTest('/questions2.json')}>
  Salesforce Advanced
</Button>

{showTest && <TestComponent questionsFile={currentTest} />}
```

## Current Question Set

The default test includes 20 Salesforce certification practice questions covering:
- Apex development
- Lightning Web Components
- Visualforce
- Testing
- Integration patterns
- Best practices

## Future Enhancements

Potential features to add:
- Timer functionality
- Question bookmarking
- Review mode (review all questions at end)
- Export results
- Question filtering by topic
- Randomize question order
- Save progress to database
- Multiple attempts tracking
- Leaderboard

## Support

For issues or questions about the test feature, please refer to the main project documentation or create an issue in the repository.
