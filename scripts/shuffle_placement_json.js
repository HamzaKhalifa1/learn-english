const fs = require('fs');
const path = require('path');

const wordsPath = path.join(__dirname, '../src/data/words.json');
const wordsData = JSON.parse(fs.readFileSync(wordsPath, 'utf8'));

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const qs = wordsData.placementTest.questions;
console.log('Shuffling 25 placement test question options in words.json...');

qs.forEach((q, idx) => {
  // Ensure the correct answer is indeed in options
  if (!q.options.includes(q.correct)) {
    console.error(`Warning: Q${idx + 1} (${q.id}) correct answer "${q.correct}" not in options!`);
  }
  // Shuffle options until correct is not always at index 0 (or naturally shuffled)
  q.options = shuffle(q.options);
  const correctIdx = q.options.indexOf(q.correct);
  console.log(`Q${idx + 1} [${q.level}]: correct at index ${correctIdx} ('${q.options[correctIdx]}')`);
});

fs.writeFileSync(wordsPath, JSON.stringify(wordsData, null, 2), 'utf8');
console.log('Updated words.json successfully!');
