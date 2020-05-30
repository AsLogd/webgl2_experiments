import vs_source from "./vertex.vert";
import fs_source from "./fragment.frag";
function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    if (!shader) {
        console.error("Shader is null");
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}
function main() {
    var canvas = document.getElementById("canvas");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("No context!");
        return;
    }
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vs_source);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs_source);
}
main();
