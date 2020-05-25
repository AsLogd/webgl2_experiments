import vs_source from "./vertex.vert"
import fs_source from "./fragment.frag"

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
	var shader = gl.createShader(type)
	if (!shader) {
		console.error("Shader is null")
		return null
	}

	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as GLboolean
	if (!success) {
		console.error(gl.getShaderInfoLog(shader))
		gl.deleteShader(shader)
		return null
	}

	return shader
}


function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
	var program = gl.createProgram()
	if (!program) {
		console.error("Program is null")
		return null
	}
	gl.attachShader(program, vertexShader)
	gl.attachShader(program, fragmentShader)
	gl.linkProgram(program)
	var success = gl.getProgramParameter(program, gl.LINK_STATUS) as GLboolean
	if (!success) {
		console.error(gl.getProgramInfoLog(program))
		gl.deleteProgram(program)
		return null
	}

	return program
}

function resize(canvas) {
	// Lookup the size the browser is displaying the canvas.
	var displayWidth  = canvas.clientWidth
	var displayHeight = canvas.clientHeight

	// Check if the canvas is not the same size.
	if (canvas.width  !== displayWidth ||
		canvas.height !== displayHeight) {
		// Make the canvas the same size
		canvas.width  = displayWidth
		canvas.height = displayHeight
	}
}

function main() {
	const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
	const gl = canvas.getContext("webgl2")
	if (!gl) {
		alert("No context!")
		return
	}
	var vertexShader = createShader(gl, gl.VERTEX_SHADER, vs_source)
	var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs_source)
	if (!vertexShader || !fragmentShader) {
		console.error("Shader compilation failed. Stopping.")
		return
	}

	const program = createProgram(gl, vertexShader, fragmentShader)
	if (!program) {
		console.error("Shader linking failed. Stopping.")
		return
	}
	var positionAttributeLocation = gl.getAttribLocation(program, "a_position")

	var positionBuffer = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
	// three 2d points
	var positions = [
		0, 0,
		0, 0.5,
		0.7, 0,
	]
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

	var vao = gl.createVertexArray()
	gl.bindVertexArray(vao)
	gl.enableVertexAttribArray(positionAttributeLocation)
	var size = 2          // 2 components per iteration
	var type = gl.FLOAT   // the data is 32bit floats
	var normalize = false // don't normalize the data
	var stride = 0        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0        // start at the beginning of the buffer
	gl.vertexAttribPointer(
		positionAttributeLocation, size, type, normalize, stride, offset)
	resize(gl.canvas)
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
	// Clear the canvas
	gl.clearColor(0, 0, 0, 0)
	gl.clear(gl.COLOR_BUFFER_BIT)
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program)
	// Bind the attribute/buffer set we want.
	gl.bindVertexArray(vao)

	var primitiveType = gl.TRIANGLES
	var offset = 0
	var count = 3
	gl.drawArrays(primitiveType, offset, count)
}

main()