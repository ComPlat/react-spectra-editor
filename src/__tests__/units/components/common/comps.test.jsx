import { render } from '@testing-library/react'; 
import { TabLabel } from "../../../../components/common/comps";
import '@testing-library/jest-dom';

describe('common/comps', () => {
  it('.TabLabel()', () => {
    const labelStr = 'test label';
    function TestComponent({}) {
      return (
        <div data-testid="test-div">
          {
            TabLabel({tabLabel: 'mytestclass'}, labelStr)
          }
        </div>
      )
    }

    const { queryByTestId, queryByText } = render(<TestComponent />);
    const renderedComponent = queryByTestId('test-div');
    expect(renderedComponent).toBeInTheDocument();
    const renderedLabel = queryByText(labelStr);
    expect(renderedLabel).toHaveClass('mytestclass txt-tab-label');
  });
});
