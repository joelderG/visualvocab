// export default /* glsl */`
// uniform float uTime; 

// varying vec3 vPosition; 
// varying vec3 vNormal;
// varying vec2 vUv; 

// void main() {
//     vPosition = position; 
//     vNormal = normal;
//     vUv = uv; 

// 	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
// }
// `;


export default /* glsl */`
uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;