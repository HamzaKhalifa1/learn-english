const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const scratchDir = 'C:/Users/Hamza/.gemini/antigravity/brain/d34562a1-f13a-47a6-8779-bdabe3d4dea5/scratch';

// Load main words.json
const mainData = JSON.parse(fs.readFileSync(path.join(dataDir, 'words.json'), 'utf8'));

// Load all batch files
const wordsNew = JSON.parse(fs.readFileSync(path.join(dataDir, 'words_new.json'), 'utf8'));
const p2 = JSON.parse(fs.readFileSync(path.join(scratchDir, 'words_b1_p2.json'), 'utf8'));
const p3 = JSON.parse(fs.readFileSync(path.join(scratchDir, 'words_b1_p3.json'), 'utf8'));
const p4 = JSON.parse(fs.readFileSync(path.join(scratchDir, 'words_b1_p4.json'), 'utf8'));
const b2p1 = JSON.parse(fs.readFileSync(path.join(scratchDir, 'words_b2_p1.json'), 'utf8'));

// Extract unit arrays from each batch
const b1_new = wordsNew.new_levels.B1.units;    // u2-u11 (10 units)
const b1_p2 = p2.b1_batch2;                     // u12-u15 (4 units)
const b1_p3 = p3.b1_batch3;                     // u16-u20 (5 units)
const b1_p4 = p4.b1_batch4;                     // u21-u31 (11 units)
const b2_p1 = b2p1.b2_batch1;                   // b2-u3 through b2-u13 (11 units)

// Also get A2 units from words_new if present
const a2_new = wordsNew.new_levels.A2 ? wordsNew.new_levels.A2.units : [];

// Add B1 units
const existingB1Units = mainData.levels.B1.units;
const existingB1Ids = new Set(existingB1Units.map(u => u.id));

[...b1_new, ...b1_p2, ...b1_p3, ...b1_p4].forEach(unit => {
  if (!existingB1Ids.has(unit.id)) {
    existingB1Units.push(unit);
    existingB1Ids.add(unit.id);
  }
});

// Add A2 units from new batch if any
if (a2_new.length > 0) {
  const existingA2Ids = new Set(mainData.levels.A2.units.map(u => u.id));
  a2_new.forEach(unit => {
    if (!existingA2Ids.has(unit.id)) {
      mainData.levels.A2.units.push(unit);
    }
  });
}

// Add B2 units
const existingB2Units = mainData.levels.B2.units;
const existingB2Ids = new Set(existingB2Units.map(u => u.id));
b2_p1.forEach(unit => {
  if (!existingB2Ids.has(unit.id)) {
    existingB2Units.push(unit);
    existingB2Ids.add(unit.id);
  }
});

// Count everything
let total = 0;
Object.entries(mainData.levels).forEach(([lvl, d]) => {
  const count = d.units.reduce((s, u) => s + u.words.length, 0);
  console.log(`${lvl}: ${d.units.length} units, ${count} words`);
  total += count;
});
console.log(`\nTOTAL: ${total} words`);

// Write back
fs.writeFileSync(path.join(dataDir, 'words.json'), JSON.stringify(mainData, null, 2), 'utf8');
console.log('\n✅ words.json updated successfully!');
