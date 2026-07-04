import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('html, body, #root', {
  height: '100%',
});

globalStyle(':root', {
  colorScheme: 'dark',
  WebkitTapHighlightColor: 'transparent',
  fontSynthesis: 'none',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
});

globalStyle('body', {
  fontFamily: vars.font.sans,
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.primary,
  background: vars.color.bg.base,
  overscrollBehaviorY: 'none',
});

globalStyle('#root', {
  minHeight: vars.layout.appHeight,
  display: 'flex',
  flexDirection: 'column',
});

globalStyle('button, input, textarea, select', {
  font: 'inherit',
  color: 'inherit',
});

globalStyle('button', {
  cursor: 'pointer',
  border: 'none',
  background: 'none',
});

globalStyle('a', {
  color: vars.color.text.link,
  textDecoration: 'none',
});

globalStyle('::selection', {
  background: vars.color.green[700],
  color: vars.color.text.primary,
});

// Тонкий, фирменный скроллбар
globalStyle('::-webkit-scrollbar', {
  width: '6px',
  height: '6px',
});
globalStyle('::-webkit-scrollbar-thumb', {
  background: vars.color.border.strong,
  borderRadius: vars.radius.full,
});
