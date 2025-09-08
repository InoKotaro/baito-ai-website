import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import SearchBar from './SearchBar';

// モックデータ
const mockLines = [
  {
    id: '1',
    linename: '環状線',
    RailwayCompany: { id: '1', name: 'AI電鉄' },
  },
];
const mockWages = [{ id: '1', value: '1200', label: '1200円' }];
const mockOccupations = [{ id: '1', occupationname: '接客・サービス' }];

describe('SearchBar', () => {
  test('初期状態で3つのセレクトボックスと検索ボタンが表示される', () => {
    render(
      <SearchBar
        lines={mockLines}
        wages={mockWages}
        occupations={mockOccupations}
      />,
    );

    // 各セレクトボックスがラベルで存在することを確認
    expect(screen.getByLabelText('路線')).toBeInTheDocument();
    expect(screen.getByLabelText('時給')).toBeInTheDocument();
    expect(screen.getByLabelText('業種')).toBeInTheDocument();

    // 検索ボタンが存在することを確認
    expect(screen.getByRole('button', { name: '検索' })).toBeInTheDocument();
  });

  test('ユーザーが各項目を選択すると、フォームの状態が更新される', async () => {
    const user = userEvent.setup();
    render(
      <SearchBar
        lines={mockLines}
        wages={mockWages}
        occupations={mockOccupations}
      />,
    );

    const lineSelect = screen.getByLabelText('路線');
    const wageSelect = screen.getByLabelText('時給');
    const occupationSelect = screen.getByLabelText('業種');

    // ユーザーが各項目を選択する操作をシミュレート
    // await を付けるのは React state 更新と DOM 反映を待つ安全策
    await user.selectOptions(lineSelect, '1');
    await user.selectOptions(wageSelect, '1200');
    await user.selectOptions(occupationSelect, '1');

    // 選択した値がセレクトボックスに反映されていることを確認
    expect(lineSelect).toHaveValue('1');
    expect(wageSelect).toHaveValue('1200');
    expect(occupationSelect).toHaveValue('1');
  });

  test('検索ボタンをクリックすると、選択した値でonSearchが呼び出される', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn(); // onSearch用のモック関数

    render(
      <SearchBar
        lines={mockLines}
        wages={mockWages}
        occupations={mockOccupations}
        onSearch={mockOnSearch}
      />,
    );

    const lineSelect = screen.getByLabelText('路線');
    const wageSelect = screen.getByLabelText('時給');
    const occupationSelect = screen.getByLabelText('業種');
    const searchButton = screen.getByRole('button', { name: '検索' });

    // ユーザーが項目を選択
    await user.selectOptions(lineSelect, '1');
    await user.selectOptions(wageSelect, '1200');
    await user.selectOptions(occupationSelect, '1');

    // 検索ボタンをクリック
    await user.click(searchButton);

    // onSearchが1回だけ呼び出されたことを確認
    expect(mockOnSearch).toHaveBeenCalledTimes(1);

    // onSearchが正しい引数（選択した値）で呼び出されたことを確認
    expect(mockOnSearch).toHaveBeenCalledWith({
      line: '1',
      wage: '1200',
      occupation: '1',
    });
  });

  test('何も選択せずに検索ボタンをクリックすると、空の値でonSearchが呼び出される', async () => {
    const user = userEvent.setup();
    const mockOnSearch = jest.fn();

    render(
      <SearchBar
        lines={mockLines}
        wages={mockWages}
        occupations={mockOccupations}
        onSearch={mockOnSearch}
      />,
    );

    const searchButton = screen.getByRole('button', { name: '検索' });
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith({
      line: '',
      wage: '',
      occupation: '',
    });
  });
});
