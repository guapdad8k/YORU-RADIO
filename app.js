import {channels,parsePlaylist,validateSelections} from './config.js';
const $=s=>document.querySelector(s);
const storage={get(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}},set(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}};
let selections={};try{selections=validateSelections(storage.get('yoru-playlists',{}));}catch{}
let active=channels.find(c=>c.id===storage.get('yoru-channel','calm'))??channels[0];
let favorites=storage.get('yoru-favorites',[]);if(!Array.isArray(favorites))favorites=[];
let playerOpen=false;
let motionOff=Boolean(storage.get('yoru-motion-off',false));
const menu=$('#channel-buttons');
channels.forEach((channel,index)=>{
  const button=document.createElement('button');button.type='button';button.dataset.channel=channel.id;button.style.setProperty('--channel-color',channel.color);
  const number=document.createElement('span');number.className='channel-number';number.textContent=String(index+1).padStart(2,'0');
  const title=document.createElement('span');title.className='channel-name';title.textContent=channel.title;
  const sub=document.createElement('small');sub.textContent=channel.variant??channel.code;title.append(sub);
  const arrow=document.createElement('span');arrow.className='channel-arrow';arrow.textContent='↗';button.append(number,title,arrow);
  button.addEventListener('click',()=>selectChannel(channel));menu.append(button);
});
function selectChannel(channel){
  active=channel;storage.set('yoru-channel',channel.id);
  document.documentElement.style.setProperty('--accent',channel.color);
  menu.querySelectorAll('button').forEach(b=>{const selected=b.dataset.channel===channel.id;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});
  $('#channel-title').textContent=channel.title+(channel.variant?' / '+channel.variant:'');
  $('#channel-jp').textContent=channel.jp;$('#channel-code').textContent=`CH. ${String(channels.indexOf(channel)+1).padStart(2,'0')} / ${channel.code}`;
  $('#frequency').firstChild.textContent=channel.frequency;$('#tuning-needle').style.left=`${5+channels.indexOf(channel)*21}%`;
  $('#channel-description').textContent=channel.description;
  $('#playlist-badge').textContent=selections[channel.id]?'TWOJA PLAYLISTA':'DEMO / '+channel.demoName;
  $('#selection-status').textContent='WYBRANY KANAŁ: '+channel.title.toUpperCase()+(channel.variant?' / '+channel.variant.toUpperCase():'');
  updateFavorite();if(playerOpen)loadEmbed();
}
function updateFavorite(){const saved=favorites.includes(active.id);$('#favorite').setAttribute('aria-pressed',String(saved));$('#favorite').innerHTML=saved?'<span>♥</span> KANAŁ ZAPISANY':'<span>♡</span> ZAPISZ KANAŁ';$('#saved-status').textContent=favorites.length?`ZAPISANE KANAŁY: ${favorites.length}`:'TWÓJ MAŁY KĄCIK INTERNETU.';}
function loadEmbed(){
  const id=selections[active.id]??active.playlistId;
  const iframe=document.createElement('iframe');iframe.src=`https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;iframe.title=`Spotify — ${active.title} ${active.variant??''}`;iframe.height='352';iframe.width='100%';iframe.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';iframe.setAttribute('allowfullscreen','');
  $('#embed-container').replaceChildren(iframe);$('#spotify-link').href=`https://open.spotify.com/playlist/${id}`;
}
$('#listen').addEventListener('click',()=>{playerOpen=true;$('#spotify-area').hidden=false;$('#listen').hidden=true;$('#receiver-state').textContent='ODTWARZACZ OTWARTY';loadEmbed();});
$('#close-player').addEventListener('click',()=>{playerOpen=false;$('#spotify-area').hidden=true;$('#embed-container').replaceChildren();$('#listen').hidden=false;$('#receiver-state').textContent='GOTOWY DO ODSŁUCHU';$('#listen').focus();});
$('#next').addEventListener('click',()=>selectChannel(channels[(channels.indexOf(active)+1)%channels.length]));
$('#favorite').addEventListener('click',()=>{favorites=favorites.includes(active.id)?favorites.filter(id=>id!==active.id):[...favorites,active.id];const saved=storage.set('yoru-favorites',favorites);updateFavorite();if(!saved)$('#saved-status').textContent='PAMIĘĆ PRZEGLĄDARKI NIEDOSTĘPNA — ZAPIS TYLKO NA TĘ SESJĘ.';});
function updateMotion(){document.body.classList.toggle('motion-off',motionOff);$('#motion-toggle').setAttribute('aria-pressed',String(motionOff));$('#motion-toggle').textContent='ANIMACJE: '+(motionOff?'OFF':'ON');}
$('#motion-toggle').addEventListener('click',()=>{motionOff=!motionOff;storage.set('yoru-motion-off',motionOff);updateMotion();});
const editor=$('#editor');
function openEditor(){
  $('#playlist-fields').replaceChildren();$('#form-error').textContent='';
  channels.forEach(c=>{const label=document.createElement('label');label.className='playlist-field';label.textContent=c.title+(c.variant?' / '+c.variant:'');const input=document.createElement('input');input.name=c.id;input.type='text';input.placeholder='https://open.spotify.com/playlist/…';input.value=selections[c.id]?`https://open.spotify.com/playlist/${selections[c.id]}`:'';label.append(input);$('#playlist-fields').append(label);});editor.showModal();
}
$('#edit-top').addEventListener('click',openEditor);$('#edit-curator').addEventListener('click',openEditor);$('#close-editor').addEventListener('click',()=>editor.close());
function readForm(){const data={};for(const c of channels){try{const id=parsePlaylist($('#playlist-form').elements.namedItem(c.id).value);if(id)data[c.id]=id;}catch(error){throw Error(`${c.title} ${c.variant??''}: ${error.message}`);}}return data;}
$('#playlist-form').addEventListener('submit',event=>{event.preventDefault();try{const clean=readForm();selections=clean;const saved=storage.set('yoru-playlists',clean);selectChannel(active);editor.close();$('#selection-status').textContent=saved?'SELEKCJA ZAPISANA W TEJ PRZEGLĄDARCE.':'SELEKCJA AKTYWNA W TEJ SESJI — UŻYJ EKSPORTU, ABY JĄ ZACHOWAĆ.';}catch(error){$('#form-error').textContent=error.message;}});
$('#export').addEventListener('click',()=>{try{const clean=readForm();const blob=new Blob([JSON.stringify(clean,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='yoru-playlists.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#form-error').textContent='';}catch(error){$('#form-error').textContent=error.message;}});
$('#import').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{if(file.size>20000)throw Error('Plik jest za duży. Maksymalny rozmiar: 20 kB.');const clean=validateSelections(JSON.parse(await file.text()));for(const c of channels)$('#playlist-form').elements.namedItem(c.id).value=clean[c.id]?`https://open.spotify.com/playlist/${clean[c.id]}`:'';$('#form-error').textContent='Plik wczytany. Kliknij „Zapisz selekcję”, aby zastosować.';}catch(error){$('#form-error').textContent='Nie udało się wczytać pliku: '+error.message;}event.target.value='';});
function tick(){$('#clock').textContent=new Intl.DateTimeFormat('pl-PL',{timeZone:'Europe/Warsaw',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date());}tick();setInterval(tick,1000);updateMotion();selectChannel(active);
