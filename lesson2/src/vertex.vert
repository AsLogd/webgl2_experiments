#version 300 es

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;

uniform vec2 u_resolution;
uniform float u_rotation;
uniform vec2 u_translation;

// all shaders have a main function
void main() {

	float a = cos(u_rotation);
	float b = sin(u_rotation);
	mat2 rotation = mat2(
		a, -b,
		b, a
	);
	vec2 posRot = a_position*rotation + u_translation;

	// 0 to 1
	vec2 normalizedPosition = posRot/ u_resolution;
	// -1 to 1
	vec2 clipSpace = normalizedPosition*2.0 - 1.0;
	gl_Position = vec4(clipSpace, 0, 1);
}