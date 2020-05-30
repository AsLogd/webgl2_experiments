import vss from "./vertex.vert"
import fss from "./fragment.frag"

function resize(canvas: HTMLCanvasElement): void {
	const cw = canvas.clientWidth
	const ch = canvas.clientHeight
	if (canvas.width !== cw || canvas.height !== ch) {
		canvas.width = cw
		canvas.height = ch
	}
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
	const program = gl.createProgram()
	if(!program) {console.error("Can't create program"); return null}
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	const status = gl.getProgramParameter(program, gl.LINK_STATUS) as GLboolean
	if (!status) {
		console.error("Linking failed: ", gl.getProgramInfoLog(program))
		gl.deleteProgram(program)
		return null
	}

	return program
}


function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
	const shader = gl.createShader(type)
	if(!shader){console.error("cant create a shader"); return null}
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as GLboolean
	if (!success) {
		console.error("Can't compile shader with source:", source, "Log:", gl.getShaderInfoLog(shader))
		gl.deleteShader(shader)
		return null
	}
	return shader
}

function main() {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement | null
	if(!canvas){console.error("no canvas"); return}

	resize(canvas)

	const gl = canvas.getContext("webgl2")
	if(!gl){console.error("no context"); return}


	//1 - Create a program (link shaders)
	console.info("Creating program...")
	const vs = createShader(gl, gl.VERTEX_SHADER, vss)
	if(!vs){console.error("no vertex shader"); return}

	const fs = createShader(gl, gl.FRAGMENT_SHADER, fss)
	if(!fs){console.error("no fragment shader"); return}

	const program = createProgram(gl, vs, fs)
	if(!program){console.error("no program"); return}
	gl.useProgram(program)

	//2 - Create buffers and assign to attributes
	console.info("Creating buffers...")
	const vao = gl.createVertexArray()
	if(!vao){console.error("no vao"); return}
	gl.bindVertexArray(vao)

	const positions = [
		0, 0,
		0, -canvas.height,
		canvas.width, 0,
	]

	const positionsBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
	const positionLocation = gl.getAttribLocation(program, "a_position")

	gl.enableVertexAttribArray(positionLocation)
	// This should bind attribute to ARRAY_BUFFER
	gl.vertexAttribPointer(
		positionLocation, 	// Attribute index
		2, 					// Values per iteration
		gl.FLOAT,			// Size of each value
		false, 				// Normalize (map values to the 0-1 range?)
		0, 					// stride
		0					//offset
	)

	const resolutionLocation = gl.getUniformLocation(program, "u_resolution")
	gl.uniform2f(resolutionLocation, canvas.width, canvas.height)

	//3 - draw
	console.info("Drawing...")
	gl.clearColor(0,0,0,0)
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.drawArrays(gl.TRIANGLES, 0, 3)

}

main()