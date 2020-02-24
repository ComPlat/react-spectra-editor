import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const MuButton = withStyles({
  root: {
    border: '1px solid #ccc',
    borderRadius: 4,
    fontFamily: 'Helvetica',
    fontSize: 20,
    height: 30,
    lineHeight: '20px',
    minWidth: 30,
    padding: 0,
    width: 30,
  },
})(Button);

const commonStyle = {
  group: {
    display: 'inline-block',
    margin: '0px 0px 0px 10px',
    verticalAlign: 'middle',
  },
  btnHt: {
    backgroundColor: '#2196f3',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#51c6f3',
    },
  },
  iconWp: {
    border: '1px dashed',
    borderRadius: '4px',
  },
  icon: {
    fontSize: 20,
  },
  iconMdi: {
    fontSize: 20,
  },
  txt: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  txtLabel: {
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  txtInput: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    height: 30,
  },
  txtOpt: {
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  selectLabel: {
    fontFamily: 'Helvetica',
    fontSize: 12,
  },
  selectInput: {
    height: 30,
  },
};

const focusStyle = (criteria, cls) => (criteria ? [cls.btnHt] : []);

export { MuButton, commonStyle, focusStyle } // eslint-disable-line
