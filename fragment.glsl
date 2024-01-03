#version 300 es

precision highp float;

in vec4 v_position;
in vec3 v_normal;
in vec2 v_texcoord;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;

uniform sampler2D u_texture;
uniform float u_shininess;
uniform vec3 u_lightColor;
uniform vec3 u_specularColor;

uniform bool u_isSun;

out vec4 outColor;

void main() {

    vec3 normal = normalize(v_normal);

    vec3 surfaceToLightDirection = normalize(v_surfaceToLight);
    vec3 surfaceToViewDirection = normalize(v_surfaceToView);
    vec3 halfVector = normalize(surfaceToLightDirection + surfaceToViewDirection);

    float light = dot(normal, surfaceToLightDirection);
    float specular = 0.0;
    if(light > 0.0) {
        specular = pow(dot(normal, halfVector), u_shininess);
    }

    outColor = texture(u_texture, v_texcoord);

    if(!u_isSun) {
        outColor.rgb *= light * u_lightColor;
        outColor.rgb += specular * u_specularColor;
    }
}