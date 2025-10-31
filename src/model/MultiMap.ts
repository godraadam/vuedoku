export class MultiMap<K, V> implements Iterable<[K, V]> {
  private map = new Map<K, Set<V>>();

  public add(key: K, value: V): this {
    let set = this.map.get(key);
    if (!set) {
      set = new Set<V>();
      this.map.set(key, set);
    }
    set.add(value);
    return this;
  }

  public get(key: K) {
    const set = this.map.get(key);
    return set ? Array.from(set) : [];
  }

  public has(key: K, value?: V): boolean {
    if (!this.map.has(key)) return false;
    if (value == undefined) return true;
    return this.map.get(key)!.has(value);
  }

  public delete(key: K, value?: V): boolean {
    if (!this.map.has(key)) return false;

    if (value == undefined) {
      return this.map.delete(key); // delete all values for this key
    }

    const set = this.map.get(key)!;
    const deleted = set.delete(value);
    if (set.size == 0) {
      this.map.delete(key);
    }
    return deleted;
  }

  public clear(): void {
    this.map.clear();
  }

  *entries(): Generator<[K, V]> {
    for (const [key, set] of this.map.entries()) {
      for (const value of set) {
        yield [key, value];
      }
    }
  }

  *keys() {
    for (const key of this.map.keys()) {
      yield key;
    }
  }

  *values() {
    for (const set of this.map.values()) {
      for (const value of set) yield value;
    }
  }

  public size() {
    return this.map.size;
  }

  public [Symbol.iterator]() {
    return this.entries();
  }
}
