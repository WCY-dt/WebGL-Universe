"use strict";

var spherePrecision = 30;
var planetScale = 0.00005;
var sunScale = 0.000001;
var orbitScale = 0.5;
var rotationSpeed = 0.01;
var cameraDistance = 2000;

// Setup a ui.
webglUI.setupSlider("#spherePrecision", { slide: function (event, ui) { spherePrecision = ui.value; main(); }, min: 10, max: 120, step: 10, precision: 0, uiMult: 1, value: 30 });
webglUI.setupSlider("#planetScale", { slide: function (event, ui) { planetScale = ui.value; main(); }, min: 0.000001, max: 0.0001, step: 0.000001, precision: 5, value: 0.00005 });
webglUI.setupSlider("#sunScale", { slide: function (event, ui) { sunScale = ui.value; main(); }, min: 0.0000001, max: 0.00001, step: 0.0000005, precision: 5, value: 0.000001 });
webglUI.setupSlider("#orbitScale", { slide: function (event, ui) { orbitScale = ui.value; main(); }, min: 0.1, max: 1, step: 0.1, precision: 1, value: 0.5 });
webglUI.setupSlider("#rotationSpeed", { slide: function (event, ui) { rotationSpeed = ui.value; main(); }, min: 0.001, max: 0.05, step: 0.001, precision: 2, value: 0.01 });

var vs, fs;

fetchAndUseShaders('vertex.glsl', 'fragment.glsl');

async function fetchShader(file) {
    const response = await fetch(file);
    const text = await response.text();
    return text;
}

async function fetchAndUseShaders(vsSrc, fsSRc) {
    vs = await fetchShader(vsSrc);
    console.log(vs);

    fs = await fetchShader(fsSRc);
    console.log(fs);

    main();
}

var Node = function () {
    this.children = [];
    this.localMatrix = m4.identity();
    this.worldMatrix = m4.identity();
};

Node.prototype.setParent = function (parent) {
    if (this.parent) {
        var ndx = this.parent.children.indexOf(this);
        if (ndx >= 0) {
            this.parent.children.splice(ndx, 1);
        }
    }
    if (parent) {
        parent.children.push(this);
    }
    this.parent = parent;
};

Node.prototype.updateWorldMatrix = function (matrix) {
    if (matrix) {
        m4.multiply(matrix, this.localMatrix, this.worldMatrix);
    } else {
        m4.copy(this.localMatrix, this.worldMatrix);
    }
    var worldMatrix = this.worldMatrix;
    this.children.forEach(function (child) {
        child.updateWorldMatrix(worldMatrix);
    });
};

