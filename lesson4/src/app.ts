import {resizeCanvas, createProgramAndDraw} from "./util"
import Mat4 from "./Mat4"
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

let vao: WebGLVertexArrayObject
const locs: Locations = {
	[PLoc.MATRIX]: -1,
	[PLoc.COLOR]: -1,
	[PLoc.POSITION]: -1,
}
let keymap: Keymap = {}
let transform = Mat4.Identity()

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

	transform.translate(translation[0], translation[1], 20)
	transform.xRotate(rotation)

}

function setGeometry(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			// left column front
          0,   0,  0,
          0, 150,  0,
          30,   0,  0,
          0, 150,  0,
          30, 150,  0,
          30,   0,  0,

          // top rung front
          30,   0,  0,
          30,  30,  0,
          100,   0,  0,
          30,  30,  0,
          100,  30,  0,
          100,   0,  0,

          // middle rung front
          30,  60,  0,
          30,  90,  0,
          67,  60,  0,
          30,  90,  0,
          67,  90,  0,
          67,  60,  0,

          // left column back
            0,   0,  30,
           30,   0,  30,
            0, 150,  30,
            0, 150,  30,
           30,   0,  30,
           30, 150,  30,

          // top rung back
           30,   0,  30,
          100,   0,  30,
           30,  30,  30,
           30,  30,  30,
          100,   0,  30,
          100,  30,  30,

          // middle rung back
           30,  60,  30,
           67,  60,  30,
           30,  90,  30,
           30,  90,  30,
           67,  60,  30,
           67,  90,  30,

          // top
            0,   0,   0,
          100,   0,   0,
          100,   0,  30,
            0,   0,   0,
          100,   0,  30,
            0,   0,  30,

          // top rung right
          100,   0,   0,
          100,  30,   0,
          100,  30,  30,
          100,   0,   0,
          100,  30,  30,
          100,   0,  30,

          // under top rung
          30,   30,   0,
          30,   30,  30,
          100,  30,  30,
          30,   30,   0,
          100,  30,  30,
          100,  30,   0,

          // between top rung and middle
          30,   30,   0,
          30,   60,  30,
          30,   30,  30,
          30,   30,   0,
          30,   60,   0,
          30,   60,  30,

          // top of middle rung
          30,   60,   0,
          67,   60,  30,
          30,   60,  30,
          30,   60,   0,
          67,   60,   0,
          67,   60,  30,

          // right of middle rung
          67,   60,   0,
          67,   90,  30,
          67,   60,  30,
          67,   60,   0,
          67,   90,   0,
          67,   90,  30,

          // bottom of middle rung.
          30,   90,   0,
          30,   90,  30,
          67,   90,  30,
          30,   90,   0,
          67,   90,  30,
          67,   90,   0,

          // right of bottom
          30,   90,   0,
          30,  150,  30,
          30,   90,  30,
          30,   90,   0,
          30,  150,   0,
          30,  150,  30,

          // bottom
          0,   150,   0,
          0,   150,  30,
          30,  150,  30,
          0,   150,   0,
          30,  150,  30,
          30,  150,   0,

          // left side
          0,   0,   0,
          0,   0,  30,
          0, 150,  30,
          0,   0,   0,
          0, 150,  30,
          0, 150,   0,]),
		gl.STATIC_DRAW
	)
}

function setColors(gl) {
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Uint8Array([
		// left column front
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,

		// top rung front
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,

		// middle rung front
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,
		200,  70, 120,

		// left column back
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,

		// top rung back
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,

		// middle rung back
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,
		80, 70, 200,

		// top
		70, 200, 210,
		70, 200, 210,
		70, 200, 210,
		70, 200, 210,
		70, 200, 210,
		70, 200, 210,

		// top rung right
		200, 200, 70,
		200, 200, 70,
		200, 200, 70,
		200, 200, 70,
		200, 200, 70,
		200, 200, 70,

		// under top rung
		210, 100, 70,
		210, 100, 70,
		210, 100, 70,
		210, 100, 70,
		210, 100, 70,
		210, 100, 70,

		// between top rung and middle
		210, 160, 70,
		210, 160, 70,
		210, 160, 70,
		210, 160, 70,
		210, 160, 70,
		210, 160, 70,

		// top of middle rung
		70, 180, 210,
		70, 180, 210,
		70, 180, 210,
		70, 180, 210,
		70, 180, 210,
		70, 180, 210,

		// right of middle rung
		100, 70, 210,
		100, 70, 210,
		100, 70, 210,
		100, 70, 210,
		100, 70, 210,
		100, 70, 210,

		// bottom of middle rung.
		76, 210, 100,
		76, 210, 100,
		76, 210, 100,
		76, 210, 100,
		76, 210, 100,
		76, 210, 100,

		// right of bottom
		140, 210, 80,
		140, 210, 80,
		140, 210, 80,
		140, 210, 80,
		140, 210, 80,
		140, 210, 80,

		// bottom
		90, 130, 110,
		90, 130, 110,
		90, 130, 110,
		90, 130, 110,
		90, 130, 110,
		90, 130, 110,

		// left side
		160, 160, 220,
		160, 160, 220,
		160, 160, 220,
		160, 160, 220,
		160, 160, 220,
		160, 160, 220,
		]),
		gl.STATIC_DRAW
	)
}

function init(gl: WebGL2RenderingContext, program: WebGLProgram) {
	const tvao = gl.createVertexArray()
	if(!tvao) {console.error("No vao"); return}
	vao = tvao
	gl.bindVertexArray(vao)

	const transformLocation = gl.getUniformLocation(program, "u_matrix")
	if(!transformLocation) {console.error("No transform attribute"); return}
	transform = Mat4.Ortho(0, gl.canvas.width, gl.canvas.height, 0, 400, -400)
	locs[PLoc.MATRIX] = transformLocation
	gl.uniformMatrix4fv(locs[PLoc.MATRIX], false, new Float32Array(transform.values))

	/*
	const colorLocation = gl.getUniformLocation(program, "u_color")
	if(!colorLocation) {console.error("No color location"); return}
	locs[PLoc.COLOR] = colorLocation
	gl.uniform4f(colorLocation, 1,0,0,1)
*/
	const positionBuffer = gl.createBuffer()
	const positionLocation = gl.getAttribLocation(program, "a_position")
	locs[PLoc.POSITION] = positionLocation
	gl.enableVertexAttribArray(positionLocation)
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	// Bind buffer (positionbuffer) to the attribute (a_position)
	gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0)
	setGeometry(gl)

	const colorBuffeer = gl.createBuffer()
	const colorLocation = gl.getAttribLocation(program, "a_color")
	locs[PLoc.COLOR] = colorLocation
	gl.enableVertexAttribArray(colorLocation)
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffeer)
	gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0)
	setColors(gl)
}

function draw(gl: WebGL2RenderingContext, program: WebGLProgram, dt: number) {
	gl.enable(gl.CULL_FACE)
	gl.enable(gl.DEPTH_TEST)
	resizeCanvas(gl.canvas as HTMLCanvasElement)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	// Clear the canvas
	gl.clearColor(0, 0, 0, 0)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	transform = Mat4.Ortho(0, gl.canvas.width, gl.canvas.height, 0, 400, -400)
	update(gl, program, dt)

	gl.uniformMatrix4fv(locs[PLoc.MATRIX], false, new Float32Array(transform.values))

	gl.drawArrays(gl.TRIANGLES, 0, 16 * 6)
}

document.addEventListener("keydown", handleKeyDown)
document.addEventListener("keyup", handleKeyUp)

createProgramAndDraw(vertexShaderSource, fragmentShaderSource, init, draw)