export class Color {
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public a: number
  ) {}

  public toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})` as const;
  }

  public toHexString() {
    return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(
      16
    )}`;
  }

  public static fromHex(hex: string): Color {
    // check if hex have # at the beginning
    if (hex[0] === "#") {
      hex = hex.substring(1);
    }

    // check if hex is short version
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((char) => char + char)
        .join("");
    }

    // check if hex is valid
    if (hex.length !== 6) {
      throw new Error("Invalid hex");
    }

    // convert hex to rgb
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return new Color(r, g, b, 1);
  }

  public static fromAray(arr: Array<number>): Color {
    return new Color(arr[0], arr[1], arr[2], arr[3]);
  }
}
