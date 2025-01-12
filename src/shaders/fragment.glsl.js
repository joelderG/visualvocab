// export default /* glsl */`
// uniform sampler2D uTexture;
// uniform float uTime; 

// varying vec3 vPosition; 
// varying vec3 vNormal; 
// varying vec2 vUv; 

// void main() {
// 	vec2 uv = vUv;
// 	uv.y += uTime; 
//     gl_FragColor = vec4(vec3(step(0.5, fract(uv.y * 50.0))), 1.0);
// }
// `;

export default /* glsl */`
uniform float uTime;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
    // Basis-Farbe (ein dunkleres Grün)
    vec3 baseColor = vec3(0.0, 0.7, 0.2);
    
    // Pulsierender Faktor basierend auf der Zeit
    float pulseSpeed = 0.5;
    float pulseRange = 0.3;
    float pulse = pulseRange * sin(uTime * pulseSpeed) + (1.0 - pulseRange);
    
    // Fresnel-Effekt für Kanten-Glühen
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 2.0);
    
    // Kombiniere Pulse und Fresnel
    vec3 finalColor = baseColor * (pulse + fresnel * 0.5);
    
    // Addiere extra Helligkeit für Glühen
    float glowStrength = 0.4;
    finalColor += baseColor * glowStrength * pulse;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;