import { render, screen } from '@testing-library/react';
import React from 'react';

import Pagination from './Pagination';

describe('Pagination Component UI Display Test', () => {
  const mockPaginate = jest.fn();
  const mockPrevPage = jest.fn();
  const mockNextPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('総ページ数が1の場合、ページネーションが表示されないことを確認', () => {
    render(
      <Pagination
        jobsPerPage={10}
        totalJobs={10}
        paginate={mockPaginate}
        currentPage={1}
        prevPage={mockPrevPage}
        nextPage={mockNextPage}
      />,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('＜')).not.toBeInTheDocument(); // 「前へ」ボタンがないこと
    expect(screen.queryByText('＞')).not.toBeInTheDocument(); // 「次へ」ボタンがないこと
    expect(screen.queryByText('～')).not.toBeInTheDocument(); // 省略記号がないこと
  });

  test('総ページ数が複数ある場合、ページネーションが表示されることを確認', () => {
    render(
      <Pagination
        jobsPerPage={10}
        totalJobs={100}
        paginate={mockPaginate}
        currentPage={1}
        prevPage={mockPrevPage}
        nextPage={mockNextPage}
      />,
    );
    expect(screen.getByLabelText('Page navigation')).toBeInTheDocument();
  });

  test('ページ番号とボタンの表示テスト (最初のページ)', () => {
    render(
      <Pagination
        jobsPerPage={10}
        totalJobs={100}
        paginate={mockPaginate}
        currentPage={1}
        prevPage={mockPrevPage}
        nextPage={mockNextPage}
      />,
    );

    // 「前へ」ボタンが無効になっていること
    expect(screen.getByText('＜')).toBeDisabled();
    // 「次へ」ボタンが有効になっていること
    expect(screen.getByText('＞')).toBeEnabled();

    // ページ番号が表示されていること
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.queryByText('4')).not.toBeInTheDocument(); // 4は表示されない
    expect(screen.queryByText('5')).not.toBeInTheDocument(); // 5は表示されない
    expect(screen.getByText('10')).toBeInTheDocument(); // 最後のページ
    expect(screen.getByText('～')).toBeInTheDocument(); // 省略記号

    // 現在のページがアクティブになっていること
    expect(screen.getByText('1')).toHaveClass('bg-orange-100');
  });

  test('ページ番号とボタンの表示テスト (中間のページ)', () => {
    render(
      <Pagination
        jobsPerPage={10}
        totalJobs={100}
        paginate={mockPaginate}
        currentPage={5}
        prevPage={mockPrevPage}
        nextPage={mockNextPage}
      />,
    );

    // 「前へ」「次へ」ボタンが有効になっていること
    expect(screen.getByText('＜')).toBeEnabled();
    expect(screen.getByText('＞')).toBeEnabled();

    // ページ番号が表示されていること
    expect(screen.getByText('1')).toBeInTheDocument(); // 最初のページ
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // 最後のページ
    expect(screen.getAllByText('～').length).toBe(2); // 両側に省略記号

    // 現在のページがアクティブになっていること
    expect(screen.getByText('5')).toHaveClass('bg-orange-100');
  });

  test(' ページ番号とボタンの表示テスト (最後のページ)', () => {
    render(
      <Pagination
        jobsPerPage={10}
        totalJobs={100}
        paginate={mockPaginate}
        currentPage={10}
        prevPage={mockPrevPage}
        nextPage={mockNextPage}
      />,
    );

    // 「前へ」ボタンが有効になっていること
    expect(screen.getByText('＜')).toBeEnabled();
    // 「次へ」ボタンが無効になっていること
    expect(screen.getByText('＞')).toBeDisabled();

    // ページ番号が表示されていること
    expect(screen.getByText('1')).toBeInTheDocument(); // 最初のページ
    expect(screen.queryByText('6')).not.toBeInTheDocument(); // 6は表示されない
    expect(screen.queryByText('7')).not.toBeInTheDocument(); // 7は表示されない
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('～')).toBeInTheDocument(); // 省略記号

    // 現在のページがアクティブになっていること
    expect(screen.getByText('10')).toHaveClass('bg-orange-100');
  });
});
