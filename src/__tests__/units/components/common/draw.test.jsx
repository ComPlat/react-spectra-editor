import { render } from '@testing-library/react'; 
import '@testing-library/jest-dom';
import { drawArrowOnCurve, drawDestroy, drawDisplay, drawLabel, drawMain } from '../../../../components/common/draw';
import { useEffect } from 'react';
const d3 = require('d3');

describe('common/draw', () => {
  describe('.drawMain()', () => {
    it('d3 draw main svg view box', () => {
      function TestComponent({}) {
        useEffect(() => {
          drawMain('.testsvg', 100, 100)
        }, []);
        return (
          <div className='testsvg' data-testid="testsvg"></div>
        )
      }
  
      const { queryByTestId } = render(<TestComponent />);
      const renderResult = queryByTestId('testsvg');
      expect(renderResult).toBeInTheDocument();
      const svgElement = document.querySelector('svg');
      expect(svgElement).toHaveClass('d3Svg');
      expect(svgElement).toHaveAttribute('preserveAspectRatio', 'xMinYMin meet');
      expect(svgElement).toHaveAttribute('viewBox', '0 0 100 100');
    });
  });

  describe('.drawLabel()', () => {
    const rootClass = '.testsvg';
    const xLabelText = 'x label';
    const yLabelText = 'y label';
    const cLabelText = 'c label';

    function drawMyText(hasMarker = false) {
      d3.select(rootClass).append('svg').attr('class', 'd3Svg');
      d3.select('.d3Svg').append('text').attr('class', 'xLabel');
      d3.select('.d3Svg').append('text').attr('class', 'yLabel');
      if (hasMarker) {
        d3.select('.d3Svg').append('text').attr('class', 'mark-text');
      }
    }

    it('d3 draw only axes label', () => {
      function TestComponent({}) {
        useEffect(() => {
          drawMyText(false);
          drawLabel(rootClass, null, xLabelText, yLabelText);
        }, []);
        return (
          <div className='testsvg' data-testid="testsvg"></div>
        )
      }
  
      const { queryByText } = render(<TestComponent />);
      const xLabel = queryByText(xLabelText);
      expect(xLabel).toBeInTheDocument();
      expect(xLabel).toHaveClass('xLabel');
      const yLabel = queryByText(yLabelText);
      expect(yLabel).toBeInTheDocument();
      expect(yLabel).toHaveClass('yLabel');
    });

    it('d3 draw labels witg c label', () => {
      function TestComponent({}) {
        useEffect(() => {
          drawMyText(true);
          drawLabel(rootClass, cLabelText, xLabelText, yLabelText);
        }, []);
        return (
          <div className='testsvg' data-testid="testsvg"></div>
        )
      }
  
      const { queryByText } = render(<TestComponent />);
      const xLabel = queryByText(xLabelText);
      expect(xLabel).toBeInTheDocument();
      expect(xLabel).toHaveClass('xLabel');
      const yLabel = queryByText(yLabelText);
      expect(yLabel).toBeInTheDocument();
      expect(yLabel).toHaveClass('yLabel');
      const cLabel = queryByText(cLabelText);
      expect(cLabel).toBeInTheDocument();
      expect(cLabel).toHaveClass('mark-text');
    });
  });

  describe('.drawDisplay()', () => {
    it('set display as hidden', () => {
      function TestComponent({}) {
        useEffect(() => {
          drawMain('.testsvg', 100, 100);
          drawDisplay('.testsvg', true);
        }, []);
        return (
          <div className='testsvg' data-testid="testsvg"></div>
        )
      }
  
      render(<TestComponent />);
      const svgElement = document.querySelector('svg');
      expect(svgElement).toHaveStyle('width: 0');
    });

    it('set display to show', () => {
      function TestComponent({}) {
        useEffect(() => {
          drawMain('.testsvg', 100, 100);
          drawDisplay('.testsvg', false);
        }, []);
        return (
          <div className='testsvg' data-testid="testsvg"></div>
        )
      }
  
      render(<TestComponent />);
      const svgElement = document.querySelector('svg');
      expect(svgElement).toHaveStyle('width: 100%');
    });
  });

  describe('.drawDestroy()', () => {
    it('d3 remove all svg', () => {
      function TestComponent({}) {
        useEffect(() => {
          drawMain('.testsvg', 100, 100);
          drawDestroy('.testsvg');
        }, []);
        return (
          <div className='testsvg' data-testid="testsvg"></div>
        )
      }
  
      render(<TestComponent />);
      const svgElement = document.querySelector('svg');
      expect(svgElement).not.toBeInTheDocument();
    });
  });

  describe('.drawArrowOnCurve()', () => {
    it('d3 remove all arrows on curves', () => {
      function TestComponent({}) {
        useEffect(() => {
          drawMain('.testsvg', 100, 100);
          d3.select('.d3Svg').append('defs').append('marker');
          drawArrowOnCurve('.testsvg', true);
        }, []);
        return (
          <div className='testsvg' data-testid="testsvg"></div>
        )
      }
  
      render(<TestComponent />);
      const svgElement = document.querySelector('marker');
      expect(svgElement).not.toBeInTheDocument();
    });

    it('d3 draw arrows on curves', () => {
      function TestComponent({}) {
        useEffect(() => {
          drawMain('.testsvg', 100, 100);
          d3.select('.d3Svg').append('defs').append('marker');
          drawArrowOnCurve('.testsvg', false);
        }, []);
        return (
          <div className='testsvg' data-testid="testsvg"></div>
        )
      }
  
      render(<TestComponent />);
      const arrowLeft = document.querySelector('marker');
      expect(arrowLeft).toBeInTheDocument();
      expect(arrowLeft).toHaveAttribute('id', 'arrow-left');   
      expect(arrowLeft).toHaveAttribute('viewBox', '0 0 10 10');
      expect(arrowLeft).toHaveAttribute('refX', '5');
      expect(arrowLeft).toHaveAttribute('refY', '5');
      expect(arrowLeft).toHaveAttribute('markerWidth', '6');
      expect(arrowLeft).toHaveAttribute('markerHeight', '6');
      expect(arrowLeft).toHaveAttribute('orient', 'auto');
      expect(arrowLeft).toHaveAttribute('fill', '#00AA0099');

      const path = arrowLeft.querySelector('path');
      expect(path).toBeInTheDocument();
      expect(path).toHaveAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
    });
  });
});
