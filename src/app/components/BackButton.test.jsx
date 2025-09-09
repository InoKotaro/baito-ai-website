import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import BackButton from './BackButton';

// next/navigation のモック
const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

describe('BackButton', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
  });

  test('「戻る」ボタンが正しく表示される', () => {
    render(<BackButton />);
    const backButton = screen.getByRole('button', { name: '戻る' });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toBeEnabled(); // クリック可能であることを確認
  });

  test('クリックするとrouter.back()が呼び出される', async () => {
    const user = userEvent.setup();
    render(<BackButton />);
    const backButton = screen.getByRole('button', { name: '戻る' });

    await user.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });
});
