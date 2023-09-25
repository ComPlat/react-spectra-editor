import { render } from '@testing-library/react'; 
import '@testing-library/jest-dom';
import { drawMain } from '../../../../components/common/draw';
import { useEffect } from 'react';
describe('common/draw', () => {
  it('.drawMain()', () => {
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
})
