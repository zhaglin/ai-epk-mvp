(()=>{var a={};a.id=474,a.ids=[474],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},4322:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{handler:()=>x,patchFetch:()=>w,routeModule:()=>y,serverHooks:()=>B,workAsyncStorage:()=>z,workUnitAsyncStorage:()=>A});var e=c(5736),f=c(9117),g=c(4044),h=c(9326),i=c(2324),j=c(261),k=c(4290),l=c(5328),m=c(8928),n=c(6595),o=c(3421),p=c(7679),q=c(1681),r=c(3446),s=c(6439),t=c(1356),u=c(7134),v=a([u]);u=(v.then?(await v)():v)[0];let y=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/generate-pdf/route",pathname:"/api/generate-pdf",filename:"route",bundlePath:"app/api/generate-pdf/route"},distDir:".next",relativeProjectDir:"",resolvedPagePath:"/Users/zhaglin/ai-epk-mvp/netlify-deploy/app/api/generate-pdf/route.ts",nextConfigOutput:"",userland:u}),{workAsyncStorage:z,workUnitAsyncStorage:A,serverHooks:B}=y;function w(){return(0,g.patchFetch)({workAsyncStorage:z,workUnitAsyncStorage:A})}async function x(a,b,c){var d;let e="/api/generate-pdf/route";"/index"===e&&(e="/");let g=await y.prepare(a,b,{srcPage:e,multiZoneDraftMode:!1});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!x){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||y.isDev||x||(G=D,G="/index"===G?"/":G);let H=!0===y.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{cacheComponents:!!w.experimental.cacheComponents,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>y.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>y.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await y.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await y.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(b instanceof s.NoFallbackError||await y.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}d()}catch(a){d(a)}})},4442:a=>{"use strict";a.exports=import("@sparticuz/chromium")},4870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5154:(a,b,c)=>{"use strict";c.d(b,{q:()=>e});var d=c(6608);async function e(a){let b=(0,d.H)(a);try{let a=await fetch("https://api.htmlpdfapi.com/v1/pdf",{method:"POST",headers:{"Content-Type":"application/json","X-API-KEY":process.env.HTMLPDF_API_KEY||""},body:JSON.stringify({html:b,format:"A4",margin:"24mm",printBackground:!0})});if(!a.ok)throw Error(`HTMLPDF API error: ${a.status}`);let c=await a.arrayBuffer();return Buffer.from(c)}catch(c){console.error("[PDF Fallback] External API failed:",c);let b=`
EPK - ${a.name}
${a.city} • ${a.genres.join(", ")}

ELEVATOR PITCH:
${a.generated?.pitch||""}

BIOGRAPHY:
${a.generated?.bio||""}

KEY HIGHLIGHTS:
${a.generated?.highlights?.map(a=>`• ${a}`).join("\n")||""}

LINKS:
${Object.entries(a.links||{}).filter(([a,b])=>b).map(([a,b])=>`${a}: ${b}`).join("\n")}

