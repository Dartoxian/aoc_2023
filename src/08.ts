import * as fs from "fs";
import { lcm } from "./utils";

export function run08() {
  const lines = fs.readFileSync("inputs/08.txt", "utf8").split("\n");

  const instructions = lines[0].split("");
  const edges = lines.slice(2).reduce((acc, line) => {
    const matches = line.match(/(\S+)\s+=\s+\(([^,]+), ([^)]+)\)/);
    if (!matches) {
      throw Error(`Line does not match pattern: ${line}`);
    }
    acc[matches[1]] = [matches[2], matches[3]];
    return acc;
  }, {} as Record<string, [string, string]>);

  let steps = 0;
  let currentNode = "AAA";
  while (currentNode !== "ZZZ") {
    const instruction = instructions[steps % instructions.length];
    currentNode = edges[currentNode][instruction === "L" ? 0 : 1];
    steps += 1;
  }
  console.log(`It took ${steps} steps to get through the desert`);

  function findZFrom(start: string) {
    let currentNode = start;
    let step = 0;
    while (!currentNode.endsWith("Z")) {
      const instructionNumber = step % instructions.length;
      const instruction = instructions[instructionNumber];
      currentNode = edges[currentNode][instruction === "L" ? 0 : 1];
      step += 1;
    }
    console.log(`Found cycle after ${step} for ${start} at ${currentNode}`);
    return step;
  }

  const firstCycle = Object.keys(edges)
    .filter((e) => e.endsWith("A"))
    .map(findZFrom)
    .reduce((a, b) => lcm(a, b));

  console.log(`The ghosts meet after ${firstCycle} steps`);
}
