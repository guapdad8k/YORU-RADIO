// Replace playlist IDs here to publish the curator's selection to every visitor.
export const channels = [
  {id:'calm',title:'Spokojny',code:'RELAX',jp:'静かな時間',frequency:'88.1',color:'#dafa65',description:'Zwolnij tempo. Miękkie klawisze, spokojny oddech i przestrzeń na własne myśli.',demoName:'Peaceful Piano',playlistId:'37i9dQZF1DX4sWSpwq3LiO'},
  {id:'electronic',title:'Elektroniczna',code:'ELECTRONIC',jp:'電子の夜',frequency:'94.6',color:'#a8c9f6',description:'Syntezatory, puls i trochę nocnego powietrza. Dźwięki na drogę bez konkretnego celu.',demoName:'Indie Electronic',playlistId:'37i9dQZF1DXadokOfeHaaj'},
  {id:'rap-modern',title:'Rap',variant:'Nowoczesny',code:'NEW SCHOOL',jp:'新しい波',frequency:'98.2',color:'#c0a9ef',description:'Nowa fala, ciężki bas, świeże brzmienie. Rap, który patrzy przed siebie.',demoName:'RapCaviar Presents: Best Hip-Hop Songs of 2025',playlistId:'37i9dQZF1DWZFV9Asvj1J9'},
  {id:'rap-oldschool',title:'Rap',variant:'Oldschool',code:'OLD SCHOOL',jp:'クラシックス',frequency:'102.4',color:'#edbb85',description:'Zakurzony sampl, mocny werbel i historie z pierwszej strony zeszytu. Powrót do korzeni.',demoName:"I Love My '90s Hip-Hop",playlistId:'37i9dQZF1DX186v583rmzp'},
  {id:'latino',title:'Latino',code:'LATINO',jp:'熱いリズム',frequency:'106.8',color:'#efa2a0',description:'Ciepłe noce i rytm, przy którym trudno usiedzieć. Wpuść trochę słońca do głośników.',demoName:'Viva Latino No. 1s',playlistId:'37i9dQZF1DXbzvkbLgvQvI'}
];
export function parsePlaylist(value) {
  if (typeof value !== 'string') throw new Error('Wklej link lub identyfikator playlisty Spotify.');
  const text=value.trim();
  if (!text) return null;
  if (/^[a-zA-Z0-9]{22}$/.test(text)) return text;
  const uri=text.match(/^spotify:playlist:([a-zA-Z0-9]{22})$/);
  if(uri) return uri[1];
  let url;
  try { url=new URL(text); } catch { throw new Error('Nieprawidłowy link do playlisty Spotify.'); }
  const match=url.pathname.match(/^\/(?:intl-[a-z]{2}\/)?(?:embed\/)?playlist\/([a-zA-Z0-9]{22})\/?$/);
  if(url.protocol!=='https:' || url.hostname!=='open.spotify.com' || url.port || url.username || url.password || !match) throw new Error('Użyj linku https://open.spotify.com/playlist/… (nie linku do utworu).');
  return match[1];
}
export function validateSelections(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Plik musi zawierać obiekt z playlistami.');
  const clean={};
  for(const channel of channels) { const id=parsePlaylist(data[channel.id] ?? ''); if(id)clean[channel.id]=id; }
  return clean;
}
