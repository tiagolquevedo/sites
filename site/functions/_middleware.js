// bio.avantiperformance.com.br abre direto a página de links (/links).
// Todo o resto do site continua igual.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname.startsWith("bio.") && url.pathname === "/") {
    let res = await context.env.ASSETS.fetch(new URL("/links", url));
    if (res.status >= 300 && res.status < 400) {
      res = await context.env.ASSETS.fetch(new URL(res.headers.get("location"), url));
    }
    return res;
  }
  return context.next();
}
