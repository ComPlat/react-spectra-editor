// A JCAMP file whose ##DATA TYPE= ("SQUID") this frontend's classifier does not
// recognise -- readLayout() returns LIST_LAYOUT.PLAIN for it, same as an
// unmapped datatype coming from chem-spectra-app's data_type.json (see
// chem-spectra-app#291). Used by the standalone demo to exercise the
// PLAIN/generic-curve fallback with simple, easy-to-eyeball x/y test data
// (y = x^2).
const plainJcamp = `
##TITLE=Plain Layout Demo
##JCAMP-DX=5.0
##DATA TYPE=LINK
##BLOCKS=1


$$ === CHEMSPECTRA SPECTRUM ORIG ===
##TITLE=Plain Layout Demo
##JCAMP-DX=5.00
##DATA TYPE=SQUID
##DATA CLASS=XYDATA
##ORIGIN=
##OWNER=
##XUNITS=ARBITRARY UNITS
##YUNITS=ARBITRARY UNITS
##XFACTOR=1.0
##YFACTOR=1.0
##FIRSTX=0.0
##LASTX=9.0
##MAXX=9.0
##MAXY=81.0
##MINX=0.0
##MINY=0.0
##NPOINTS=10
##XYDATA= (XY..XY)
0.0, 0.0
1.0, 1.0
2.0, 4.0
3.0, 9.0
4.0, 16.0
5.0, 25.0
6.0, 36.0
7.0, 49.0
8.0, 64.0
9.0, 81.0
##END=


$$ === CHEMSPECTRA PEAK TABLE EDIT ===
##TITLE=Plain Layout Demo
##JCAMP-DX=5.00
##DATA TYPE=SQUIDPEAKTABLE
##DATA CLASS=PEAKTABLE
##MAXX=9.0
##MAXY=81.0
##MINX=0.0
##MINY=0.0
##NPOINTS=0
##PEAKTABLE= (XY..XY)
##END=


$$ === CHEMSPECTRA PEAK TABLE AUTO ===
##TITLE=Plain Layout Demo
##JCAMP-DX=5.00
##DATA TYPE=SQUIDPEAKTABLE
##DATA CLASS=PEAKTABLE
##MAXX=9.0
##MAXY=81.0
##MINX=0.0
##MINY=0.0
##NPOINTS=0
##PEAKTABLE= (XY..XY)
##END=

##END=


`;

export default plainJcamp;
