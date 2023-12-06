import * as fs from "fs";
import { cellsAround, inclusiveRange } from "./utils";

function winningTimes(
  raceDuration: number,
  distance: number
): [number, number] {
  // Distance travelled is d = buttonPressTime * (raceDuration - buttonPressTime)
  // = - buttonPressTime^2 + raceDuration*buttonPressTime
  // ie 0 = - buttonPressTime^2 + raceDuration*buttonPressTime - d
  const upper =
    (-raceDuration - Math.sqrt(Math.pow(raceDuration, 2) - 4 * distance)) / -2;
  const lower =
    (-raceDuration + Math.sqrt(Math.pow(raceDuration, 2) - 4 * distance)) / -2;
  return [lower, upper];
}

export function run06() {
  const lines = fs.readFileSync("inputs/06.txt", "utf8").split("\n");
  const times = lines[0]
    .split(/\s+/)
    .slice(1)
    .map((v) => parseInt(v));
  const distances = lines[1]
    .split(/\s+/)
    .slice(1)
    .map((v) => parseInt(v));

  const winningBounds = times.map((t, i) => winningTimes(t, distances[i]));
  const waysToWin = winningBounds.map(
    ([lower, upper]) => Math.ceil(upper - 1) - Math.floor(lower + 1) + 1
  );

  console.log(times, distances);
  console.log(winningBounds, waysToWin);
  console.log(`Part 1 solution is ${waysToWin.reduce((a, b) => a * b)}`);

  // Part 2 solution was found by rerunning this program and removing spaces from the 06.txt input.
}
