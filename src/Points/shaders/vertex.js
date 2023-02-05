export default /* glsl */ `
varying vec2 vUv;
uniform float uTime;
varying vec3 pos;
const float PI = 3.1415926535897932384626433832795;

attribute vec3 position2;

vec2 rotate2D (vec2 _st, float _angle) {
  _st -= 0.5;
  _st =  mat2(cos(_angle),-sin(_angle),
              sin(_angle),cos(_angle)) * _st;
  _st += 0.5;
  return _st;

}

void coswarp(inout vec3 trip, float warpsScale ){

    trip.xyz += warpsScale * .1 * cos(3. * trip.yzx + (uTime * .15));
    trip.xyz += warpsScale * .05 * cos(11. * trip.yzx + (uTime * .15));
    trip.xyz += warpsScale * .025 * cos(17. * trip.yzx + (uTime * .15));
    
  }  

  void uvRipple(inout vec2 uv, float intensity){

    vec2 p = uv -.5;
    
    
      float cLength=length(p);
    
       uv= uv +(p/cLength)*cos(cLength*15.0-uTime*.5)*intensity;
    
    } 
    
    

  vec3 shape( in vec2 p, float sides ,float size)
{
  
   float d = 0.0;
  vec2 st = p *2.-1.;

  // Number of sides of your shape
  float N = sides ;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI ;
  float r = (2.* PI)/(N) ;

  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*length(st);
  

  return  vec3(1.0-smoothstep(size,size +.1,d));
}

//	Classic Perlin 2D Noise
//	by Stefan Gustavson
//
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}


vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 *
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

  void main(){

    

    vec4 modelPosition = modelMatrix * vec4(position, 1.);

    // modelPosition.xy = rotate2D(modelPosition.xy,PI + (uTime * .2));

    vec4 modelPosition2 = modelMatrix * vec4(position, 1.);
    vec4 modelPosition3 = modelMatrix * vec4(position, 1.);

    modelPosition2.xy = rotate2D(modelPosition2.xy,PI + (uTime * .1));
    modelPosition3.xy = rotate2D(modelPosition2.xy,-PI + (uTime * .1));

    // uvRipple(modelPosition.xy, 1.1);
    // coswarp(modelPosition.xyz, 3.);
    // coswarp(modelPosition.xyz, 3.);
    // modelPosition.y += (sin(uTime  + modelPosition.x) +1.)/2. * 1. * .2;
    modelPosition.z += sin((uTime * .75) +length(modelPosition.xy)) * 4.;

    // modelPosition.xyz = mix(modelPosition.xyz, modelPosition2.xyz, sin(uTime * .2));
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;


  
    gl_Position = projectionPosition;
    gl_PointSize =    mix(10., 250.,  step(cnoise(modelPosition2.xy * 1. * cnoise(modelPosition3.xy * 1.  ) ), .01));
    //gl_PointSize = (100. * (2.-length(modelPosition.xy))) * 1. * 1.;



    gl_PointSize *= (1.0/ -viewPosition.z);

    vUv = uv;
    pos = modelPosition.xyz;
}`