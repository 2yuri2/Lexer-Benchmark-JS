const acorn = require("acorn");
const fs = require("fs");

const code = fs.readFileSync("sample.js", "utf8");

function run() { return [...acorn.tokenizer(code, { ecmaVersion: "latest" })]; }
for (let i = 0; i < 3; i++) run();            // warm-up, thrown away
const times = [];
for (let i = 0; i < 30; i++) {                // 30 timed runs
  const s = process.hrtime.bigint();
  run();
  times.push(Number(process.hrtime.bigint() - s) / 1e6);
}
times.sort((x, y) => x - y);

const tokens = run();
tokens.forEach((t, i) => console.log(i + 1, t.type.label, JSON.stringify(t.value ?? "")));
console.log("\nMedian time (ms):", times[15].toFixed(4));
console.log("Memory (heapUsed MB):", (process.memoryUsage().heapUsed / 1e6).toFixed(1));