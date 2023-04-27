uniform vec3        color;
uniform sampler2D texture;

varying vec2 v_uv;

void main() {
    if( texture2D(texture, v_uv).a < 0.5) discard;
  gl_FragColor = vec4(color, 1.0)
}