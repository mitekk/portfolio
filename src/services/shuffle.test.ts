import { shuffleArray } from "./shuffle";

describe("shuffleArray", () => {
  test("contains exactly the same elements as input", () => {
    const input = [1, 2, 3, 4, 5, 6];
    const shuffled = shuffleArray(input);

    expect(shuffled).toHaveLength(input.length);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(
      [...input].sort((a, b) => a - b),
    );
  });

  test("empty array returns empty array", () => {
    expect(shuffleArray([])).toEqual([]);
  });

  test("single-element array returns same single element", () => {
    expect(shuffleArray([42])).toEqual([42]);
  });

  test("produces at least two distinct orderings across 50 shuffles", () => {
    const input = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const outcomes = new Set<string>();

    for (let i = 0; i < 50; i++) {
      outcomes.add(shuffleArray(input).join(","));
    }

    expect(outcomes.size).toBeGreaterThanOrEqual(2);
  });
});
