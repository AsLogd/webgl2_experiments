export default class Mat3 {
	values: number[]
	private constructor(values: number[]) {
		this.values = values
	}

	static copy(a: Mat3): Mat3{
		return new Mat3([...a.values])
	}

	static Identity(): Mat3 {
		return new Mat3([
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		])
	}

	static Translate(x: number, y: number): Mat3 {
		return new Mat3([
			1, 0, 0,
			0, 1, 0,
			x, y, 1
		])
	}

	static Scale(x: number, y: number): Mat3 {
		return new Mat3([
			x, 0, 0,
			0, y, 0,
			0, 0, 1
		])
	}

	static Projection(width: number, height: number): Mat3 {
		// pixels / res => 0 to 1
		// 0 to 1 * 2 => 0 to 2
		// 0 to 2 - 1 => -1 to 1
		// Also negates y to have y=0 on top
		return new Mat3([
			2 / width, 0, 0,
			0, -2 / height, 0,
			0, 0, 1
		])
	}

	static Rotate(radians: number): Mat3 {
		const c = Math.cos(radians)
		const s = Math.sin(radians)
		return new Mat3([
			c, -s, 0,
			s, c, 0,
			0, 0, 1
		])
	}

	translate(x: number, y: number): Mat3 {
		this.multiply(Mat3.Translate(x, y))
		return this
	}

	scale(x: number, y: number): Mat3 {
		this.multiply(Mat3.Scale(x, y))
		return this
	}

	rotate(radians: number): Mat3 {
		this.multiply(Mat3.Rotate(radians))
		return this
	}

	multiply(b: Mat3): Mat3 {
		var a00 = this.values[0 * 3 + 0]
		var a01 = this.values[0 * 3 + 1]
		var a02 = this.values[0 * 3 + 2]
		var a10 = this.values[1 * 3 + 0]
		var a11 = this.values[1 * 3 + 1]
		var a12 = this.values[1 * 3 + 2]
		var a20 = this.values[2 * 3 + 0]
		var a21 = this.values[2 * 3 + 1]
		var a22 = this.values[2 * 3 + 2]
		var b00 = b.values[0 * 3 + 0]
		var b01 = b.values[0 * 3 + 1]
		var b02 = b.values[0 * 3 + 2]
		var b10 = b.values[1 * 3 + 0]
		var b11 = b.values[1 * 3 + 1]
		var b12 = b.values[1 * 3 + 2]
		var b20 = b.values[2 * 3 + 0]
		var b21 = b.values[2 * 3 + 1]
		var b22 = b.values[2 * 3 + 2]
		this.values = [
			b00 * a00 + b01 * a10 + b02 * a20,
			b00 * a01 + b01 * a11 + b02 * a21,
			b00 * a02 + b01 * a12 + b02 * a22,
			b10 * a00 + b11 * a10 + b12 * a20,
			b10 * a01 + b11 * a11 + b12 * a21,
			b10 * a02 + b11 * a12 + b12 * a22,
			b20 * a00 + b21 * a10 + b22 * a20,
			b20 * a01 + b21 * a11 + b22 * a21,
			b20 * a02 + b21 * a12 + b22 * a22,
		]
		return this
	}

	log(): void {
		console.log("[Mat3]:",
			`pos: (${this.values[6]}, ${this.values[7]})`,
			`rot: ${Math.atan2(this.values[0], this.values[3])}`,
			`scale: (${this.values[0]}, ${this.values[5]})`
		)
	}

}