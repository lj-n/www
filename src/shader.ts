import { Color, Vector3 } from "three";

/**
 * https://github.com/mrdoob/three.js/blob/dev/examples/jsm/shaders/ToonShader.js
 */

const Shader = {
	uniforms: {
		uDirLightPos: { value: new Vector3(0.6, 0.5, 0.8) },

		uDirLightColor: { value: new Color(0xffffff) },
		uAmbientLightColor: { value: new Color(0x000000) },
		uBaseColor: { value: new Color(0xff7b72) },
		uLineColor: { value: new Color(0x000000) },
	},

	vertexShader: /* glsl */ `
		varying vec3 vNormal;
		void main() {
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			vNormal = normalize( normalMatrix * normal );
		}`,

	fragmentShader: /* glsl */ `
		uniform vec3 uBaseColor;
		uniform vec3 uLineColor;
		uniform vec3 uDirLightPos;
		uniform vec3 uDirLightColor;
		uniform vec3 uAmbientLightColor;
		varying vec3 vNormal;
		void main() {
		float directionalLightWeighting = max( dot( normalize(vNormal), uDirLightPos ), 0.0);
		vec3 lightWeighting = uAmbientLightColor + uDirLightColor * directionalLightWeighting;
		gl_FragColor = vec4( uBaseColor, 1.0 );
		if ( length(lightWeighting) < 1.00 ) {
				if ( ( mod(gl_FragCoord.x, 4.001) + mod(gl_FragCoord.y, 4.0) ) > 6.00 ) {
					gl_FragColor = vec4( uLineColor, 1.0 );
				}
			}
			if ( length(lightWeighting) < 0.50 ) {
				if ( ( mod(gl_FragCoord.x + 2.0, 4.001) + mod(gl_FragCoord.y + 2.0, 4.0) ) > 6.00 ) {
					gl_FragColor = vec4( uLineColor, 1.0 );
				}
			}
		}`,
};

export { Shader };
