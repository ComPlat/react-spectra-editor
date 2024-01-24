import { useEffect } from "react";
import { MountBars, MountPath, MountRef, MountTags } from "../../../helpers/mount";
import { render } from "@testing-library/react";
import { drawMain } from "../../../components/common/draw";
import '@testing-library/jest-dom';
const d3 = require('d3');

describe('helpers/mount', () => {
  const enum MountType { TAG, BAR, REF, PATH }
  function TestComponent({mountType}) {
    useEffect(() => {
      drawMain('.testsvg', 100, 100)
      const target = d3.select('.d3Svg')
      switch(mountType) {
        case MountType.TAG:
          MountTags({ root: target})
          break
        case MountType.BAR:
          MountBars({ root: target})
          break
        case MountType.REF:
          MountRef({ root: target})
          break
        case MountType.PATH:
          MountPath({ root: target}, '#FFFF00')
          break
        default:
          break
      }
    }, [mountType])
    return (
      <div className='testsvg' data-testid="test-div"></div>
    )
  }

  describe('.MountTags()', () => {
    function validateRendered(element: any) {
      expect(element).toHaveAttribute('clip-path', 'url(#clip)')
    }

    beforeEach(() => {
      render(<TestComponent mountType={MountType.TAG}/>)
    })

    const arrayPaths = [
      'pPath', 'bpPath', 'bpTxt', 'igbPath', 'igcPath', 'igtPath', 'mpybPath', 'mpyt1Path', 'mpyt2Path', 'mpypPath', 'aucPath', 'peckerPath'
    ]
    arrayPaths.forEach((path) => {
      const pathName = `.${path}-clip`
      it(`check render ${pathName}`, () => {
        const svgElement = document.querySelector(pathName)
        validateRendered(svgElement)
      });
      
    })
  })

  describe('.MountBars()', () => {
    function validateRendered(element: any) {
      expect(element).toHaveAttribute('clip-path', 'url(#clip)')
    }

    beforeEach(() => {
      render(<TestComponent mountType={MountType.BAR}/>)
    })

    it('check render bars', () => {
      const svgElement = document.querySelector('.bars-clip')
      validateRendered(svgElement)
    });
  })

  describe('.MountRef()', () => {
    function validateRendered(element: any) {
      expect(element).toHaveAttribute('clip-path', 'url(#ref-clip)')
    }

    beforeEach(() => {
      render(<TestComponent mountType={MountType.REF}/>)
    })

    it('check render ref', () => {
      const svgElement = document.querySelector('.ref-clip')
      validateRendered(svgElement)
    });
  })

  describe('.MountPath()', () => {
    function validateRendered(element: any, attributes: string[], values: string[]) {
      attributes.forEach((attr, idx) => {
        expect(element).toHaveAttribute(attr, values[idx])
      })
    }

    function validateStyle(element: any, attributes: string[]) {
      attributes.forEach((attr) => {
        expect(element).toHaveStyle(attr)
      })
    }

    beforeEach(() => {
      render(<TestComponent mountType={MountType.PATH}/>)
    })

    it('check render path', () => {
      const lineClip = document.querySelector('.line-clip')
      validateRendered(lineClip, ['clip-path'], ['url(#clip)'])
      const path = lineClip?.querySelector('.line')
      validateStyle(path, ['fill: none', 'stroke: #FFFF00', 'stroke-width: 1'])
    });
  })
  
})