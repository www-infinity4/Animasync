"use client";
import {useEffect,useRef,useState} from "react";
import {Button} from "@/components/ui/button";
import {program,embedURL} from "@/lib/program";
type Player={playVideo:()=>void;pauseVideo:()=>void;mute:()=>void;unMute:()=>void;setVolume:(n:number)=>void;setLoop:(b:boolean)=>void;setShuffle:(b:boolean)=>void;playVideoAt:(n:number)=>void;seekTo:(n:number,b:boolean)=>void;nextVideo:()=>void;destroy:()=>void};
type Event={target:Player;data:number};
declare global {interface Window{YT?:{Player:new(element:HTMLIFrameElement,options:object)=>Player};onYouTubeIframeAPIReady?:()=>void;}}
let api:Promise<void>|undefined;
function loadAPI(){
 if(window.YT?.Player)return Promise.resolve();if(api)return api;
 api=new Promise<void>((resolve,reject)=>{
 const s=document.createElement("script");
 const timer=window.setTimeout(()=>{s.remove();api=undefined;reject(new Error("YouTube controls did not load. Use the play buttons inside the players or reload."));},15000);
 window.onYouTubeIframeAPIReady=()=>{clearTimeout(timer);resolve();};
 s.src="https://www.youtube.com/iframe_api";s.onerror=()=>{clearTimeout(timer);s.remove();api=undefined;reject(new Error("YouTube controls are unavailable. Try reloading."));};document.head.appendChild(s);
 });return api;
}
const label=(n:number)=>({[-1]:"Ready",0:"Finished",1:"Playing",2:"Paused",3:"Buffering",5:"Ready"}[n]||"Loading");
function Theater({item}:{item:typeof program[number]}){
 const frames=useRef<(HTMLIFrameElement|null)[]>([]),players=useRef<(Player|null)[]>([null,null]);
 const [origin,setOrigin]=useState(""),[ready,setReady]=useState([false,false]),[states,setStates]=useState(["Loading","Loading"]),[errors,setErrors]=useState(["",""]);
 const [message,setMessage]=useState("Choose Start both. If your phone asks, tap play inside each player.");
 const [reload,setReload]=useState(0),[single,setSingle]=useState(false),[backup,setBackup]=useState(false);
 const albumList=backup&&item.albumBackup?item.albumBackup:item.albumList;
 useEffect(()=>setOrigin(window.location.origin),[]);
 useEffect(()=>{
 if(!origin)return;let active=true;const timers:number[]=[];
 setReady([false,false]);setStates(["Loading","Loading"]);setErrors(["",""]);
 const update=(setter:typeof setStates,i:number,v:string)=>setter(old=>old.map((x,j)=>j===i?v:x));
 loadAPI().then(()=>{
 if(!active)return;
 frames.current.forEach((frame,i)=>{
 if(!frame)return;
 timers[i]=window.setTimeout(()=>{if(active)update(setErrors,i,"Player is taking longer than expected. Tap its play button, try the source link, or reload players.");},20000);
 players.current[i]=new window.YT!.Player(frame,{events:{
 onReady:(e:Event)=>{if(!active)return;clearTimeout(timers[i]);if(i===0)e.target.mute();e.target.setLoop(true);e.target.setShuffle(false);setReady(old=>old.map((x,j)=>j===i?true:x));update(setStates,i,"Ready");update(setErrors,i,"");},
 onStateChange:(e:Event)=>{if(!active)return;if(e.data===1){update(setErrors,i,"");if(i===0)e.target.mute();}update(setStates,i,label(e.data));},
 onAutoplayBlocked:()=>{if(active)setMessage("Your browser needs a tap inside the player. Tap the cartoon, then the album; keep the cartoon muted.");},
 onError:(e:Event)=>{if(!active)return;clearTimeout(timers[i]);update(setStates,i,"Unavailable");update(setErrors,i,"YouTube could not play this "+(i===0?"cartoon":"album")+" (code "+e.data+"). It may be unavailable here or blocked from embedding. "+(i===0?"Try the opening episode or source link.":"Try Next song or the album source link."));}
 }});
 });
 }).catch(e=>{if(active)setMessage(e.message);});
 return()=>{active=false;timers.forEach(clearTimeout);players.current.forEach(p=>{try{p?.destroy();}catch{}});players.current=[null,null];};
 },[origin,reload,single,backup,item]);
 function command(fn:(p:Player,i:number)=>void){players.current.forEach((p,i)=>{if(p&&ready[i])try{fn(p,i);}catch{setMessage("A player is not responding. Use its own controls or reload players.");}});}
 function start(){command((p,i)=>{if(i===0)p.mute();else{p.unMute();p.setVolume(80);}p.playVideo();});setMessage("Start requested. Indicators show actual player states. Ads or buffering can put the players out of step.");}
 function restart(){command((p,i)=>{if(i===0&&(single||(!item.cartoonList&&!item.cartoonVideos?.length)))p.seekTo(0,true);else p.playVideoAt(0);if(i===0)p.mute();else p.unMute();p.playVideo();});setMessage("Restart requested from the opening episode and first album track.");}
 return <>
 <div className="now"><div><p className="eyebrow">NOW SELECTED / {item.year}</p><h2>{item.title}</h2></div><span className="tag">FULL EPISODES · NO CLIP CUTS</span></div>
 <div className="decks">
 <section className="screen-panel" aria-label="Cartoon player">
 <div className="deck-label"><span>01 / PICTURE</span><span>{states[0]} · muted</span></div>
 <div className="picture frame-holder" key={"picture-"+reload+"-"+single+"-"+backup}>{origin&&<iframe ref={el=>{frames.current[0]=el;}} src={embedURL(single?undefined:item.cartoonList,item.video,origin,true,single?undefined:item.cartoonVideos)} title={item.title+" cartoon player"} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>}</div>
 <div className="deck-foot"><span>{single?"Opening episode":item.edition}</span><a href={"https://www.youtube.com/watch?v="+item.video} target="_blank" rel="noreferrer">Cartoon source ↗</a></div>
 {errors[0]&&<p className="error" role="alert">{errors[0]}</p>}
 </section>
 <section className="album-panel" aria-label="Album player">
 <div className="deck-label"><span>02 / SOUND</span><span>{states[1]} · repeat</span></div>
 <div className="album-info"><p className="eyebrow">{item.artist} / {item.albumYear}</p><h3>{item.album}</h3><p>{item.note}</p></div>
 <div className="music frame-holder" key={"music-"+reload+"-"+single+"-"+backup}>{origin&&<iframe ref={el=>{frames.current[1]=el;}} src={embedURL(albumList,undefined,origin,false)} title={item.artist+" "+item.album+" full album player"} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>}</div>
 <div className="deck-foot"><Button className="small-button" variant="outline" disabled={!ready[1]} onClick={()=>{try{players.current[1]?.nextVideo();}catch{setMessage("Use the album player's next button.");}}}>Next song →</Button><a href={"https://www.youtube.com/playlist?list="+albumList} target="_blank" rel="noreferrer">Album source ↗</a></div>
 {errors[1]&&<p className="error" role="alert">{errors[1]}</p>}
 </section>
 </div>
 <section className="transport" aria-label="Shared playback controls"><div className="transport-buttons">
 <Button className="play-button" disabled={!ready.some(Boolean)} onClick={start}>▶ Start both</Button>
 <Button variant="outline" onClick={()=>{command(p=>p.pauseVideo());setMessage("Pause requested for both players.");}}>Pause both</Button>
 <Button variant="outline" disabled={!ready[0]} onClick={()=>command((p,i)=>{if(i===0){p.mute();p.playVideo();}})}>Start cartoon</Button>
 <Button variant="outline" disabled={!ready[1]} onClick={()=>command((p,i)=>{if(i===1){p.unMute();p.setVolume(80);p.playVideo();}})}>Start music</Button>
 <Button variant="outline" disabled={!ready.every(Boolean)} onClick={restart}>Restart pairing</Button></div>
 <p role="status">{message}</p><div className="recovery">
 <Button variant="ghost" onClick={()=>{command(p=>p.pauseVideo());setReload(n=>n+1);setMessage("Reloading both players. Press Start both when ready.");}}>Reload players</Button>
 {(item.cartoonList||item.cartoonVideos?.length)&&<Button variant="ghost" onClick={()=>{command(p=>p.pauseVideo());setSingle(v=>!v);setMessage("Source changed. Press Start both when ready.");}}>{single?"Restore episode playlist":"Try opening episode only"}</Button>}
 {item.albumBackup&&<Button variant="ghost" onClick={()=>{command(p=>p.pauseVideo());setBackup(v=>!v);setMessage("Album source changed; press Start both to resume.");}}>{backup?"Use primary album source":"Try alternate album source"}</Button>}
 </div></section></>;
}
export default function Home(){
 const [selected,setSelected]=useState(1);
 return <main className="animasync">
 <header><a className="wordmark" href="#">ANIMA<span>SYNC</span></a><p>1980s PICTURE.<br/>1990s SOUND.</p><span className="brand">Infinity ®</span></header>
 <section className="intro"><div><p className="eyebrow">THE ALTERNATIVE CARTOON CLUB / VOL. 01</p><h1>Same cartoons.<br/><em>Different frequency.</em></h1></div><p>Four animated worlds. Four full albums.<br/>Pick a pairing, press play, and let them meet.</p></section>
 <nav className="program" aria-label="Choose a cartoon and album">{program.map((item,i)=><Button key={item.title} className={"program-card "+(selected===i?"selected":"")} variant="outline" onClick={()=>setSelected(i)} aria-pressed={selected===i}><span className="number">0{i+1}</span><span><strong>{item.short}</strong><small>{item.artist} / {item.album}</small></span><span className="choice">{selected===i?"●":"↗"}</span></Button>)}</nav>
 <Theater key={selected} item={program[selected]}/>
 <footer><strong>ANIMASYNC / Infinity ®</strong><p>Curated pairings, not frame-locked edits. Albums repeat; episode playlists continue. YouTube availability, ads, and device playback rules still apply. Some albums contain explicit lyrics.</p><span>80s × 90s</span></footer>
 </main>;
}

