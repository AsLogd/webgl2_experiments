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

	yRotate(radians: number): Mat4 {
		this.multiply(Mat4.YRotate(radians))
		return this
	}

	zRotate(radians: number): Mat4 {
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

	inverse(): Mat4 {
		const m00 = this.values[0 * 4 + 0];
		const m01 = this.values[0 * 4 + 1];
		const m02 = this.values[0 * 4 + 2];
		const m03 = this.values[0 * 4 + 3];
		const m10 = this.values[1 * 4 + 0];
		const m11 = this.values[1 * 4 + 1];
		const m12 = this.values[1 * 4 + 2];
		const m13 = this.values[1 * 4 + 3];
		const m20 = this.values[2 * 4 + 0];
		const m21 = this.values[2 * 4 + 1];
		const m22 = this.values[2 * 4 + 2];
		const m23 = this.values[2 * 4 + 3];
		const m30 = this.values[3 * 4 + 0];
		const m31 = this.values[3 * 4 + 1];
		const m32 = this.values[3 * 4 + 2];
		const m33 = this.values[3 * 4 + 3];
		const tmp_0  = m22 * m33;
		const tmp_1  = m32 * m23;
		const tmp_2  = m12 * m33;
		const tmp_3  = m32 * m13;
		const tmp_4  = m12 * m23;
		const tmp_5  = m22 * m13;
		const tmp_6  = m02 * m33;
		const tmp_7  = m32 * m03;
		const tmp_8  = m02 * m23;
		const tmp_9  = m22 * m03;
		const tmp_10 = m02 * m13;
		const tmp_11 = m12 * m03;
		const tmp_12 = m20 * m31;
		const tmp_13 = m30 * m21;
		const tmp_14 = m10 * m31;
		const tmp_15 = m30 * m11;
		const tmp_16 = m10 * m21;
		const tmp_17 = m20 * m11;
		const tmp_18 = m00 * m31;
		const tmp_19 = m30 * m01;
		const tmp_20 = m00 * m21;
		const tmp_21 = m20 * m01;
		const tmp_22 = m00 * m11;
		const tmp_23 = m10 * m01;

		const t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
			(tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
		const t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
			(tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
		const t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
			(tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
		const t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
			(tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

		const d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

		this.values = [
			d * t0,
			d * t1,
			d * t2,
			d * t3,
			d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
				(tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
			d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
				(tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
			d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
				(tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
			d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
				(tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
			d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
				(tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
			d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
				(tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
			d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
				(tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
			d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
				(tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
			d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
				(tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
			d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
				(tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
			d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
				(tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
			d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
				(tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02)),
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