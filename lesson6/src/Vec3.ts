export default class Vec3 {
	values: [number, number, number]

	static Zero(): Vec3{
		return new Vec3(0, 0, 0)
	}

	static Forward(): Vec3 {
		return new Vec3(0, 0, 1)
	}

	static Up(): Vec3 {
		return new Vec3(0, 1, 0)
	}

	static Right(): Vec3 {
		return new Vec3(1, 0, 0)
	}

	static Cross(a: Vec3, b: Vec3): Vec3 {
		const [ax, ay, az] = a.values
		const [bx, by, bz] = b.values
		return new Vec3(
			ay*bz - az*by,
			az*bx - ax*bz,
			ax*by - ay*bx,
		)
	}

	constructor(x: number, y: number, z: number)  {
		this.values = [x, y, z]
	}

	isZero(): boolean {
		const [x,y,z] = this.values
		return x === 0
			&& y === 0
			&& z === 0
	}

	copy() {
		const [x,y,z] = this.values
		return new Vec3(x, y, z)
	}

	sub(b: Vec3): Vec3 {
		const [x,y,z] = this.values
		const [x2, y2, z2] = b.values
		this.values[0] = x-x2
		this.values[1] = y-y2
		this.values[2] = z-z2
		return this
	}

	magnitude(): number {
		const [x,y,z] = this.values
		return Math.sqrt(x*x + y*y + z*z)
	}

	normalize(): Vec3 {
		if(this.isZero()) {
			console.warn("[Vec3] Trying to normalize a zero vector")
			return this
		}
		const [x,y,z] = this.values
		const magnitude = this.magnitude()
		this.values[0] = x/magnitude
		this.values[1] = y/magnitude
		this.values[2] = z/magnitude
		return this
	}
}