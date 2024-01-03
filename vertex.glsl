#version 300 es

in vec4 a_position;
in vec3 a_normal;
in vec2 a_texcoord;

uniform vec3 u_lightWorldPosition;
uniform vec3 u_viewWorldPosition;
uniform mat4 u_world;
uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;

out vec4 v_position;
out vec3 v_normal;
out vec2 v_texcoord;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

void main() {
    gl_Position = u_worldViewProjection * a_position;
    v_position = normalize(gl_Position);

    v_texcoord = a_texcoord;

    v_normal = mat3(u_worldInverseTranspose) * a_normal;
    vec3 surfaceWorldPosition = (u_world * a_position).xyz;
    v_surfaceToLight = u_lightWorldPosition - surfaceWorldPosition;
    v_surfaceToView = u_viewWorldPosition - surfaceWorldPosition;
}