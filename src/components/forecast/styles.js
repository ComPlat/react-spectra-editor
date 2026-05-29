const forecastSharedStyles = () => ({
  root: {
    backgroundColor: '#fff',
    fontFamily: 'Helvetica, Arial, sans-serif',
    overflowX: 'hidden',
    overflowY: 'auto',
    padding: '8px 12px 12px',
  },
  analysisGrid: {
    alignItems: 'stretch',
    minHeight: 320,
  },
  structureCol: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  tableCol: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  sectionHeader: {
    color: '#66727c',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.06em',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  structureFrame: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'center',
    maxHeight: 'calc(70vh)',
    minHeight: 280,
    overflow: 'hidden',
    padding: 8,
  },
  tableFrame: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flex: '1 1 auto',
    maxHeight: 'calc(70vh)',
    overflow: 'auto',
    scrollbarColor: '#cbd5df transparent',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      height: 4,
      width: 6,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#cbd5df',
      borderRadius: 4,
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: 'transparent',
    },
  },
  table: {
    '& .MuiTableHead-root .MuiTableCell-root': {
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e6e8eb',
      color: '#66727c',
      fontSize: '0.72rem',
      fontWeight: 700,
      letterSpacing: '0.04em',
      padding: '8px 12px',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
    },
    '& .MuiTableBody-root .MuiTableCell-root': {
      borderBottom: '1px solid #edf0f2',
      color: '#25313b',
      fontSize: '0.82rem',
      padding: '7px 12px',
    },
    '& .MuiTableBody-root .MuiTableRow-root:last-child .MuiTableCell-root': {
      borderBottom: 'none',
    },
    '& .MuiTableBody-root .MuiTableRow-root:hover': {
      backgroundColor: '#f8fafc',
    },
  },
  txtLabel: {
    color: '#25313b',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '0.82rem',
  },
  txtTableTitle: {
    color: '#66727c',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  txtTableContent: {
    color: '#25313b',
    fontFamily: 'Helvetica, Arial, sans-serif',
    fontSize: '0.82rem',
    fontVariantNumeric: 'tabular-nums',
  },
  inputSection: {
    marginTop: 12,
  },
  molField: {
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#f8fafc',
      borderRadius: 8,
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: '0.82rem',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e6e8eb',
    },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#cbd5df',
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2196f3',
      borderWidth: 1,
    },
  },
  reference: {
    color: '#66727c',
    fontSize: '0.75rem',
    marginTop: 10,
    padding: '4px 0 0',
    '& a': {
      color: '#1976d2',
      textDecoration: 'none',
    },
    '& a:hover': {
      textDecoration: 'underline',
    },
  },
  messageBox: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    color: '#25313b',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Helvetica, Arial, sans-serif',
    justifyContent: 'center',
    minHeight: 200,
    padding: '24px 16px',
    textAlign: 'center',
    width: '100%',
  },
  messageText: {
    fontSize: '0.9rem',
    lineHeight: 1.5,
    margin: '8px 0 0',
  },
  messageSubText: {
    color: '#66727c',
    fontSize: '0.8rem',
    lineHeight: 1.45,
    margin: '4px 0 0',
  },
  statusCell: {
    textAlign: 'center',
  },
  ownerSelect: {
    minWidth: 52,
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e6e8eb',
    },
    '& .MuiSelect-select': {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      padding: '4px 24px 4px 8px',
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: 6,
      height: 32,
    },
  },
  statusBadge: {
    alignItems: 'center',
    borderRadius: '50%',
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  statusAccept: {
    backgroundColor: '#e8f5e9',
  },
  statusWarning: {
    backgroundColor: '#fff8e1',
  },
  statusReject: {
    backgroundColor: '#fce4ec',
  },
  statusMissing: {
    backgroundColor: '#efebe9',
  },
  statusUnknown: {
    backgroundColor: '#f5f5f5',
  },
  loadingWrap: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    minHeight: 200,
    width: '100%',
  },
});

export default forecastSharedStyles;
