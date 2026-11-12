import { globalStyle } from '@vanilla-extract/css';
import { vars } from './theme.css';

globalStyle('*, *::before, *::after', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('html', {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: `var(--app-locked-height, ${vars.layout.appHeight})`,
  overflow: 'hidden',
  overscrollBehavior: 'none',
});

globalStyle(':root', {
  colorScheme: 'dark',
  WebkitTapHighlightColor: 'transparent',
  fontSynthesis: 'none',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
});

globalStyle('body', {
  position: 'fixed',
  inset: 0,
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  overscrollBehavior: 'none',
  touchAction: 'manipulation',
  fontFamily: vars.font.sans,
  fontSize: vars.fontSize.body,
  lineHeight: vars.lineHeight.body,
  color: vars.color.text.primary,
  background: vars.color.bg.base,
});

globalStyle('#root', {
  height: '100%',
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  overscrollBehavior: 'none',
});

globalStyle('button', {
  font: 'inherit',
  color: 'inherit',
});

globalStyle('input, textarea, select', {
  fontFamily: 'inherit',
  fontWeight: 'inherit',
  fontSize: vars.fontSize.field,
  lineHeight: vars.lineHeight.field,
  fontOpticalSizing: 'none',
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
