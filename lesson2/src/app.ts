import {resizeCanvas, createProgramAndDraw} from "./util"
import vertexShaderSource from "./vertex.vert"
import fragmentShaderSource from "./fragment.frag"

enum PLoc {
	RESOLUTION 	= "u_resolution",
	TRANSLATION = "u_translation",
	ROTATION 	= "u_rotation",
	COLOR 		= "u_color",
	POSITION 	= "a_position"
}
type Locations = {[loc in PLoc]: number | WebGLUniformLocation}
type Keymap = {[key: string]: boolean}


let vao: WebGLVertexArrayObject
const locs: Locations = {
	[PLoc.RESOLUTION]: -1,
	[PLoc.TRANSLATION]: -1,
	[PLoc.ROTATION]: -1,
	[PLoc.COLOR]: -1,
	[PLoc.POSITION]: -1,
}
let keymap: Keymap = {}
let translation = [0, 0]
let rotation = 0

function handleKeyDown(ev: KeyboardEvent) {
	if(ev.repeat) return
	keymap[ev.key] = true
}

function handleKeyUp(ev: KeyboardEvent) {
	keymap[ev.key] = false
}

function update(gl: WebGL2RenderingContext, program: WebGLProgram, dt: number) {

	if (keymap["w"]) {
		translation[1] += dt
	}
	if (keymap["a"]) {
		translation[0] -= dt
	}
	if (keymap["s"]) {
		translation[1] -= dt
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
}

function init(gl: WebGL2RenderingContext, program: WebGLProgram) {
	const tvao = gl.createVertexArray()
	if(!tvao) {console.error("No vao"); return}
	vao = tvao
	gl.bindVertexArray(vao)

	const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
	if(!resolutionLocation) {console.error("No resolution attribute"); return}
	locs[PLoc.RESOLUTION] = resolutionLocation
	gl.uniform2f(locs[PLoc.RESOLUTION], gl.canvas.width, gl.canvas.height)

	const translationLocation = gl.getUniformLocation(program, "u_translation")
	if(!translationLocation) {console.error("No translation location"); return}
	locs[PLoc.TRANSLATION] = translationLocation
	gl.uniform2fv(translationLocation, translation)


	const rotationLocation = gl.getUniformLocation(program, "u_rotation")
	if(!rotationLocation) {console.error("No rotation location"); return}
	locs[PLoc.ROTATION] = rotationLocation
	gl.uniform1f(rotationLocation, rotation)

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

	update(gl, program, dt)
	gl.uniform2fv(locs[PLoc.TRANSLATION], translation)
	gl.uniform1f(locs[PLoc.ROTATION], rotation)

	gl.drawArrays(gl.TRIANGLES, 0, 3)
}

document.addEventListener("keydown", handleKeyDown)
document.addEventListener("keyup", handleKeyUp)

createProgramAndDraw(vertexShaderSource, fragmentShaderSource, init, draw)