export default /* glsl */`
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
    // Basis-Farbe (ein helles Rot für übersprungene Objekte)
    vec3 baseColor = vec3(0.996, 0.498, 0.176);
    
    // Langsamere Pulsierung für übersprungene Objekte
    float pulseSpeed = 0.3;
    float pulseRange = 0.2;
    float pulse = pulseRange * sin(uTime * pulseSpeed) + (1.0 - pulseRange);
    
    // Verstärkter Fresnel-Effekt
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(viewDirection, vNormal), 0.0), 3.0);
    
    // Kombiniere Pulse und Fresnel mit stärkerem Fresnel-Einfluss
    vec3 finalColor = baseColor * (pulse + fresnel * 0.8);
    
    // Reduziertes Glühen für übersprungene Objekte
    float glowStrength = 0.3;
    finalColor += baseColor * glowStrength * pulse;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;