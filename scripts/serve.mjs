import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {prepareAssets} from './assets.mjs';
// Optional decorative asset. The receiver works even if the download is unavailable.
await prepareAssets().catch(error=>console.warn('Background unavailable:',error.message));
const root=fileURLToPath(new URL('../',import.meta.url));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.gif':'image/gif','.json':'application/json; charset=utf-8'};
const allowed=new Set(['index.html','app.js','config.js','style.css','assets/favicon.svg','assets/night.gif']);
const server=http.createServer(async(req,res)=>{
  try{const url=new URL(req.url,'http://localhost');const relative=decodeURIComponent(url.pathname).replace(/^\/+/, '')||'index.html';
    if(!allowed.has(relative)){res.writeHead(404);res.end('Not found');return;}
    const file=path.join(root,relative);const info=await stat(file);if(!info.isFile())throw Error('Not a file');
    res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; frame-src https://open.spotify.com; object-src 'none'; base-uri 'self'"});
    res.end(req.method==='HEAD'?undefined:await readFile(file));
  }catch{res.writeHead(404);res.end('Not found');}
});
server.listen(Number(process.env.PORT??4173),'127.0.0.1',()=>console.log(`YORU Radio — http://127.0.0.1:${server.address().port}`));
