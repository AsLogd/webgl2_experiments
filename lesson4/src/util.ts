type DrawFunction = (ctx: WebGL2RenderingContext, program: WebGLProgram, delta: number) => void
type InitFunction = (ctx: WebGL2RenderingContext, program: WebGLProgram) => void

export function resizeCanvas(canvas: HTMLCanvasElement) {
	const cw = canvas.clientWidth
	const ch = canvas.clientHeight
	if (canvas.height !== ch || canvas.width !== cw) {
		canvas.width = canvas.clientWidth
		canvas.height = canvas.clientHeight
	}
}


function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
	const shader = gl.createShader(type)
	if(!shader) {console.error("Can't create shader"); return null}
	gl.shaderSource(shader, source)
	gl.compileShader(shader)
	const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS) as GLboolean
	if (!success) {
		const log = gl.getShaderInfoLog(shader)
		console.error("Shader compilation failed:", log)
		gl.deleteShader(shader)
		return null
	}

	return shader
}

function createProgram(gl: WebGLRenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram | null {
	const program = gl.createProgram()
	if(!program) {console.error("Can't create program"); return null}
	gl.attachShader(program, vs)
	gl.attachShader(program, fs)
	gl.linkProgram(program)
	const success = gl.getProgramParameter(program, gl.LINK_STATUS) as GLboolean
	if (!success) {
		const log = gl.getProgramInfoLog(program)
		console.error("Couldn't link program:", log)
		gl.deleteProgram(program)
		return null
	}

	return program
}


let lastTime = Date.now()
function drawLoop(ms: number, draw: (number) => void) {
	const dt = ms - lastTime
	draw(dt)
	lastTime = ms
	requestAnimationFrame(ms2 => drawLoop(ms2, draw))
}

export function createProgramAndDraw(
	vertexShaderSource: string,
	fragmentShaderSource: string,
	initCb: InitFunction,
	drawCb: DrawFunction
) {
	const canvas = document.getElementById("canvas") as HTMLCanvasElement | null
	if(!canvas) {console.error("Canvas not found"); return}
	resizeCanvas(canvas)
	const gl = canvas.getContext("webgl2")
	if(!gl) {console.error("No context"); return}

	// 1-create program
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
	if(!vertexShader) {console.error("No Vertex shader"); return}
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
	if(!fragmentShader) {console.error("No fragment shader"); return}
	const program = createProgram(gl, vertexShader, fragmentShader)
	if(!program) {console.error("No program"); return}

	gl.useProgram(program)
	initCb(gl, program)

	const draw = (dt: number) => drawCb(gl, program, dt)
	draw(0)

	// 3-Clear canvas, draw
	requestAnimationFrame((t) => {
		drawLoop(t, draw)
	})


}