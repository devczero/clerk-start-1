# Quick Start Guide - Test Feature

## Current Setup

Your test feature is now fully implemented and running! 🎉

**Server**: http://localhost:3001

## What You Can Do Right Now

### 1. Take the Test
1. Go to http://localhost:3001/dashboard
2. Click the big blue "TAKE A TEST" button
3. Start answering questions

### 2. See the Features
- **Single-select questions**: Use radio buttons (only one answer)
- **Multi-select questions**: Use checkboxes (multiple answers)
- **Correct answers**: Show in GREEN after submission ✓
- **Wrong answers**: Show in RED after submission ✗
- **Explanations**: Detailed explanations appear after each answer
- **Progress dots**: Bottom of screen shows your progress
- **Final score**: Shows percentage and correct count

## Adding New Question Sets (qna2.txt)

### Quick Method - For Future Use

When you have a `qna2.txt` file:

1. **Place it in the `/public` folder**

2. **Create `/public/questions2.json` manually** OR use the parser

3. **Update Dashboard to offer multiple tests:**

Open `/app/dashboard/page.tsx` and modify:

```tsx
'use client'

import { useState } from 'react'
import TestComponent from './_components/TestComponent'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
  const [showTest, setShowTest] = useState(false)
  const [testFile, setTestFile] = useState('/questions.json')

  if (showTest) {
    return <TestComponent questionsFile={testFile} />
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Choose Your Test</h1>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              setTestFile('/questions.json')
              setShowTest(true)
            }}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Salesforce Basics
          </Button>

          <Button
            onClick={() => {
              setTestFile('/questions2.json')
              setShowTest(true)
            }}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700"
          >
            Salesforce Advanced
          </Button>
        </div>

        {/* Your other dashboard content */}
      </div>
    </div>
  )
}
```

## Question Format (Copy & Paste Template)

For manual JSON creation, use this template:

```json
[
  {
    "id": 1,
    "question": "Your question here?",
    "options": {
      "A": "First option",
      "B": "Second option",
      "C": "Third option",
      "D": "Fourth option"
    },
    "correctAnswer": "A",
    "explanation": "Why A is correct..."
  },
  {
    "id": 2,
    "question": "Multi-select question?",
    "options": {
      "A": "First option",
      "B": "Second option",
      "C": "Third option",
      "D": "Fourth option"
    },
    "correctAnswer": ["A", "C"],
    "explanation": "Why A and C are correct..."
  }
]
```

**Important**: If `correctAnswer` is an array, it becomes a multi-select question!

## File Structure

```
/public
  ├── questions.json          # Current test (20 questions)
  └── questions2.json         # Add your new test here

/app/dashboard
  ├── page.tsx                # Dashboard with "TAKE A TEST" button
  └── _components
      └── TestComponent.tsx   # Main test interface

/components/ui
  ├── button.tsx              # Button component
  ├── card.tsx                # Card component
  ├── radio-group.tsx         # Radio buttons (single-select)
  └── checkbox.tsx            # Checkboxes (multi-select)

/lib
  ├── utils.ts                # Utility functions
  └── parseQuestions.ts       # Parser for text files
```

## Customization

### Change Colors
Edit `/app/dashboard/_components/TestComponent.tsx`:

- **Primary color**: Search for `bg-blue-600` and replace with your color
- **Success color**: Search for `bg-green-500`
- **Error color**: Search for `bg-red-500`

### Add Timer
Add to TestComponent:

```tsx
const [timeLeft, setTimeLeft] = useState(60 * 30) // 30 minutes

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => prev > 0 ? prev - 1 : 0)
  }, 1000)

  return () => clearInterval(timer)
}, [])

// Display: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
```

### Show All Questions at End
Add to TestComponent state:

```tsx
const [reviewMode, setReviewMode] = useState(false)

// After test completion, add:
<Button onClick={() => setReviewMode(true)}>
  Review All Questions
</Button>
```

## Troubleshooting

### Questions Not Loading
- Check that JSON file exists in `/public`
- Check browser console for errors
- Verify JSON format is correct

### Styling Issues
- Make sure Tailwind CSS is configured
- Check that `lib/utils.ts` exists
- Restart dev server

### Button Not Showing
- Check that you're on the dashboard route
- Verify you have pro plan access (if required)

## Next Steps

1. **Test the current implementation** - Make sure everything works
2. **Add your qna2.txt** - When ready, follow the steps above
3. **Customize colors** - Match your brand
4. **Add more features** - Timer, bookmarks, etc.

## Support Files

- `TEST_FEATURE_README.md` - Complete documentation
- `IMPLEMENTATION_SUMMARY.md` - Technical implementation details
- This file - Quick reference

## Tips

- Test with both single and multi-select questions
- Always validate your JSON before using it
- Use the parser utility for complex text files
- Keep question IDs unique
- Write clear, helpful explanations

---

**You're all set!** The test system is ready to use. Navigate to the dashboard and click "TAKE A TEST" to see it in action! 🚀
