import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import React from 'react';

import JobCard from './JobCard';

// next/imageのモック
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const newProps = { ...props };
    delete newProps.fill;
    //<Image>コンポーネント代わりに<img>タグを使用する為ESLintルール無効化
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...newProps} />;
  },
}));

// supabaseクライアントのモック
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
    },
  },
}));

const mockJobs = [
  {
    id: '1',
    jobtitle: 'テスト求人',
    companyname: 'テスト株式会社',
    hourlywage: 1200,
    workinghours: '9:00-18:00',
    imageurl: '/images/test.jpg',
    line: {
      railwayCompany: {
        railwayCompanyName: 'AI電鉄',
      },
      lineName: '環状線',
    },
    occupation: {
      occupationName: '接客・サービス',
    },
  },
];

describe('JobCard', () => {
  test('「詳細を見る」ボタンが正しいリンクで表示される', async () => {
    render(<JobCard jobs={mockJobs} />);

    // 「詳細を見る」リンクを取得
    const link = await screen.findByRole('link', { name: '詳細を見る' });

    // リンクが存在することを確認
    expect(link).toBeInTheDocument();

    // href属性が正しいことを確認
    expect(link).toHaveAttribute('href', `/jobs/${mockJobs[0].id}`);
  });
});
