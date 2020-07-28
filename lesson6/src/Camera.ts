import Mat4 from "./Mat4"

export default class Camera {
	transform: Mat4
	projection: Mat4
	constructor(fieldOfViewInRadians: number, aspect: number, near: number, far: number) {
		this.projection = Mat4.Perspective(fieldOfViewInRadians, aspect, near, far)
		this.transform = Mat4.Identity()
	}

	getViewProjectionMatrix(): Mat4 {
		const cameraMatrix = this.transform.copy()
		const viewMatrix = cameraMatrix.inverse()
		const viewProjectionMatrix = this.projection
			.copy()
			.multiply(viewMatrix)
		return viewProjectionMatrix
	}
}