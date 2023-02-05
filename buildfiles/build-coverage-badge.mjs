import { makeBadge } from 'badge-maker'
import { readFile, writeFile } from 'node:fs/promises'

const projectPath = new URL('../',import.meta.url).pathname;

function badgeColor(pct){
  if(pct > 90){ return '#007700' }
  if(pct > 70){ return '#777700' }
  if(pct > 50){ return '#883300' }
  if(pct > 30){ return '#aa0000' }
  return 'red'
}

async function makeBadgeForCoverages(path){
  const json = await readFile(`${path}/coverage-summary.json`).then(str => JSON.parse(str))
  const svg = makeBadge({
    label: 'coverage',
    message: `${json.total.lines.pct}%`,
    color: badgeColor(json.total.lines.pct),
    style: 'for-the-badge',
  })
  
  await writeFile(`${path}/coverage-badge.svg`, svg);
}

await Promise.allSettled([
  makeBadgeForCoverages(`${projectPath}/coverage/unit`),
  makeBadgeForCoverages(`${projectPath}/coverage/ui`),
  makeBadgeForCoverages(`${projectPath}/coverage/final`)
])

