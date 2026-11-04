const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.webm':'video/webm'};
const ttsByIp = new Map();
let ttsDay = new Date().toISOString().slice(0,10), ttsDailyCount = 0;
function sendJson(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data))}
function setTtsCors(req,res){const origin=req.headers.origin;if(!origin)return true;const allow=(process.env.CARSTUDIO_ALLOWED_ORIGINS||'http://127.0.0.1:4173,http://localhost:4173').split(',').map(x=>x.trim());if(!allow.includes(origin))return false;res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');return true}
async function handleTts(req,res){
  if(!setTtsCors(req,res)){sendJson(res,403,{error:'Origin is not allowed.'});return}
  if(req.method==='OPTIONS'){res.writeHead(204,{'Cache-Control':'no-store'});res.end();return}
  const key=process.env.OPENAI_API_KEY;
  if(req.method==='GET'){sendJson(res,200,{ready:Boolean(key)});return}
  if(req.method!=='POST'){sendJson(res,405,{error:'Method not allowed'});return}
  if(!key){sendJson(res,503,{error:'AI 음성 서버에 OPENAI_API_KEY가 설정되지 않았습니다.'});return}
  const today=new Date().toISOString().slice(0,10);if(today!==ttsDay){ttsDay=today;ttsDailyCount=0;ttsByIp.clear()}
  if(ttsDailyCount>=100){sendJson(res,429,{error:'오늘의 AI 음성 생성 한도에 도달했습니다.'});return}
  const ip=(req.headers['x-forwarded-for']||req.socket.remoteAddress||'local').toString().split(',')[0].trim();const now=Date.now(),recent=(ttsByIp.get(ip)||[]).filter(t=>now-t<60*60*1000);if(recent.length>=8){sendJson(res,429,{error:'요청이 많습니다. 잠시 후 다시 시도해 주세요.'});return}
  try{
    let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>24000){sendJson(res,413,{error:'음성 원고가 너무 깁니다.'});return}}
    const body=JSON.parse(raw||'{}'),text=typeof body.text==='string'?body.text.trim():'';
    if(!text||text.length>4000){sendJson(res,400,{error:'원고는 1~4,000자여야 합니다.'});return}
    const upstream=await fetch('https://api.openai.com/v1/audio/speech',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_TTS_MODEL||'gpt-4o-mini-tts',voice:process.env.OPENAI_TTS_VOICE||'marin',input:text,instructions:'Speak in Korean. Use a smooth, natural, warm and calm professional car presenter voice. Keep the pace relaxed and clear, with natural Korean pronunciation and short pauses. Do not sound excited or theatrical.',response_format:'mp3'})});
    if(!upstream.ok){await upstream.body?.cancel();sendJson(res,502,{error:'AI 음성을 만들지 못했습니다. 모델과 API 사용량을 확인해 주세요.'});return}
    const audio=Buffer.from(await upstream.arrayBuffer());if(!audio.length){sendJson(res,502,{error:'AI 음성 응답이 비어 있습니다.'});return}
    recent.push(now);ttsByIp.set(ip,recent);ttsDailyCount++;
    res.writeHead(200,{'Content-Type':'audio/mpeg','Content-Length':audio.length,'Cache-Control':'no-store'});res.end(audio)
  }catch(err){console.error('TTS request failed:',err.message);sendJson(res,400,{error:'AI 음성 요청을 처리하지 못했습니다.'})}
}
http.createServer(async(req,res)=>{
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(pathname==='/api/tts'||pathname==='/api/tts/status'){await handleTts(req,res);return}
  const target = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!target.startsWith(root + path.sep) && target !== path.join(root,'index.html')) { res.writeHead(403).end('Forbidden'); return; }
  fs.readFile(target,(error,data)=>{
    if(error){res.writeHead(404).end('Not found');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
  });
}).listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log(`CarStudio local preview: http://127.0.0.1:${process.env.PORT||4173}`));

