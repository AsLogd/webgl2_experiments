#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

uniform vec2 u_resolution;

// all shaders have a main function
void main() {

	vec2 screenSpace = (a_position / u_resolution) ;
	vec2 clipSpace = screenSpace*2.0 - 1.0 * vec2(1.0, -1.0);
	gl_Position = vec4(clipSpace, 0, 1);
}