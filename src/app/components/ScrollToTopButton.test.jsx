import { fireEvent, render, screen } from '@testing-library/react';

import ScrollToTopButton from './ScrollToTopButton';

describe('ScrollToTopButton', () => {
  // window.scrollToをモック
  const mockScrollTo = jest.fn();

  beforeAll(() => {
    // windowオブジェクトにscrollToプロパティを定義
    Object.defineProperty(window, 'scrollTo', {
      value: mockScrollTo,
      writable: true,
    });
  });

  beforeEach(() => {
    // 各テストの前にモックをクリア
    mockScrollTo.mockClear();
  });

  // スクロールY位置をモックするヘルパー関数
  const mockScrollY = (scrollY) => {
    Object.defineProperty(window, 'scrollY', {
      value: scrollY,
      writable: true,
    });
    // スクロールイベントを手動で発火
    fireEvent.scroll(window);
  };

  test('スクロール位置が300px未満の場合、ボタンは非表示クラスを持つ', () => {
    render(<ScrollToTopButton />);
    mockScrollY(299);
    // 非表示要素も検索対象に含め、nameセレクタを削除
    const button = screen.getByRole('button', { hidden: true });
    // スタイルクラスで非表示状態を確認
    expect(button).toHaveClass('opacity-0');
  });

  test('スクロール位置が300px以上の場合、ボタンは表示される', () => {
    render(<ScrollToTopButton />);
    mockScrollY(301);
    const button = screen.getByRole('button');
    // スタイルクラスで表示状態を確認
    expect(button).not.toHaveClass('opacity-0');
    expect(button).toBeVisible(); // 念のため残す
  });

  test('ボタンをクリックするとページのトップにスクロールする', () => {
    render(<ScrollToTopButton />);
    mockScrollY(500); // ボタンを表示させる

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  test('ボタンの表示・非表示がスクロールに応じて切り替わる', () => {
    render(<ScrollToTopButton />);

    // 最初は非表示クラスを持つ
    mockScrollY(100);
    let button = screen.getByRole('button', { hidden: true });
    expect(button).toHaveClass('opacity-0');

    // スクロールすると表示クラスを持つ
    mockScrollY(400);
    button = screen.getByRole('button');
    expect(button).not.toHaveClass('opacity-0');

    // 再度スクロールして非表示クラスを持つ
    mockScrollY(200);
    button = screen.getByRole('button', { hidden: true });
    expect(button).toHaveClass('opacity-0');
  });
});
