// Shared styles for the standalone page's inputs. JSS only: nothing under src/standalone may
// import a stylesheet, and nothing here reaches the editor or the host page.

// A dashed drop box that fills its slot in the input bar.
const dropBox = {
  alignItems: 'center',
  border: '2px dashed #9aa5b1',
  borderRadius: 8,
  boxSizing: 'border-box',
  color: '#3e4c59',
  cursor: 'pointer',
  display: 'flex',
  fontSize: 15,
  height: 44,
  justifyContent: 'center',
  overflow: 'hidden',
  padding: '0 12px',
  textOverflow: 'ellipsis',
  transition: 'background-color 120ms, border-color 120ms',
  whiteSpace: 'nowrap',
  width: '100%',
  '&:hover': {
    backgroundColor: '#f0f4f8',
    borderColor: '#52606d',
  },
};

// A box whose input is optional or not usable yet.
const dropBoxMuted = {
  borderColor: '#cbd2d9',
  color: '#9aa5b1',
};

// The hint shown in a drop box's tooltip.
const hint = {
  fontSize: 13,
  lineHeight: 1.5,
  margin: 0,
  paddingLeft: 16,
};

export { dropBox, dropBoxMuted, hint };
