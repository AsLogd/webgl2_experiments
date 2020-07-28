import Mat4 from "./Mat4"
//import Vec3 from "./Vec3"

export default class Object3D {
	transform: Mat4
	constructor() {
		this.transform = Mat4.Identity()
	}
}