function main() {
    /* Initialize WebGL */
    // Get A WebGL context
    var canvas = document.querySelector("#canvas");
    var gl = canvas.getContext("webgl2");
    if (!gl) {
        return;
    }
    twgl.setAttributePrefix("a_");

    // Initialize sphere
    var sphereBufferInfo = flattenedPrimitives.createSphereBufferInfo(
        gl,
        10,
        spherePrecision,
        Math.floor(spherePrecision / 2)
    );

    // setup GLSL program
    var programInfo = twgl.createProgramInfo(gl, [vs, fs]);
    var sphereVAO = twgl.createVAOFromBufferInfo(gl, programInfo, sphereBufferInfo);
    var fieldOfViewRadians = degToRad(60);

    /* Initialize nodes */
    // orbit and radius
    var solarSystemNode = new Node();
    var mercuryOrbitNode = new Node();
    mercuryOrbitNode.localMatrix = m4.translation(58 * orbitScale, 0, 0);
    var venusOrbitNode = new Node();
    venusOrbitNode.localMatrix = m4.translation(108 * orbitScale, 0, 0);
    var earthOrbitNode = new Node();
    earthOrbitNode.localMatrix = m4.translation(149 * orbitScale, 0, 0);
    var moonOrbitNode = new Node();
    moonOrbitNode.localMatrix = m4.translation(30 * orbitScale, 0, 0);
    var marsOrbitNode = new Node();
    marsOrbitNode.localMatrix = m4.translation(227 * orbitScale, 0, 0);
    var jupiterOrbitNode = new Node();
    jupiterOrbitNode.localMatrix = m4.translation(778 * orbitScale, 0, 0);
    var saturnOrbitNode = new Node();
    saturnOrbitNode.localMatrix = m4.translation(1426 * orbitScale, 0, 0);
    var uranusOrbitNode = new Node();
    uranusOrbitNode.localMatrix = m4.translation(2870 * orbitScale, 0, 0);
    var neptuneOrbitNode = new Node();
    neptuneOrbitNode.localMatrix = m4.translation(4498 * orbitScale, 0, 0);
    // planet
    var sunNode = generateNode(
        696000 * sunScale,
        true,
        "./public/Sun.webp"
    );
    var mercuryNode = generateNode(
        2439 * planetScale,
        false,
        "./public/Mercury.webp"
    );
    var venusNode = generateNode(
        6052 * planetScale,
        false,
        "./public/Venus.webp"
    );
    var earthNode = generateNode(
        6371 * planetScale,
        false,
        "./public/Earth.webp"
    );
    var marsNode = generateNode(
        3389 * planetScale,
        false,
        "./public/Mars.webp"
    );
    var jupiterNode = generateNode(
        69911 * planetScale,
        false,
        "./public/Jupiter.webp"
    );
    var saturnNode = generateNode(
        58232 * planetScale,
        false,
        "./public/Saturn.webp"
    );
    var uranusNode = generateNode(
        25362 * planetScale,
        false,
        "./public/Uranus.webp"
    );
    var neptuneNode = generateNode(
        24622 * planetScale,
        false,
        "./public/Neptune.webp"
    );
    var moonNode = generateNode(
        1737 * planetScale,
        false,
        "./public/Moon.webp"
    );
    // trackball
    var trackballNode = new Node();
    trackballNode.localMatrix = m4.translation(0, cameraDistance, 0);

    /* hierarchy */
    sunNode.setParent(solarSystemNode);
    mercuryOrbitNode.setParent(solarSystemNode);
    mercuryNode.setParent(mercuryOrbitNode);
    venusOrbitNode.setParent(solarSystemNode);
    venusNode.setParent(venusOrbitNode);
    earthOrbitNode.setParent(solarSystemNode);
    earthNode.setParent(earthOrbitNode);
    moonOrbitNode.setParent(earthOrbitNode);
    moonNode.setParent(moonOrbitNode);
    marsOrbitNode.setParent(solarSystemNode);
    marsNode.setParent(marsOrbitNode);
    jupiterOrbitNode.setParent(solarSystemNode);
    jupiterNode.setParent(jupiterOrbitNode);
    saturnOrbitNode.setParent(solarSystemNode);
    saturnNode.setParent(saturnOrbitNode);
    uranusOrbitNode.setParent(solarSystemNode);
    uranusNode.setParent(uranusOrbitNode);
    neptuneOrbitNode.setParent(solarSystemNode);
    neptuneNode.setParent(neptuneOrbitNode);
    trackballNode.setParent(solarSystemNode);

    /* trackball */
    trackballControl();

    /* draw */
    var objects = [
        sunNode,
        mercuryNode,
        venusNode,
        earthNode,
        moonNode,
        marsNode,
        jupiterNode,
        saturnNode,
        uranusNode,
        neptuneNode,
    ];
    var objectsToDraw = [
        sunNode.drawInfo,
        mercuryNode.drawInfo,
        venusNode.drawInfo,
        earthNode.drawInfo,
        moonNode.drawInfo,
        marsNode.drawInfo,
        jupiterNode.drawInfo,
        saturnNode.drawInfo,
        uranusNode.drawInfo,
        neptuneNode.drawInfo,
    ];
    requestAnimationFrame(drawScene);

    /* functions */

    function degToRad(d) {
        return d * Math.PI / 180;
    }

    function generateNode(scale, isSun, textureSrc) {
        var planetNode = new Node();
        planetNode.localMatrix = m4.scaling(scale, scale, scale);
        planetNode.drawInfo = {
            uniforms: {
                u_shininess: 150,
                u_lightColor: m4.normalize([1, 1, 1]),
                u_specularColor: m4.normalize([1, 1, 1]),
                u_lightWorldPosition: [0, 0, 0],
                u_isSun: isSun,
            },
            programInfo: programInfo,
            bufferInfo: sphereBufferInfo,
            vertexArray: sphereVAO,
        };
        
        var img = new Image();
        img.onload = function () {
            const texture = twgl.createTexture(gl, {
                src: img
            });
            planetNode.drawInfo.uniforms.u_texture = texture;
        };
        img.src = textureSrc;

        return planetNode;
    }

    function drawScene(time) {
        time *= 0.001;

        twgl.resizeCanvasToDisplaySize(gl.canvas);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var projectionMatrix =
            m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

        var cameraPosition = trackballNode.worldMatrix.slice(12, 15);
        var target = [0, 0, 0];
        var up = [0, 0, 1];
        var cameraMatrix = m4.lookAt(cameraPosition, target, up);

        var viewMatrix = m4.inverse(cameraMatrix);

        var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

        // orbit
        m4.multiply(m4.yRotation(100 / 87.97 * rotationSpeed), mercuryOrbitNode.localMatrix, mercuryOrbitNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 224.7 * rotationSpeed), venusOrbitNode.localMatrix, venusOrbitNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 365.24 * rotationSpeed), earthOrbitNode.localMatrix, earthOrbitNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 686.98 * rotationSpeed), marsOrbitNode.localMatrix, marsOrbitNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 11.8565 / 365 * rotationSpeed), jupiterOrbitNode.localMatrix, jupiterOrbitNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 29.448 / 365 * rotationSpeed), saturnOrbitNode.localMatrix, saturnOrbitNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 84.02 / 365 * rotationSpeed), uranusOrbitNode.localMatrix, uranusOrbitNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 164.79 / 365 * rotationSpeed), neptuneOrbitNode.localMatrix, neptuneOrbitNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 27.32 * rotationSpeed), moonOrbitNode.localMatrix, moonOrbitNode.localMatrix);
        // spin
        m4.multiply(m4.yRotation(100 / 58.646 * rotationSpeed), mercuryNode.localMatrix, mercuryNode.localMatrix);
        m4.multiply(m4.yRotation(-100 / 243.02 * rotationSpeed), venusNode.localMatrix, venusNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 0.997 * rotationSpeed), earthNode.localMatrix, earthNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 1.026 * rotationSpeed), marsNode.localMatrix, marsNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 0.410 * rotationSpeed), jupiterNode.localMatrix, jupiterNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 0.426 * rotationSpeed), saturnNode.localMatrix, saturnNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 0.718 * rotationSpeed), uranusNode.localMatrix, uranusNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 0.671 * rotationSpeed), neptuneNode.localMatrix, neptuneNode.localMatrix);
        m4.multiply(m4.yRotation(100 / 27.32 * rotationSpeed), moonNode.localMatrix, moonNode.localMatrix);

        solarSystemNode.updateWorldMatrix();

        objects.forEach(function (object) {
            var worldViewProjectionMatrix = m4.multiply(viewProjectionMatrix, object.worldMatrix);
            var worldInverseMatrix = m4.inverse(object.worldMatrix);
            var worldInverseTransposeMatrix = m4.transpose(worldInverseMatrix);

            object.drawInfo.uniforms.u_world = object.worldMatrix;
            object.drawInfo.uniforms.u_worldViewProjection = worldViewProjectionMatrix;
            object.drawInfo.uniforms.u_worldInverseTranspose = worldInverseTransposeMatrix;

            object.drawInfo.uniforms.u_viewWorldPosition = cameraPosition;
        });

        twgl.drawObjectList(gl, objectsToDraw);

        requestAnimationFrame(drawScene);
    }

    function trackballControl() {
        var mouseDown = false;
        var lastMouseX = null;
        var lastMouseY = null;

        canvas.onmousedown = function (e) {
            mouseDown = true;
            lastMouseX = e.clientX;
            lastMouseY = e.clientY;
        };

        canvas.onmouseup = function (e) {
            mouseDown = false;
        };

        canvas.onmousemove = function (e) {
            if (!mouseDown) {
                return;
            }
            var newX = e.clientX;
            var newY = e.clientY;

            var deltaX = newX - lastMouseX;
            var deltaY = newY - lastMouseY;

            var newRotationMatrix = m4.multiply(m4.xRotation(deltaY * 0.01), m4.yRotation(deltaX * 0.01));
            trackballNode.localMatrix = m4.multiply(newRotationMatrix, trackballNode.localMatrix);

            lastMouseX = newX;
            lastMouseY = newY;
        };

        canvas.onwheel = function (e) {
            var scale = 1 + e.deltaY * 0.001;
            var newScaleMatrix = m4.scaling(scale, scale, scale);
            trackballNode.localMatrix = m4.multiply(newScaleMatrix, trackballNode.localMatrix);
        };
    }
}
