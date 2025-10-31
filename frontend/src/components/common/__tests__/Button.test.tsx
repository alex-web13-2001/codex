import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../Button';

describe('Button', () => {
  it('renders label and handles click', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: /click me/i });
    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
