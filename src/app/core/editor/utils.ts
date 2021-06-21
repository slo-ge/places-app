// This proxy proxies any url and sets the cors origin to * to make
// every content access by browser
import {CMS_API_URL} from "@app/core/services/cms.service";
import {Font, Preset} from "@app/core/model/preset";

export const PROXY_URL = '/api/proxy';

//export const PROXY_URL = 'http://localhost:5000/proxy';


/**
 * proxy API to get proxied URL for images
 *
 * @param url
 */
export function proxiedUrl(url: string): string {
  return `${PROXY_URL}/${btoa(url)}`
}

/**
 * because every CMS URL is relative to CMS, so we need to append the api url
 * @param url
 */
export function toAbsoluteCMSUrl(url: string): string {
  // url always starts with "/"
  return `${CMS_API_URL}${url}`;
}

/**
 * this functions appends a new font face to the app
 * @param fontFileUrl
 * @param fontFamily
 */
export function appendFontToDom(fontFileUrl: string, fontFamily: string) {
  const absoluteFontFileUrl = toAbsoluteCMSUrl(fontFileUrl);
  const CSS = `@font-face {
  font-family: '${fontFamily}';
  src: url('${absoluteFontFileUrl}') format('woff'),
       url('${absoluteFontFileUrl}') format('woff2');
  }`;
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(CSS));
  head.appendChild(style);
}

/**
 * using the @import annotation instead of providing certain file
 */
export function importFontInDom(font: Font) {
  const CSS = `@import url('${font.importPath}');
  @font-face {
  font-family: ${font.fontFamily};
  }
  `;
  const head = document.getElementsByTagName('head')[0];
  const style = document.createElement('style');
  style.appendChild(document.createTextNode(CSS));
  head.appendChild(style);
}

export function isVideoBackground(preset: Preset) {
  return preset.backgroundImage.mime.startsWith('video');
}

export function isAbsoluteUrl(url: string) {
  const r = new RegExp('^(?:[a-z]+:)?//', 'i');
  return r.test(url);
}
