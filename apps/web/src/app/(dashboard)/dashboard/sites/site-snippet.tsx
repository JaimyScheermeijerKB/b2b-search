'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function SiteSnippet({
  site,
  baseUrl,
}: {
  site: { id: string; name: string; domain: string; ingestKey: string };
  baseUrl: string;
}) {
  const isLocalhost = baseUrl.includes('localhost');
  const [copied, setCopied] = useState(false);
  const ingestUrl = `${baseUrl}/api/ingest`;
  const snippet = `<script>
(function(){
  var k="${site.ingestKey}";
  var u="${ingestUrl}";
  function send(){
    var v=localStorage.getItem("b2b_v");
    if(!v){v=(typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():"v"+Date.now());localStorage.setItem("b2b_v",v);}
    var s=sessionStorage.getItem("b2b_s");
    if(!s){s="s"+Date.now();sessionStorage.setItem("b2b_s",s);}
    var p={path:location.pathname||"/",referrer:document.referrer||"",title:document.title||"",visitor_id:v,session_id:s};
    var url=u+"?key="+encodeURIComponent(k);
    var blob=new Blob([JSON.stringify(p)],{type:"application/json"});
    if(navigator.sendBeacon)navigator.sendBeacon(url,blob);
    else fetch(url,{method:"POST",body:JSON.stringify(p),headers:{"Content-Type":"application/json"},keepalive:true});
  }
  if(document.readyState==="complete")send();
  else window.addEventListener("load",send);
})();
</script>`;

  async function copySnippet() {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-4 border rounded-lg space-y-4">
      {isLocalhost && (
        <div className="p-3 text-sm bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 rounded-md">
          <strong>Let op:</strong> Met localhost werkt tracking alleen als je site óók lokaal draait. Voor een live website: deploy de app en zet <code className="text-xs">NEXT_PUBLIC_APP_URL</code> in .env.
        </div>
      )}
      <div>
        <div className="font-medium">{site.name}</div>
        <div className="text-sm text-muted-foreground">{site.domain}</div>
      </div>
      <div className="space-y-4">
        <div className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">
          Key: {site.ingestKey}
        </div>
        <div>
          <p className="text-sm font-medium mb-2">Tracking snippet</p>
          <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">
            {snippet}
          </pre>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={copySnippet}
          >
            {copied ? 'Gekopieerd!' : 'Kopieer snippet'}
          </Button>
        </div>
      </div>
    </div>
  );
}
