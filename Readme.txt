Raw Shaders:
    Vertex Shader:
        <script id="vertexShader" type="x-shader/x-vertex">
            precision highp float;
    
            attribute vec3 position;
            attribute vec3 normal;
            attribute vec2 uv;

            uniform mat4 modelMatrix;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform mat3 normalMatrix;
            uniform vec3 cameraPosition;

            varying vec3 vNormal;
            varying vec3 vPos;
            varying vec3 camPos;

            varying vec2 vUv;

            void main()	{
                //Get fragment normal
                vNormal = normal;
                
                //set UV
                vUv = uv;

                //Get fragment position in world space
                vPos = vec3(modelMatrix * vec4(position, 1.0));

                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );      
                
                camPos = cameraPosition;
            }
        </script>
    Fragment Shader:
        <script id="fragmentShader" type="x-shader/x-fragment">
            precision highp float;
            
            //Ambient lighting
            uniform float ambientStrength;
            uniform vec3 ambientLightColor;
            uniform vec3 materialColor;

            //Point lighting
            uniform vec3 lightPosition;
            uniform vec3 lightColor;

            //Specular 
            uniform float specularStrength;

            //World space variables
            varying vec3 vNormal;
            varying vec3 vPos;
            varying vec3 camPos;

            //Texture
            uniform sampler2D texture;
            uniform sampler2D normalMap;
            varying vec2 vUv;

            //Global
            vec3 newN;

            vec3 calcAmbient(){
                return ambientLightColor * ambientStrength;
            }

            vec3 calcDiffuse(){
                vec3 N = normalize(newN);
                vec3 lightDirection = normalize(lightPosition - vPos);
                
                float diffuseFactor = max(dot(N, lightDirection), 0.0);
                return diffuseFactor * lightColor;
            }

            vec3 calcSpecular(){
                vec3 lightDirection = normalize(lightPosition - vPos);
                vec3 viewDirection = normalize(camPos - vPos);
                vec3 reflectionDirection = reflect(-lightDirection, newN);

                float temp = max(dot(viewDirection, reflectionDirection), 0.0);

                float specularFactor = pow(temp, 32.0);

                return specularStrength * specularFactor * lightColor;
            }
            void main()	{

                vec3 Q0 = dFdx(vPos);
                vec3 Q1 = dFdy(vPos);
                vec2 st0 = dFdx(vUv);
                vec2 st1 = dFdy(vUv);
                float denom = st1.t*st0.s - st0.t*st1.s;
                float denomSign = sign(denom);
                vec3 T = normalize((Q0*st1.t - Q1*st0.t)*denomSign);
                vec3 B = normalize((-Q0*st1.s + Q1*st0.s)*denomSign);
                vec3 N = normalize(vNormal);
                vec3 mapN = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;
                mapN.xy *= (float(gl_FrontFacing)*2.0-1.0);
                newN =  normalize(mat3(T,B,N)*mapN);

                vec3 ambientTerm  = calcAmbient();
                vec3 diffuseTerm  = calcDiffuse();
                vec3 specularTerm = calcSpecular();
                
                vec3 color = materialColor * (ambientTerm + diffuseTerm + specularTerm);
                gl_FragColor = texture2D(texture, vUv) * vec4(color, 1.0);
                //gl_FragColor = vec4(color, 1.0);
            }
        </script>

The raw shader is defined on line 63 of renderer.js