type Pairing={title:string;short:string;year:number;video:string;cartoonList:string|undefined;cartoonVideos?:string[];edition:string;artist:string;album:string;albumYear:number;albumList:string;albumBackup?:string;note:string};
export const program:Pairing[] = [
 {title:"He-Man and the Masters of the Universe",short:"He-Man",year:1983,video:"QX7nrhZdlc4",cartoonList:"PLLCcmBcBRcT8MwyYwiydNddtZPSSV_iQs",edition:"Official season-one playlist",artist:"Soundgarden",album:"Superunknown",albumYear:1994,albumList:"PLOng4o1Xr7M0QESOHJoLb1oFLAl4r1vz4",note:"Heavy guitars, alien landscapes, and the strange magic of Eternia."},
 {title:"The Transformers",short:"Transformers",year:1984,video:"Y1ujpoDlgRU",cartoonList:undefined,cartoonVideos:["Y1ujpoDlgRU","NdskAJwHdLw","V6XpDmtizL0"],edition:"More Than Meets the Eye · three full episodes",artist:"The Smashing Pumpkins",album:"Siamese Dream",albumYear:1993,albumList:"PLRYX6_JmGq8AzWgusU8DaBGV77Rb-KfjM",albumBackup:"PLlGU-CCFHZ0g9W23HaA2fo0fY567xdAo7",note:"Walls of guitar and dreamlike quiet, set against chrome, color, and cosmic battles."},
 {title:"The Real Ghostbusters",short:"Ghostbusters",year:1986,video:"TDIO1nVgdt8",cartoonList:undefined,cartoonVideos:["TDIO1nVgdt8","wcVLqMNm5LI"],edition:"Ghosts R Us + Mr. Sandman · full episodes",artist:"Alice in Chains",album:"Dirt",albumYear:1992,albumList:"PLWVo2tank-zzN1quN5ecHISbgp9uSRsuz",albumBackup:"PL6-B652C0OuK6c9GiB5m9auSdm2JSKpD0",note:"Eerie harmonies and dark riffs meet ghosts, neon slime, and supernatural chaos."},
 {title:"Teenage Mutant Ninja Turtles",short:"Ninja Turtles",year:1987,video:"cA5yaZ4f8jI",cartoonList:undefined,edition:"1987 series · full first-season marathon",artist:"Green Day",album:"Dookie",albumYear:1994,albumList:"OLAK5uy_mrF_EHJJul_9cUfE-snfFgdEY_nggl9c0",note:"A burst of punk energy for rooftop chases, pizza breaks, and four unlikely heroes."}
];
export function embedURL(list:string|undefined,video:string|undefined,origin:string,muted:boolean,queue?:string[]){
 const params=new URLSearchParams({enablejsapi:"1",origin,playsinline:"1",controls:"1",rel:"0",loop:"1",autoplay:"0",mute:muted?"1":"0"});
 if(list){params.set("listType","playlist");params.set("list",list);}else if(video)params.set("playlist",queue?.length?queue.join(","):video);
 return "https://www.youtube.com/embed/"+(list?"videoseries":video)+"?"+params;
}
