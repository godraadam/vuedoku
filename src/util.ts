import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function getKCombinations<T>(arr: T[], k: number): T[][] {
  if (k <= 0) return [[]];
  if (k > arr.length) return [];

  const result: Array<Array<T>> = [];

  function helper(start: number = 0, acc: T[] = []) {
    if (acc.length == k) {
      result.push(acc.slice());
      return;
    }

    for (let i = start; i < arr.length; i++) {
      acc.push(arr[i]);
      helper(i + 1, acc);
      acc.pop();
    }
  }

  helper();
  return result;
}

export function* kCombinations<T>(arr: Array<T>, k: number): Generator<Array<T>> {
  if (k <= 0) {
    yield [];
    return;
  }
  if (k > arr.length) return;

  const acc: Array<T> = [];

  function* helper(start: number): Generator<Array<T>> {
    if (acc.length == k) {
      yield acc.slice();
      return;
    }

    for (let i = start; i < arr.length; i++) {
      acc.push(arr[i]);
      yield* helper(i + 1);
      acc.pop();
    }
  }

  yield* helper(0);
}

export function* digits() {
  for (let i = 0; i < 9; i++) {
    yield i;
  }
}

export function getRollingWindows<T>(arr: Array<T>, size = 2) {
  if (size > arr.length) {
    return [];
  }
  const res: Array<Array<T>> = [];
  for (let i = 0; i < arr.length - size + 1; i++) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export function* rollingWindows<T>(arr: Array<T>, size = 2) {
  if (size > arr.length) {
    return;
  }
  for (let i = 0; i < arr.length - size + 1; i++) {
    yield arr.slice(i, i + size);
  }
}

export function getTupleName(n: number) {
  const names = ["single", "pair", "triple", "quadruple", "quintuple"];
  return names[n - 1];
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
