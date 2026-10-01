import {build} from 'esbuild';
await build({entryPoints:['src/vehicle.js','src/smooth-scroll.js'],bundle:true,minify:true,format:'esm',outdir:'dist/js'});
