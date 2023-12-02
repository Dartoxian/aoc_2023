import * as fs from "fs";
import * as console from "console";

type Round = {
  green: number;
  red: number;
  blue: number;
};

type Game = {
  gameId: number;
  rounds: Round[];
};

function gameFromLine(line: string): Game {
  const gameSplit = line.split(":");
  const gameId = parseInt(gameSplit[0].replace(/[^0-9]/g, ""));
  const rounds: Round[] = gameSplit[1].split(";").map((round) =>
    round.split(",").reduce(
      (acc: Round, cube) => {
        const colorAndNumber = cube.trim().split(" ");
        acc[colorAndNumber[1]] = parseInt(colorAndNumber[0]);
        return acc;
      },
      { green: 0, red: 0, blue: 0 }
    )
  );
  return { gameId, rounds };
}

function isGamePossible(
  game: Game,
  totalRed: number,
  totalGreen: number,
  totalBlue: number
): boolean {
  return game.rounds.every(
    (round) =>
      round.red <= totalRed &&
      round.green <= totalGreen &&
      round.blue <= totalBlue
  );
}

export function run02() {
  const lines = fs.readFileSync("inputs/02.txt", "utf8").split("\n");
  const games = lines.map(gameFromLine);

  const part1Total = games
    .filter((game) => isGamePossible(game, 12, 13, 14))
    .reduce((acc, game) => acc + game.gameId, 0);
  console.log(`Part 1 total is ${part1Total}`);

  const minimalBags = games.map((game) =>
    game.rounds.reduce(
      (acc, round) => {
        acc.red = Math.max(acc.red, round.red);
        acc.green = Math.max(acc.green, round.green);
        acc.blue = Math.max(acc.blue, round.blue);
        return acc;
      },
      { green: 0, red: 0, blue: 0 }
    )
  );

  const totalPower = minimalBags
    .map((bag) => bag.red * bag.green * bag.blue)
    .reduce((a, b) => a + b, 0);

  console.log(`Part 2 total power is ${totalPower}`);
}
