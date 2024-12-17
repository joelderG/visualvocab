export default /* glsl */`
uniform sampler2D uTexture;
uniform float uTime; 

varying vec3 vPosition; 
varying vec3 vNormal; 
varying vec2 vUv; 

void main() {
	vec2 uv = vUv;
	uv.y += uTime; 
    gl_FragColor = vec4(vec3(step(0.5, fract(uv.y * 50.0))), 1.0);
}
`;
