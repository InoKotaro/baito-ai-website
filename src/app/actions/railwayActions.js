// app/actions/railwayActions.js
'use server';

import prisma from '@/lib/prisma';

export async function getRailwaysWithLines() {
  try {
    const railwayCompanies = await prisma.railwayCompany.findMany({
      include: {
        lines: {
          orderBy: {
            lineName: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
    return railwayCompanies; // [{ id, name, lines: [{ id, lineName }, ...] }, ...]
  } catch (error) {
    console.error('Failed to fetch railway data:', error);
    return []; // エラー時は空配列を返す
  }
}
