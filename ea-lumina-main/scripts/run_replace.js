const fs = require('fs')
const content = fs.readFileSync('src/app/dashboard/terapeuta/perfil/page.tsx', 'utf-8')
let depth = 0
let lines = content.split(/\r?\n/)
let insideReturn = false
for (let i = 0; i < lines.length; i++) {
  let line = lines[i]
  // Count self-closing divs: <div ... />  -- these don't affect depth
  const selfClose = (line.match(/<div(?:\s[^>]*)?\s*\/>/g) || []).length
  // Count opening divs: <div> or <div ...> (NOT self-closing)
  const openCount = (line.match(/<div(?:\s[^>]*)?\s*>/g) || []).length
  // Count closing divs
  const closeCount = (line.match(/<\/div>/g) || []).length
  const net = openCount - closeCount
  if (net !== 0 || selfClose > 0) {
    depth += net
    console.log(`Line ${String(i + 1).padStart(3, ' ')} | depth: ${String(depth).padStart(2, ' ')} | open:${openCount} close:${closeCount} self:${selfClose} | ${line.trim()}`)
  }
}
console.log('Final depth:', depth)
