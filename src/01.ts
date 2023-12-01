import * as fs from "fs";
import * as console from "console";

export function run01() {
  const lines = fs.readFileSync("inputs/01.txt", "utf8").split("\n");

  const sum = lines
    .map((line) => [line.match(/.*?(\d).*/), line.match(/.*(\d).*?/)])
    .map(([firstMatch, lastMatch]) => `${firstMatch[1]}${lastMatch[1]}`)
    .map((x) => parseInt(x))
    .reduce((a, b) => a + b, 0);

  console.log(`The sum is ${sum}`);

  const parseDigitInt = (text: string) => {
    switch (text) {
      case "one":
        return 1;
      case "two":
        return 2;
      case "three":
        return 3;
      case "four":
        return 4;
      case "five":
        return 5;
      case "six":
        return 6;
      case "seven":
        return 7;
      case "eight":
        return 8;
      case "nine":
        return 9;
      default:
        return parseInt(text);
    }
  };

  const secondSum = lines
    .map((line) => [
      line.match(/.*?(\d|one|two|three|four|five|six|seven|eight|nine).*/),
      line.match(/.*(\d|one|two|three|four|five|six|seven|eight|nine).*?/),
    ])
    .map(
      ([firstMatch, lastMatch]) =>
        `${parseDigitInt(firstMatch[1])}${parseDigitInt(lastMatch[1])}`
    )
    .map((x) => parseInt(x))
    .reduce((a, b) => a + b, 0);

  console.log(`The second sum is ${secondSum}`);
}
