import { defineMiddleware } from 'astro:middleware';
// The production build emits the legacy .html alias; support it in Astro dev too.
export const onRequest = defineMiddleware((context, next) => {
  if (context.url.pathname === '/shakchunnir-badhon/privacy.html') {
    return context.rewrite('/shakchunnir-badhon/privacy/');
  }
  return next();
});
