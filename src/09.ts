import * as fs from "fs";
import { lcm } from "./utils";

function getNextValue(xs: number[]): number {
  if (xs.every((x) => x === 0)) {
    return 0;
  }
  return xs[xs.length - 1] + getNextValue(xs.slice(1).map((x, i) => x - xs[i]));
}

function getPreviousValue(xs: number[]): number {
  if (xs.every((x) => x === 0)) {
    return 0;
  }
  return xs[0] - getPreviousValue(xs.slice(1).map((x, i) => x - xs[i]));
}

export function run09() {
  const lines = fs.readFileSync("inputs/09.txt", "utf8").split("\n");

  const xss = lines.map((line) => line.split(" ").map((v) => parseInt(v)));

  const nextValues = xss.map(getNextValue);
  const sumNextValues = nextValues.reduce((a, b) => a + b);
  console.log(`Part 1 is ${sumNextValues}`);

  const prev = xss.map(getPreviousValue);
  const sumPrevValues = prev.reduce((a, b) => a + b);
  console.log(`Part 2 is ${sumPrevValues}`);
}
