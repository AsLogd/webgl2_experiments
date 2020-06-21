import {resizeCanvas, createProgramAndDraw} from "./util"
import Mat3 from "./Mat3"
import vertexShaderSource from "./vertex.vert"
import fragmentShaderSource from "./fragment.frag"

enum PLoc {
	MATRIX 		= "u_matrix",
	COLOR 		= "u_color",
	POSITION 	= "a_position"
}
type Locations = {[loc in PLoc]: number | WebGLUniformLocation}
type Keymap = {[key: string]: boolean}

let translation = [0, 0]
let rotation = 0
let origin= [0, 0]

let vao: WebGLVertexArrayObject
const locs: Locations = {
	[PLoc.MATRIX]: -1,
	[PLoc.COLOR]: -1,
	[PLoc.POSITION]: -1,
}
let keymap: Keymap = {}
let transform = Mat3.Identity()

function handleKeyDown(ev: KeyboardEvent) {
	if(ev.repeat) return
	keymap[ev.key] = true
}

function handleKeyUp(ev: KeyboardEvent) {
	keymap[ev.key] = false
}

function update(gl: WebGL2RenderingContext, program: WebGLProgram, dt: number) {
	if (keymap["w"]) {
		translation[1] -= dt
	}
	if (keymap["a"]) {
		translation[0] -= dt
	}
	if (keymap["s"]) {
		translation[1] += dt
	}
	if (keymap["d"]) {
		translation[0] += dt
	}

	if(keymap["q"]) {
		rotation = (rotation + dt/1000)
	}
	if(keymap["e"]) {
		rotation = (rotation - dt/1000)
	}

	transform.translate(translation[0], translation[1])
	transform.rotate(rotation)
	transform.translate(origin[0], origin[1])

}

function init(gl: WebGL2RenderingContext, program: WebGLProgram) {
	const tvao = gl.createVertexArray()
	if(!tvao) {console.error("No vao"); return}
	vao = tvao
	gl.bindVertexArray(vao)

	const transformLocation = gl.getUniformLocation(program, "u_matrix")
	if(!transformLocation) {console.error("No transform attribute"); return}
	transform = Mat3.Projection(gl.canvas.width, gl.canvas.height)
	origin =[-gl.canvas.width/2, -gl.canvas.height/2]
	locs[PLoc.MATRIX] = transformLocation
	gl.uniformMatrix3fv(locs[PLoc.MATRIX], false, new Float32Array(transform.values))

	const colorLocation = gl.getUniformLocation(program, "u_color")
	if(!colorLocation) {console.error("No color location"); return}
	locs[PLoc.COLOR] = colorLocation
	gl.uniform4f(colorLocation, 1,0,0,1)

	const positionBuffer = gl.createBuffer()
	const positionLocation = gl.getAttribLocation(program, "a_position")
	locs[PLoc.POSITION] = positionLocation
	gl.enableVertexAttribArray(positionLocation)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	// Bind buffer (positionbuffer) to the attribute (a_position)
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0, 0,
		0, gl.canvas.height,
		gl.canvas.width, gl.canvas.height
	]), gl.STATIC_DRAW)
}

function draw(gl: WebGL2RenderingContext, program: WebGLProgram, dt: number) {
	resizeCanvas(gl.canvas as HTMLCanvasElement)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	// Clear the canvas
	gl.clearColor(0, 0, 0, 0)
	gl.clear(gl.COLOR_BUFFER_BIT)

	transform = Mat3.Projection(gl.canvas.width, gl.canvas.height)
	update(gl, program, dt)
	gl.uniformMatrix3fv(locs[PLoc.MATRIX], false, new Float32Array(transform.values))

	gl.drawArrays(gl.TRIANGLES, 0, 3)
}

document.addEventListener("keydown", handleKeyDown)
document.addEventListener("keyup", handleKeyUp)

createProgramAndDraw(vertexShaderSource, fragmentShaderSource, init, draw)