import {access,mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const asset=new URL('../assets/night.gif',import.meta.url);
export async function prepareAssets(){
  try{await access(asset);return;}catch{}
  const response=await fetch('https://raw.githubusercontent.com/guapdad8k/WEB-PORTFOLIO/main/LoopNightGIF.gif',{signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error(`Background download failed (${response.status})`);
  const buffer=Buffer.from(await response.arrayBuffer());
  if(buffer.subarray(0,6).toString()!=='GIF89a'&&buffer.subarray(0,6).toString()!=='GIF87a')throw Error('Invalid GIF response');
  await mkdir(new URL('../assets/',import.meta.url),{recursive:true});await writeFile(asset,buffer);
  console.log('Portfolio background ready.');
}
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){await prepareAssets();}
