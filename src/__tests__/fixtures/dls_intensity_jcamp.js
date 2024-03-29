const dlsIntensityJcamp = `
##TITLE=
##JCAMP-DX=5.0
##DATA TYPE=LINK
##BLOCKS=1
$$ === CHEMSPECTRA SPECTRUM ORIG ===
##TITLE=
##JCAMP-DX=5.00
##DATA TYPE=DLS intensity
##DATA CLASS=XYDATA
##$CSCATEGORY=SPECTRUM
##ORIGIN=
##OWNER=
##XUNITS=Hydrodynamic diameter (nm)
##YUNITS=relative intensity (%)
##XFACTOR=1.0
##YFACTOR=1.0
##FIRSTX=0.4
##LASTX=8630.0
##LASTX=8630.0
##MAXX=8630.0
##MAXY=17.6
##MINX=0.4
##MINY=0.0
##MINX=0.4
##MINY=0.0
##NPOINTS=69
##XYDATA= (XY..XY)
0.4, 0.0
0.463, 0.0
0.536, 0.0
0.621, 0.0
0.719, 0.0
0.833, 0.0
0.965, 0.0
1.12, 0.0
1.29, 0.0
1.5, 0.0
1.74, 0.0
2.01, 0.0
2.33, 0.0
2.7, 0.0
3.12, 0.0
3.62, 0.0
4.19, 0.0
4.85, 0.0
5.61, 0.0
6.5, 0.0
7.53, 0.0
8.72, 0.0
10.1, 0.0
11.7, 0.0
13.5, 0.0
15.7, 0.0
18.2, 0.0
21.0, 0.0
24.4, 0.0
28.2, 0.0
32.7, 0.0
37.8, 0.062
43.8, 0.557
50.7, 0.75
58.8, 0.435
68.1, 0.000727
78.8, 0.834
91.3, 4.05
106.0, 8.9
122.0, 13.8
142.0, 17.0
164.0, 17.6
190.0, 15.2
220.0, 10.9
255.0, 5.92
295.0, 2.06
342.0, 0.294
396.0, 0.022
459.0, 0.0
531.0, 0.112
615.0, 0.256
712.0, 0.354
825.0, 0.367
955.0, 0.298
1110.0, 0.181
1280.0, 0.0677
1480.0, 0.00405
1720.0, 0.0
1990.0, 0.0
2300.0, 0.0
2670.0, 0.0
3090.0, 0.0
3580.0, 0.0
4150.0, 0.0
4800.0, 0.0
5560.0, 0.0
6440.0, 0.0
7460.0, 0.0
8630.0, 0.0
$$ === CHEMSPECTRA INTEGRALS AND MULTIPLETS ===
##$OBSERVEDINTEGRALS= (X Y Z)
##$OBSERVEDMULTIPLETS=
##$OBSERVEDMULTIPLETSPEAKS=
$$ === CHEMSPECTRA SIMULATION ===
##$CSSIMULATIONPEAKS=
##END=


$$ === CHEMSPECTRA PEAK TABLE EDIT ===
##TITLE=
##JCAMP-DX=5.00
##DATA TYPE=UVVISPEAKTABLE
##DATA CLASS=PEAKTABLE
##$CSCATEGORY=EDIT_PEAK
##$CSTHRESHOLD=0.05
##MAXX=8630.0
##MAXY=17.6
##MINX=0.4
##MINY=0.0
##$CSSOLVENTNAME=
##$CSSOLVENTVALUE=0
##$CSSOLVENTX=0
##NPOINTS=0
##PEAKTABLE= (XY..XY)
##END=


$$ === CHEMSPECTRA PEAK TABLE AUTO ===
##TITLE=
##JCAMP-DX=5.00
##DATA TYPE=UVVISPEAKTABLE
##DATA CLASS=PEAKTABLE
##$CSCATEGORY=AUTO_PEAK
##$CSTHRESHOLD=0.05
##MAXX=8630.0
##MAXY=17.6
##MINX=0.4
##MINY=0.0
##NPOINTS=1
##PEAKTABLE= (XY..XY)
164.0, 17.6
##END=

##END=

`;

export default dlsIntensityJcamp;
