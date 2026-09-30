import * as THREE from 'three';

// A lightweight procedural hatchback. No models, HDR maps or remote assets.
export async function createVehicle(canvas) {
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 const gl=renderer.getContext();const rendererInfo=gl.getExtension('WEBGL_debug_renderer_info');
 const rendererName=rendererInfo?gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL):'';
 // Software rasterizers stall the main thread. Keep the lightweight, equivalent
 // static composition instead; its surrounding narrative still follows scroll.
 if(/swiftshader|llvmpipe|software rasterizer|microsoft basic render/i.test(rendererName)){renderer.dispose();return null}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0xffffff,0);
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(31,1,.1,60);camera.position.set(6.2,3.5,7.8);camera.lookAt(0,.65,0);
 scene.add(new THREE.HemisphereLight(0xffffff,0x84988e,3));
 const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(2,7,4);scene.add(key);
 const rim=new THREE.DirectionalLight(0x8ce8dd,2.3);rim.position.set(-3,2,-4);scene.add(rim);
 const car=new THREE.Group();scene.add(car);
 const paint=new THREE.MeshStandardMaterial({color:0xd7e4df,metalness:.48,roughness:.27});
 const glass=new THREE.MeshStandardMaterial({color:0x183530,metalness:.4,roughness:.18});
 const trim=new THREE.MeshStandardMaterial({color:0x202827,roughness:.55});
 const chrome=new THREE.MeshStandardMaterial({color:0xc9d8d2,metalness:.8,roughness:.22});
 const tire=new THREE.MeshStandardMaterial({color:0x202522,roughness:.85});
 const lamp=new THREE.MeshStandardMaterial({color:0xf2fffd,emissive:0xc8e6db,emissiveIntensity:.3,roughness:.2});
 function box(w,h,d,material,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);car.add(m);return m}
 function extrude(points,depth,material,bevel=.045){const s=new THREE.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:bevel>0,bevelSegments:3,steps:1,bevelSize:bevel,bevelThickness:bevel,curveSegments:12});g.translate(0,0,-depth/2);const m=new THREE.Mesh(g,material);car.add(m);return m}
 extrude([[-2.03,.56],[-2.06,.9],[-1.91,1.13],[-1.46,1.2],[-.99,1.29],[1.14,1.27],[1.83,1.13],[2.06,.93],[2.08,.63],[1.92,.5],[-1.87,.5]],1.7,paint,.08);
 extrude([[-1.5,1.16],[-1.22,1.88],[-.93,2.02],[.36,2.0],[.78,1.78],[1.28,1.24]],1.49,paint,.045);
 // Side windows form a continuous greenhouse, divided by slim B pillars.
 for(const side of [-1,1]){
  const rear=extrude([[-1.35,1.29],[-1.12,1.84],[-.95,1.91],[-.43,1.91],[-.43,1.29]],.016,glass,.012);rear.position.z=side*.776;
  const front=extrude([[-.32,1.29],[-.32,1.91],[.33,1.9],[.66,1.71],[1.07,1.29]],.016,glass,.012);front.position.z=side*.776;
  box(.29,.045,.035,chrome,-.7,1.14,side*.872);box(.29,.045,.035,chrome,.55,1.14,side*.872);
  const mirror=box(.28,.14,.22,paint,.86,1.4,side*.91);mirror.rotation.y=side*.15;
  box(3.1,.075,.06,trim,0,.56,side*.878);
  for(const x of [-1.27,1.29]){
   const wheel=new THREE.Group();wheel.position.set(x,.51,side*.86);car.add(wheel);
   const t=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.25,40,1),tire);t.rotation.x=Math.PI/2;wheel.add(t);
   const face=new THREE.Mesh(new THREE.CylinderGeometry(.315,.315,.263,32),chrome);face.rotation.x=Math.PI/2;wheel.add(face);
   const inside=new THREE.Mesh(new THREE.CylinderGeometry(.24,.24,.268,32),trim);inside.rotation.x=Math.PI/2;wheel.add(inside);
   for(let i=0;i<5;i++){const spoke=new THREE.Mesh(new THREE.BoxGeometry(.09,.5,.027),chrome);spoke.position.z=side*.142;spoke.rotation.z=i*Math.PI/5;wheel.add(spoke)}
   const hub=new THREE.Mesh(new THREE.CylinderGeometry(.085,.085,.3,20),chrome);hub.rotation.x=Math.PI/2;wheel.add(hub);
  }
 }
 const windshieldGeometry=new THREE.BufferGeometry();
 windshieldGeometry.setAttribute('position',new THREE.Float32BufferAttribute([.44,2.05,-.69,.44,2.05,.69,.81,1.84,.71,.81,1.84,-.71,1.25,1.37,.73,1.25,1.37,-.73],3));
 windshieldGeometry.setIndex([0,1,2,0,2,3,3,2,4,3,4,5]);windshieldGeometry.computeVertexNormals();
 const windshield=new THREE.Mesh(windshieldGeometry,new THREE.MeshStandardMaterial({color:0x24483e,metalness:.45,roughness:.16,side:THREE.DoubleSide}));car.add(windshield);
 const backGlass=box(.58,.018,1.31,glass,-1.36,1.59,0);backGlass.rotation.z=1.18;
 const roof=box(1.06,.025,1.18,glass,-.32,2.068,0);roof.rotation.z=-.01;
 box(.05,.2,1.23,trim,2.13,.73,0);box(.06,.045,1.22,chrome,2.165,.77,0);
 for(const side of [-1,1]){const headlight=box(.055,.12,.42,lamp,2.04,1.01,side*.56);headlight.rotation.y=side*.12;box(.05,.14,.34,new THREE.MeshStandardMaterial({color:0x9b3331,roughness:.3}),-2.095,1.01,side*.59)}
 const plateCanvas=document.createElement('canvas');plateCanvas.width=256;plateCanvas.height=96;const ctx=plateCanvas.getContext('2d');const texture=new THREE.CanvasTexture(plateCanvas);texture.colorSpace=THREE.SRGBColorSpace;
 const plate=new THREE.Mesh(new THREE.PlaneGeometry(.52,.19),new THREE.MeshBasicMaterial({map:texture}));plate.rotation.y=Math.PI/2;plate.position.set(2.174,.75,0);car.add(plate);
 function setPlate(value){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,256,96);ctx.fillStyle='#29716f';ctx.fillRect(0,0,256,22);ctx.fillStyle='#fff';ctx.font='13px Arial';ctx.textAlign='center';ctx.fillText('BRASIL',128,16);ctx.fillStyle='#17231f';ctx.font='bold 45px Arial';ctx.fillText(value||'ABC1D23',128,72);texture.needsUpdate=true}
 setPlate('ABC1D23');
 let compiled=false;
 const parent=canvas.parentElement;function resize(){const w=parent.clientWidth,h=parent.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();if(compiled)renderer.render(scene,camera)}
 resize();const observer=new ResizeObserver(resize);observer.observe(parent);
 function render(progress=0,focused=false){car.rotation.y=-.15+progress*.42;car.position.y=Math.sin(progress*Math.PI)*.055;car.position.x=progress*.12;const scale=focused?1.015:1;car.scale.setScalar(scale);renderer.render(scene,camera)}
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();canvas.classList.remove('ready');parent.classList.remove('webgl-ready')});
 canvas.addEventListener('webglcontextrestored',()=>{render();canvas.classList.add('ready');parent.classList.add('webgl-ready')});
 await renderer.compileAsync(scene,camera);compiled=true;
 render();canvas.classList.add('ready');parent.classList.add('webgl-ready');
 return {render,setPlate,snapshot(){render(.8);const data=canvas.toDataURL('image/png');render(0);return data},dispose(){observer.disconnect();renderer.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose()});texture.dispose()}};
}
