//Scene setup
		var clock = new THREE.Clock(true);
		var scene = new THREE.Scene();
		var canvas = document.querySelector("canvas");
		var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
		var renderer = new THREE.WebGLRenderer();
		renderer.setSize({canvas: canvas});
		document.body.appendChild(renderer.domElement);
		var numCubes = 10;



		var shadervs = 
		`
			void main() {
            gl_Position =  projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        	}
		`;

		var shaderfs = 
		`
		 	uniform vec2 u_resolution;
	        uniform float u_time;

	        const float pps = 100.0; //pixes per second

	        void main() {

	        	float posy = gl_FragCoord.y + sin(u_time) * pps;
	        	float posx = gl_FragCoord.x + u_time * -pps;

	        	float color = mod(posy, u_resolution.y/2.0);

	            vec2 st = gl_FragCoord.xy/u_resolution.xy;
	            //gl_FragColor=vec4(0.5, 0.2, 0.2, 1.0);
	            gl_FragColor=vec4(0.5* color, 0.2 * color, 0.2* color, 1.0);
	        }
		`;

		    var uniforms = {
                u_time: { type: "f", value: 1.0 },
                u_resolution: { type: "v2", value: new THREE.Vector2() },
                u_mouse: { type: "v2", value: new THREE.Vector2() }
            };


		    var planematerial = new THREE.ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: shadervs,
                fragmentShader: shaderfs
            } );

		//geometry
		var cubeGeometry = new THREE.BoxGeometry(1, 1,1 );
		var planeGeometry = new THREE.PlaneGeometry(10, 10, 10);
		var material = new THREE.MeshBasicMaterial( {color: 0x0c6297  });
		var cube = new THREE.Mesh(cubeGeometry, material);
		var plane = new THREE.Mesh(planeGeometry, planematerial);


		//camera var
		camera.position.z = 5;
		plane.position.z = -2;

		scene.add(cube);
		scene.add(plane);

		//cube list
		var cubes =  new Array(numCubes);
		for(i = 0; i < numCubes; i++){
			var lcube = new THREE.Mesh(cubeGeometry, material);
			cubes.push(lcube);
			scene.add(lcube);
		}
		
		function resize(){
			var width = canvas.clientWidth;
			var height = canvas.clientHeight;

			if(width != canvas.width || height != canvas.height)
			renderer.setSize(width, height, false);
			camera.aspect = width/height;
			camera.updateProjectionMatrix();
		}

		//rendering
		function animate(){
			requestAnimationFrame(animate);
			resize();

			uniforms.u_time.value = clock.getElapsedTime();
			uniforms.u_resolution.value = new THREE.Vector2(canvas.clientWidth, canvas.clientHeight);

			cubes.forEach(transform);

			//updating code
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			//render call
			renderer.render(scene, camera);
		}
		animate();

		var ccolor = new THREE.Color(0xc54242); 
		function transform(localcube, index) {
			var mag = 3;
			localcube.position.x = mag * Math.cos(2*Math.PI/ numCubes * index + clock.getElapsedTime());
			localcube.position.y = mag * Math.sin(2*Math.PI/ numCubes * index+ clock.getElapsedTime());

			localcube.rotation.x = Math.cos(clock.getElapsedTime());
			localcube.rotation.y = Math.sin(clock.getElapsedTime());
			
			//ccolor =  new THREE.Color(Math.sin(clock.elapsedTime)+0.5/2, Math.sin(clock.elapsedTime)+0.2/2, Math.sin(clock.elapsedTime)+1/2);
			material.color = ccolor;
		}