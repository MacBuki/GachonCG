var gl;

window.onload = function init(){
    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { 
        alert( "WebGL isn't available" );
    }

    //
    // Configure WebGL
    //

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );  // Gray background for contrast

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    // Load the triangle data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );

    //vertex
    var all = new Float32Array([
        0, 1, -0.5, 0.5, 0.5, 0.5,
        0, 0.5, -0.5, 0, 0.5, 0,
        0, 0, -0.5, -0.5, 0.5, -0.5,
        -0.15, -0.5, 0.15, -0.5, -0.15, -1,
        0.15, -0.5, 0.15, -1, -0.15, -1
    ]);

    gl.bufferData( gl.ARRAY_BUFFER, all, gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // Set uniform variable
    var uColor = gl.getUniformLocation(program, "uColor");   // Set as global

    gl.clear( gl.COLOR_BUFFER_BIT );

    //leaf color
    gl.uniform4fv(uColor, [0.0, 1.0, 0.0, 1.0]); // Green color
    gl.drawArrays( gl.TRIANGLES, 0, 9 );

    //trunk color
    gl.uniform4fv(uColor, [0.5, 0.25, 0.0, 1.0]); // Brown color
    gl.drawArrays( gl.TRIANGLE_FAN, 9, 6 );

    
    render();
};

