import {resizeCanvas, createProgramAndDraw} from "./util"
//import Vec3 from "./Vec3"
import Mat4 from "./Mat4"
import Camera from "./Camera"
import vertexShaderSource from "./vertex.vert"
import fragmentShaderSource from "./fragment.frag"
import * as data from "./geometryData"

enum PLoc {
	MATRIX 		= "u_matrix",
	//COLOR 		= "u_color",
	TEXTURE		= "u_texture",
	TEXCOORDS	= "a_texcoords",
	POSITION 	= "a_position"
}
type Locations = {[loc in PLoc]: number | WebGLUniformLocation}
type Keymap = {[key: string]: boolean}

let vao: WebGLVertexArrayObject
const locs: Locations = {
	[PLoc.MATRIX]: -1,
	//[PLoc.COLOR]: -1,
	[PLoc.TEXTURE]: -1,
	[PLoc.TEXCOORDS]: -1,
	[PLoc.POSITION]: -1,
}
let keymap: Keymap = {}
let projectionMatrix = Mat4.Identity()

function handleKeyDown(ev: KeyboardEvent) {
	if(ev.repeat) return
	keymap[ev.key] = true
}

function handleKeyUp(ev: KeyboardEvent) {
	keymap[ev.key] = false
}
/*
function update(gl: WebGL2RenderingContext, program: WebGLProgram, dt: number) {


}*/

function setGeometry(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(data.F.geometry),
		gl.STATIC_DRAW
	)
}

function setTexcoords(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array(data.F.texcoords),
		gl.STATIC_DRAW
	)
}

/*
function setColors(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Uint8Array(data.F.color),
		gl.STATIC_DRAW
	)
}
*/
function init(gl: WebGL2RenderingContext, program: WebGLProgram) {
	const tvao = gl.createVertexArray()
	if(!tvao) {console.error("No vao"); return}
	vao = tvao
	gl.bindVertexArray(vao)

	const transformLocation = gl.getUniformLocation(program, "u_matrix")
	if(!transformLocation) {console.error("No transform attribute"); return}
	projectionMatrix = Mat4.Perspective(45, gl.canvas.width / gl.canvas.height, 0.1, 2000)
	locs[PLoc.MATRIX] = transformLocation
	gl.uniformMatrix4fv(locs[PLoc.MATRIX], false, new Float32Array(projectionMatrix.values))


	const positionBuffer = gl.createBuffer()
	const positionLocation = gl.getAttribLocation(program, "a_position")
	locs[PLoc.POSITION] = positionLocation
	gl.enableVertexAttribArray(positionLocation)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	// Bind buffer (positionbuffer) to the attribute (a_position)
	gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
	setGeometry(gl)

	/*
	const colorBuffeer = gl.createBuffer()
	const colorLocation = gl.getAttribLocation(program, "a_color")
	locs[PLoc.COLOR] = colorLocation
	gl.enableVertexAttribArray(colorLocation)
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffeer)
	gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0)
	setColors(gl)
	*/
	const texcoordLocation = gl.getAttribLocation(program, "a_texcoord")
	if(!texcoordLocation) {console.error("No texcoords attribute"); return}
	locs[PLoc.TEXCOORDS] = texcoordLocation
	const texcoordsBuffer = gl.createBuffer()
	gl.enableVertexAttribArray(texcoordLocation)
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordsBuffer)
	// turn on the attribute
	// NOTE: I don't understand why this has to be normalized, the inputs are already in the 0-1 range
	gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, true, 0, 0)
	setTexcoords(gl)

	const texture = gl.createTexture()
	if(!texture) {console.error("Couldn't create a texture")}
	gl.bindTexture(gl.TEXTURE_2D, texture)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0,
		gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255])
	)

	const image = new Image()
	image.addEventListener("load", () => {
		console.log("loaded image", image)
		gl.bindTexture(gl.TEXTURE_2D, texture)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image)
		gl.generateMipmap(gl.TEXTURE_2D)
	})
	image.src = "/f-texture.png"
}

let rotation = 0
function draw(gl: WebGL2RenderingContext, program: WebGLProgram, dt: number) {
	gl.enable(gl.CULL_FACE)
	gl.enable(gl.DEPTH_TEST)
	resizeCanvas(gl.canvas as HTMLCanvasElement)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	// Clear the canvas
	gl.clearColor(0, 0, 0, 0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
	const camera = new Camera(45, gl.canvas.width / gl.canvas.height, 0.1, 2000)
	camera.transform.translate(0, 80, 220)
	const vpm = camera.getViewProjectionMatrix()
	rotation += dt * 0.001
	const fmatrix = vpm.copy().yRotate(rotation)
	gl.uniformMatrix4fv(locs[PLoc.MATRIX], false, new Float32Array(fmatrix.values))
	// Draw the geometry.
	const primitiveType = gl.TRIANGLES
	const offset = 0
	const count = 16 * 6
	gl.drawArrays(primitiveType, offset, count)
/*
	const numFs = 5
	const radius = 200
	rotation += dt * 0.001
	const camera = new Camera(45, gl.canvas.width / gl.canvas.height, 0.1, 2000)
	camera.transform
		.yRotate(rotation)
		.translate(0, 80, radius * 2)
		.lookAt(new Vec3(radius, 0, 0))

	const vpm = camera.getViewProjectionMatrix()

	for(let i = 0; i < numFs; i++) {
		const angle = i * Math.PI * 2 / numFs

		const x = Math.cos(angle) * radius
		const z = Math.sin(angle) * radius
		// add in the translation for this F
		const matrix = vpm
			.copy()
			.translate(x, 120, z)
			.xRotate(Math.PI)

		// Set the matrix.
		gl.uniformMatrix4fv(locs[PLoc.MATRIX], false, new Float32Array(matrix.values))

		// Draw the geometry.
		const primitiveType = gl.TRIANGLES
		const offset = 0
		const count = 16 * 6
		gl.drawArrays(primitiveType, offset, count)
	}
*/
	//update(gl, program, dt)

}

document.addEventListener("keydown", handleKeyDown)
document.addEventListener("keyup", handleKeyUp)

createProgramAndDraw(vertexShaderSource, fragmentShaderSource, init, draw)