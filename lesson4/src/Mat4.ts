export default class Mat4 {
	values: number[]
	private constructor(values: number[]) {
		this.values = values
	}

	static copy(a: Mat4): Mat4{
		return new Mat4([...a.values])
	}

	static Identity(): Mat4 {
		return new Mat4([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		])
	}

	static Translate(x: number, y: number, z: number): Mat4 {
		return new Mat4([
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			x, y, z, 1
		])
	}

	static Scale(x: number, y: number, z: number): Mat4 {
		return new Mat4([
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		])
	}

	static Perspective(fieldOfViewInRadians: number, aspect: number, near: number, far: number): Mat4 {
		const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians)
    	const rangeInv = 1.0 / (near - far)
		return new Mat4([
			f / aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (near + far) * rangeInv, -1,
			0, 0, near * far * rangeInv * 2, 0
		])
	}

	static Ortho(left, right, bottom, top, near, far): Mat4 {
		return new Mat4([
			2 / (right - left), 0, 0, 0,
			0, 2 / (top - bottom), 0, 0,
			0, 0, 2 / (near - far), 0,

			(left + right) / (left - right),
			(bottom + top) / (bottom - top),
			(near + far) / (near - far),
			1,
		])
	}


	static XRotate(radians: number): Mat4 {
		const c = Math.cos(radians)
		const s = Math.sin(radians)
		return new Mat4([
			1, 0, 0, 0,
			0, c, s, 0,
			0, -s, c, 0,
			0, 0, 0, 1
		])
	}

	static YRotate(radians: number): Mat4 {
		const c = Math.cos(radians)
		const s = Math.sin(radians)
		return new Mat4([
			c, 0, -s, 0,
			0, 1, 0, 0,
			s, 0, c, 0,
			0, 0, 0, 1
		])
	}

	static ZRotate(radians: number): Mat4 {
		const c = Math.cos(radians)
		const s = Math.sin(radians)
		return new Mat4([
			c, s, 0, 0,
			-s, c, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		])
	}

	translate(x: number, y: number, z:number): Mat4 {
		this.multiply(Mat4.Translate(x, y, z))
		return this
	}

	scale(x: number, y: number, z: number): Mat4 {
		this.multiply(Mat4.Scale(x, y, z))
		return this
	}

	xRotate(radians: number): Mat4 {
		this.multiply(Mat4.XRotate(radians))
		return this
	}

	YRotate(radians: number): Mat4 {
		this.multiply(Mat4.YRotate(radians))
		return this
	}

	ZRotate(radians: number): Mat4 {
		this.multiply(Mat4.ZRotate(radians))
		return this
	}

	multiply(b: Mat4): Mat4 {
		var b00 = b.values[0 * 4 + 0]
		var b01 = b.values[0 * 4 + 1]
		var b02 = b.values[0 * 4 + 2]
		var b03 = b.values[0 * 4 + 3]
		var b10 = b.values[1 * 4 + 0]
		var b11 = b.values[1 * 4 + 1]
		var b12 = b.values[1 * 4 + 2]
		var b13 = b.values[1 * 4 + 3]
		var b20 = b.values[2 * 4 + 0]
		var b21 = b.values[2 * 4 + 1]
		var b22 = b.values[2 * 4 + 2]
		var b23 = b.values[2 * 4 + 3]
		var b30 = b.values[3 * 4 + 0]
		var b31 = b.values[3 * 4 + 1]
		var b32 = b.values[3 * 4 + 2]
		var b33 = b.values[3 * 4 + 3]
		var a00 = this.values[0 * 4 + 0]
		var a01 = this.values[0 * 4 + 1]
		var a02 = this.values[0 * 4 + 2]
		var a03 = this.values[0 * 4 + 3]
		var a10 = this.values[1 * 4 + 0]
		var a11 = this.values[1 * 4 + 1]
		var a12 = this.values[1 * 4 + 2]
		var a13 = this.values[1 * 4 + 3]
		var a20 = this.values[2 * 4 + 0]
		var a21 = this.values[2 * 4 + 1]
		var a22 = this.values[2 * 4 + 2]
		var a23 = this.values[2 * 4 + 3]
		var a30 = this.values[3 * 4 + 0]
		var a31 = this.values[3 * 4 + 1]
		var a32 = this.values[3 * 4 + 2]
		var a33 = this.values[3 * 4 + 3]
		this.values = [
			b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
			b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
			b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
			b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
			b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
			b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
			b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
			b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
			b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
			b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
			b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
			b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
			b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
			b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
			b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
			b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
		]
		return this
	}

	log(): void {
		console.log(this.values)
		console.log("[Mat4]:",
			`pos: (${this.values[3 * 4 + 0]}, ${this.values[3 * 4 + 1]}, ${this.values[3 * 4 + 2]})`
		)
	}

}