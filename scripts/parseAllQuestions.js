const fs = require('fs');
const path = require('path');

// Read the qna.txt file
const qnaPath = path.join(__dirname, '../qna.txt');
const content = fs.readFileSync(qnaPath, 'utf-8');

const questions = [];
let currentId = 1;

// Split by major sections - look for patterns that indicate a new question
const lines = content.split('\n');

let i = 0;
while (i < lines.length) {
  const line = lines[i].trim();

  // Skip empty lines and the header
  if (!line || line === 'p4exms') {
    i++;
    continue;
  }

  // Check if this looks like a question
  if (line.includes('?') && line.length > 20) {
    const question = parseQuestion(lines, i);
    if (question) {
      question.id = currentId++;
      questions.push(question);
      i = question.endIndex;
    } else {
      i++;
    }
  } else {
    i++;
  }
}

function parseQuestion(lines, startIndex) {
  let i = startIndex;
  let questionText = '';
  let options = {};
  let correctAnswer = null;
  let explanation = '';
  let inOptions = false;
  let inExplanation = false;

  // Get the question
  while (i < lines.length && !lines[i].trim().toLowerCase().startsWith('options') &&
         !lines[i].trim().match(/^[A-E][\)\:\.]/) && !lines[i].trim().startsWith('-')) {
    const line = lines[i].trim();
    if (line && !line.startsWith('{') && line !== 'p4exms') {
      questionText += (questionText ? ' ' : '') + line;
    }
    i++;
    if (questionText.includes('?')) break;
  }

  if (!questionText.includes('?')) return null;

  // Look for options
  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    // Check if we hit options section
    if (line.toLowerCase().includes('options') || line.toLowerCase().includes('choose')) {
      inOptions = true;
      i++;
      continue;
    }

    // Parse option lines (A), B), C), etc. or A: B: format
    const optionMatch = line.match(/^([A-E])[\)\:\.]?\s*(.+)/);
    if (optionMatch && inOptions) {
      options[optionMatch[1]] = optionMatch[2].trim().replace(/^["']|["']$/g, '');
      i++;
      continue;
    }

    // Check for answer line with checkmark or "Correct Answer"
    if (line.toLowerCase().includes('correct answer')) {
      const answerMatch = line.match(/([A-E](?:,?\s*(?:and\s+)?[A-E])*)/);
      if (answerMatch) {
        const answerStr = answerMatch[1].replace(/and/g, ',').replace(/\s+/g, '');
        const answers = answerStr.split(',').filter(a => a.match(/[A-E]/));
        correctAnswer = answers.length > 1 ? answers : answers[0];
      }
      i++;
      inExplanation = true;
      continue;
    }

    // Check for "Answer:" format
    if (line.toLowerCase().startsWith('answer:')) {
      const answerMatch = line.match(/Answer:\s*([A-E](?:,\s*[A-E])*)/i);
      if (answerMatch) {
        const answers = answerMatch[1].split(',').map(a => a.trim());
        correctAnswer = answers.length > 1 ? answers : answers[0];
      }
      i++;
      inExplanation = true;
      continue;
    }

    // Parse explanation
    if (inExplanation && (line.toLowerCase().includes('explanation') || line.startsWith('💡') || line.startsWith('✔'))) {
      // Start gathering explanation
      while (i < lines.length) {
        const expLine = lines[i].trim();
        if (!expLine || expLine.toLowerCase().includes('correct answer') || expLine.match(/^[A-E][\)\:\.]/) ||
            (expLine.includes('?') && expLine.length > 30)) {
          break;
        }
        if (expLine && !expLine.toLowerCase().startsWith('explanation') && !expLine.startsWith('💡') &&
            !expLine.startsWith('✔') && !expLine.startsWith('Answer:') && !expLine.startsWith('{')) {
          explanation += (explanation ? ' ' : '') + expLine;
        }
        i++;
      }
      break;
    }

    // If we have options and hit another question, stop
    if (Object.keys(options).length >= 2 && line.includes('?') && line.length > 30) {
      break;
    }

    i++;

    // Stop if we've gone too far without finding a complete question
    if (i - startIndex > 50) break;
  }

  // Validate we have a complete question
  if (questionText && Object.keys(options).length >= 2 && correctAnswer) {
    return {
      question: questionText.trim(),
      options,
      correctAnswer,
      explanation: explanation.trim() || 'No explanation provided.',
      endIndex: i
    };
  }

  return null;
}

// Write to JSON file
const outputPath = path.join(__dirname, '../public/questions-all.json');
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));

console.log(`✅ Parsed ${questions.length} questions from qna.txt`);
console.log(`📝 Saved to ${outputPath}`);

// Print first question as sample
if (questions.length > 0) {
  console.log('\n📋 Sample question:');
  console.log(JSON.stringify(questions[0], null, 2));
}
