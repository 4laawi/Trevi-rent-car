export async function onRequest(context: any) {
  const url = new URL(context.request.url);
  
  // If it's a static asset, let it through
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/i)
  ) {
    return context.next();
  }
  
  // For all other routes, serve index.html
  return context.env.ASSETS.fetch(new URL('/index.html', context.request.url));
}

