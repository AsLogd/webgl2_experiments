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


function renderSun(gl: WebGLRenderingContext,
	colorLocation: WebGLUniformLocation,
	origin: [number, number], size: number) {
	gl.uniform4f(colorLocation, 254/255, 220/255, 11/255, 1)
	const pos = [
		size/2, 0,
		0, -size,
		size, -size,
		0, -size/4,
		size, -size/4,
		size/2, -5*size/4
	]

	const transformed = pos.map((x,i) =>
		i % 2 == 0
			? x+origin[0]
			: x+origin[1]
	)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(transformed), gl.STATIC_DRAW)
	gl.drawArrays(gl.TRIANGLES, 0, 6)
}

function getRectanglePoints(pos: [number, number], width: number, height: number) {
	const points = [
		0, -height,
		width, 0,
		0, 0,
		0, -height,
		width, -height,
		width, 0
	]
	const transformed = points.map((x,i) =>
		i % 2 == 0
			? x+pos[0]-width/2
			: x+pos[1]+height/2
	)
	return transformed
}

function renderClouds(gl: WebGLRenderingContext, colorLocation: WebGLUniformLocation, canvas: HTMLCanvasElement) {
	gl.uniform4f(colorLocation, 1, 1, 1, 1)
	const quantity = Math.random()*15+5
	for (let i = 0; i < quantity; i++) {
		const x = Math.random()*canvas.width
		const y = -Math.random()*canvas.height
		const size = Math.random()*300
		const rekt = getRectanglePoints([x,y], size, size/5)
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rekt), gl.STATIC_DRAW)
		gl.drawArrays(gl.TRIANGLES, 0, 6)
		let levels = 0
		if(size > 300) {
			levels = 3
		} else if (size > 150) {
			levels = 2
		} else if (size > 50) {
			levels = 1
		}
		for (let j = 1; j <= levels; j++) {
			const currentSize = size - j*size/4
			const currentY = y + j*size/12
			const currentX = x - size/2 + currentSize/2 + j*20
			const currentRekt = getRectanglePoints([currentX, currentY], currentSize, currentSize/4)
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(currentRekt), gl.STATIC_DRAW)
			gl.drawArrays(gl.TRIANGLES, 0, 6)
		}
	}

}

function renderGround(gl: WebGLRenderingContext, colorLocation: WebGLUniformLocation, canvas: HTMLCanvasElement) {
	gl.uniform4f(colorLocation, 0.20, 0.66, 0.33, 1)
	const rekt = getRectanglePoints([canvas.width/2, -7*canvas.height/8], canvas.width, canvas.height/3)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rekt), gl.STATIC_DRAW)
	gl.drawArrays(gl.TRIANGLES, 0, 6)
}

function renderHouse(gl: WebGLRenderingContext, colorLocation: WebGLUniformLocation, pos: [number, number], size: number) {
	gl.uniform4f(colorLocation, 1, 0, 0, 1)
	const roofpoints = [
		0, 0,
		-size/2, -size/3,
		size/2, -size/3,
	]
	const roofT = roofpoints.map((x, i) =>
		i % 2 == 0
			? x+pos[0]
			: x+pos[1]
	)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(roofT), gl.STATIC_DRAW)
	gl.drawArrays(gl.TRIANGLES, 0, 3)

	gl.uniform4f(colorLocation, 0.8, 0.6, 0.6, 1)
	const rekt = getRectanglePoints([0, -2*size/3], 4*size/6, 2*size/3)
	const rektT = rekt.map((x, i) =>
		i % 2 == 0
			? x+pos[0]
			: x+pos[1]
	)
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rektT), gl.STATIC_DRAW)
	gl.drawArrays(gl.TRIANGLES, 0, 6)
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


	const colorLocation = gl.getUniformLocation(program, "u_color")
	const err = gl.getError()
	if(err !== gl.NO_ERROR) {
		console.error(err)
	}
	if(!colorLocation){console.error("program has no color uniform:", colorLocation); return}

	//3 - draw
	console.info("Drawing...")
	gl.clearColor(0.69, 0.87, 0.96, 1)
	gl.clear(gl.COLOR_BUFFER_BIT)
	/*
	for(let i = 10; i > 0; i--) {
		const proc_pos = [
			i*2, -i*2,
			i*2, -i*2-10,
			i*2+10, -i*2
		]
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(proc_pos.map(x => x*10)), gl.STATIC_DRAW)
		gl.drawArrays(gl.TRIANGLES, 0, 3)
	}
	*/
	renderSun(gl, colorLocation, [200, -100], 200)
	renderClouds(gl, colorLocation, canvas)
	renderGround(gl, colorLocation, canvas)
	renderHouse(gl, colorLocation, [canvas.width/2, -4.5*canvas.height/8], 200)
}

main()