import * as fs from "fs";

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

  function findCycleFrom(start: string) {
    const seenSteps = [];
    let currentNode = start;
    let step = 0;
    while (
      seenSteps.findIndex(
        ([n, s]) => n === currentNode && s === step % instructions.length
      ) < 0
    ) {
      const instructionNumber = step % instructions.length;
      const instruction = instructions[instructionNumber];
      seenSteps.push([currentNode, instructionNumber]);
      currentNode = edges[currentNode][instruction === "L" ? 0 : 1];
      step += 1;
    }
    console.log(`Found cycle after ${step} for ${start} at ${currentNode}`);
    const cycleStart = step;
    const cycleStartNode = currentNode;
    let cycleLength = 0;
    const cycleEndPoints = [];
    while (
      cycleLength === 0 ||
      currentNode !== cycleStartNode ||
      step % instructions.length !== cycleStart % instructions.length
    ) {
      const instructionNumber = step % instructions.length;
      const instruction = instructions[instructionNumber];
      if (currentNode.endsWith("Z")) {
        cycleEndPoints.push(cycleLength);
      }
      cycleLength += 1;
      step += 1;
      currentNode = edges[currentNode][instruction === "L" ? 0 : 1];
    }

    return {
      cycleStart,
      cycleStartNode,
      cycleLength,
      cycleEndPoints,
    };
  }

  const cyclesT = Object.keys(edges)
    .filter((e) => e.endsWith("A"))
    .map((n) => {
      return findCycleFrom(n);
    });
  // Each cycle appears to only have one end point!

  // A cycle is on a finishing step every:
  // (n * cycleLength) + cycleStart + cycleEndPoints[0]  # n is the nth time a ghost is at a winning step
  // Need to find the first values of n1..nN such that:
  //  (n1 * cycleLength) + cycleStart + cycleEndPoints[0] = (n2 * cycleLength) + cycleStart + cycleEndPoints[0] = ... = (nN * cycleLength) + cycleStart + cycleEndPoints[0]

  type Cycle = {
    start: number;
    length: number;
  };

  const cycles: Cycle[] = cyclesT.map((cycle) => ({
    start: cycle.cycleStart + cycle.cycleEndPoints[0],
    length: cycle.cycleLength,
  }));
  console.log(cycles);
  //  (n1 * l1) + s1 = (n2 * l2) + s2 = ... = (nN * length) + start

  // s2 - s1 = (n1 * l1) - (n2 * l2)
  // s2 - s1 Mod l1 = n1 - (n2 * l2 Mod l1)
  // (s2 - s1) Mod l1*l2 = (n1 * l1 Mod l2) - (n2 * l2 Mod l1)
  // c1 and c2 will overlap
}