Generated by AI-EPK • ${new Date().toLocaleDateString("ru-RU")}
    `.trim();return Buffer.from(b,"utf-8")}}},6439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},6487:()=>{},6608:(a,b,c)=>{"use strict";function d(a){let{name:b,city:c,genres:d,links:e,generated:f,photoUrl:g}=a;if(!f)throw Error("Generated BIO data is missing.");let h=process.env.NEXT_PUBLIC_BASE_URL||"http://localhost:3000";return`
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EPK - ${b}</title>
  
  <!-- Предзагрузка шрифтов для быстрого рендера -->
  <link rel="preload" href="${h}/fonts/NotoSans-Regular.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="preload" href="${h}/fonts/NotoSans-Bold.ttf" as="font" type="font/ttf" crossorigin>
  
  <style>
    /* Регистрация кириллических шрифтов */
    @font-face {
      font-family: 'Noto Sans';
      src: url('${h}/fonts/NotoSans-Regular.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
      unicode-range: U+0400-04FF, U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    
    @font-face {
      font-family: 'Noto Sans';
      src: url('${h}/fonts/NotoSans-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
      unicode-range: U+0400-04FF, U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    
    /* Настройка страницы для PDF */
    @page {
      size: A4;
      margin: 24mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: "Noto Sans", system-ui, -apple-system, "Segoe UI", sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      background: white;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .container {
      max-width: 100%;
      margin: 0 auto;
    }
    
    /* Header с градиентом и логотипом */
    .header {
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #8b5cf6 100%);
      color: white;
      padding: 24px 24px;
      text-align: center;
      margin: -24mm -24mm 20px -24mm;
      border-radius: 0;
      position: relative;
      overflow: hidden;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.3;
    }
    
    .header-content {
      position: relative;
      z-index: 1;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 1px;
    }
    
    .logo-icon {
      width: 32px;
      height: 32px;
      background: white;
      border-radius: 8px;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 900;
      color: #3b82f6;
    }
    
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 6px;
      letter-spacing: -0.5px;
    }
    
    .header .subtitle {
      font-size: 14px;
      font-weight: 400;
      opacity: 0.95;
    }
    
    /* Artist Photo */
    .artist-photo {
      width: 180px;
      height: 180px;
      border-radius: 12px;
      margin: 0 auto 24px auto;
      display: block;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      object-fit: cover;
    }
    
    /* Секции контента */
    .section {
      margin-bottom: 18px;
      padding: 16px 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 12px;
      border-left: 4px solid #3b82f6;
      page-break-inside: avoid;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .section h2 {
      font-size: 16px;
      font-weight: 700;
      color: #1e3a8a;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
    }
    
    .section h2::before {
      content: '';
      width: 4px;
      height: 16px;
      background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
      border-radius: 2px;
      margin-right: 8px;
    }
    
    .section p {
      font-size: 13px;
      line-height: 1.6;
      margin-bottom: 6px;
      text-align: justify;
      color: #374151;
    }
    
    /* Highlights список */
    .highlights {
      list-style: none;
      padding: 0;
    }
    
    .highlights li {
      padding: 8px 0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 13px;
      line-height: 1.5;
      color: #374151;
    }
    
    .highlights li:before {
      content: "✦ ";
      color: #3b82f6;
      font-weight: bold;
      margin-right: 8px;
      font-size: 14px;
    }
    
    .highlights li:last-child {
      border-bottom: none;
    }
    
    /* Links */
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
    
    .link-item {
      display: inline-block;
      padding: 6px 12px;
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
      color: #0369a1;
      text-decoration: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      border: 1px solid #bae6fd;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      color: #64748b;
      font-size: 11px;
    }
    
    /* Watermark (скрытый) */
    .watermark {
      position: fixed;
      bottom: 5mm;
      right: 5mm;
      font-size: 8px;
      color: #cbd5e1;
      opacity: 0.3;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Artist Photo -->
    ${g?`<img src="${h}${g}" alt="${b}" class="artist-photo" />`:""}
    
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">A</div>
          <span>ArtistOne</span>
        </div>
        <h1>${b}</h1>
        <div class="subtitle">${c} • ${d.join(", ")}</div>
      </div>
    </div>
    
    <!-- Краткая презентация -->
    <div class="section">
      <h2>Краткая презентация</h2>
      <p>${f.pitch}</p>
    </div>
    
    <!-- Биография -->
    <div class="section">
      <h2>Биография</h2>
      <p>${f.bio}</p>
    </div>
    
    <!-- Ключевые достижения -->
    ${f.highlights&&f.highlights.length>0?`
    <div class="section">
      <h2>Ключевые достижения</h2>
      <ul class="highlights">
        ${f.highlights.map(a=>`<li>${a}</li>`).join("\n        ")}
      </ul>
    </div>
    `:""}
    
    <!-- Ссылки -->
    ${Object.values(e).some(a=>a)?`
    <div class="section">
      <h2>Ссылки</h2>
      <div class="links">
        ${e.instagram?`<div class="link-item">Instagram: ${e.instagram}</div>`:""}
        ${e.soundcloud?`<div class="link-item">SoundCloud: ${e.soundcloud}</div>`:""}
        ${e.mixcloud?`<div class="link-item">Mixcloud: ${e.mixcloud}</div>`:""}
        ${e.website?`<div class="link-item">Website: ${e.website}</div>`:""}
      </div>
    </div>
    `:""}
    
    <!-- Footer -->
    <div class="footer">
      Создано с помощью ArtistOne • ${new Date().toLocaleDateString("ru-RU",{day:"numeric",month:"long",year:"numeric"})}
    </div>
    
    <!-- Watermark -->
    <div class="watermark">ArtistOne EPK v1.0</div>
  </div>
</body>
</html>
  `.trim()}c.d(b,{H:()=>d})},7134:(a,b,c)=>{"use strict";c.a(a,async(a,d)=>{try{c.r(b),c.d(b,{POST:()=>k,dynamic:()=>m,runtime:()=>l});var e=c(641),f=c(8856),g=c(4442),h=c(6608),i=c(5154),j=a([f,g]);async function k(a){let b=null,c=null;try{let d;if(console.log("[PDF] Starting PDF generation..."),!(c=await a.json())||!c.name||!c.generated)return e.NextResponse.json({error:"Missing required data: name and generated BIO"},{status:400});console.log(`[PDF] Generating PDF for: ${c.name}`);let i=(0,h.H)(c);d=await g.default.executablePath(),console.log("[PDF] Launching browser...");let j={defaultViewport:{width:1280,height:1024},executablePath:d,headless:!0};j.args=g.default.args,b=await f.default.launch(j);let k=await b.newPage();console.log("[PDF] Setting content..."),await k.setContent(i,{waitUntil:["networkidle0","load"],timeout:3e4}),await k.evaluateHandle("document.fonts.ready"),console.log("[PDF] Generating PDF...");let l=await k.pdf({format:"A4",printBackground:!0,margin:{top:"0mm",right:"0mm",bottom:"0mm",left:"0mm"},preferCSSPageSize:!0});await b.close(),b=null,console.log("[PDF] PDF generated successfully!");let m=c.name.replace(/\s+/g,"_").replace(/[^a-zA-Z0-9_-]/g,"");return new e.NextResponse(Buffer.from(l),{status:200,headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="EPK_${m}.pdf"`,"Cache-Control":"no-cache"}})}catch(a){if(console.error("[PDF] Error generating PDF with Puppeteer:",a),b)try{await b.close()}catch(a){console.error("[PDF] Error closing browser:",a)}if(c)try{console.log("[PDF] Trying fallback PDF generation...");let a=await (0,i.q)(c),b=c.name.replace(/\s+/g,"_").replace(/[^a-zA-Z0-9_-]/g,"");return new e.NextResponse(Buffer.from(a),{status:200,headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="EPK_${b}.pdf"`,"Cache-Control":"no-cache"}})}catch(b){return console.error("[PDF] Fallback also failed:",b),e.NextResponse.json({error:"Failed to generate PDF with both methods",details:a instanceof Error?a.message:"Unknown error",fallbackError:b instanceof Error?b.message:"Unknown fallback error"},{status:500})}return e.NextResponse.json({error:"Failed to parse request data",details:a instanceof Error?a.message:"Unknown error"},{status:500})}}[f,g]=j.then?(await j)():j;let l="nodejs",m="force-dynamic";d()}catch(a){d(a)}})},8335:()=>{},8856:a=>{"use strict";a.exports=import("puppeteer-core")},9121:a=>{"use strict";a.exports=require("next/dist/server/app-render/action-async-storage.external.js")},9294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var b=require("../../../webpack-runtime.js");b.C(a);var c=b.X(0,[586,692],()=>b(b.s=4322));module.exports=c})();