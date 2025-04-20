// app/api/layouts/route.ts
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AppData, Layout } from '@/types/layout';

const dataFilePath = path.join(process.cwd(), 'public/data/layoutData.json');

export async function readData(): Promise<AppData> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.warn('파일이 없거나 읽기 오류, 기본 구조 생성 중...', err);
    const defaultData: AppData = {
      layouts: [],
      furnitureTypes: [],
      users: [],
    };
    await fs.mkdir(path.dirname(dataFilePath), { recursive: true });
    await fs.writeFile(dataFilePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
  }
}

export async function writeData(data: AppData): Promise<void> {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const layoutId = searchParams.get('layoutId');

  const data = await readData();

  if (layoutId) {
    const layout = data.layouts.find((l) => l.id === layoutId);
    return layout
      ? NextResponse.json(layout)
      : NextResponse.json({ error: '레이아웃을 찾을 수 없습니다' }, { status: 404 });
  }

  if (userId) {
    const userLayouts = data.layouts.filter((l) => l.userId === userId);
    return NextResponse.json(userLayouts);
  }

  return NextResponse.json(data.layouts);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<Layout>;
    if (!body.userId) {
      return NextResponse.json({ error: 'userId가 필요합니다' }, { status: 400 });
    }

    const data = await readData();
    const newLayout: Layout = {
      id: `layout${Date.now()}`,
      userId: body.userId,
      name: body.name || '새 레이아웃',
      timestamp: Date.now(),
      roomDimensions: body.roomDimensions || {
        width: 10,
        height: 8,
        depth: 10,
      },
      furnitures: body.furnitures || [],
    };

    data.layouts.push(newLayout);
    await writeData(data);

    return NextResponse.json(newLayout, { status: 201 });
  } catch (error) {
    console.error('POST 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const layoutId = searchParams.get('layoutId');
    if (!layoutId) {
      return NextResponse.json({ error: 'layoutId가 필요합니다' }, { status: 400 });
    }

    const body = (await request.json()) as Partial<Layout>;
    const data = await readData();
    const index = data.layouts.findIndex((l) => l.id === layoutId);

    if (index === -1) {
      return NextResponse.json({ error: '레이아웃을 찾을 수 없습니다' }, { status: 404 });
    }

    const updatedLayout: Layout = {
      ...data.layouts[index],
      ...body,
      id: layoutId,
      timestamp: Date.now(),
    };

    data.layouts[index] = updatedLayout;
    await writeData(data);

    return NextResponse.json(updatedLayout);
  } catch (error) {
    console.error('PUT 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const layoutId = searchParams.get('layoutId');
    if (!layoutId) {
      return NextResponse.json({ error: 'layoutId가 필요합니다' }, { status: 400 });
    }

    const data = await readData();
    const initialLength = data.layouts.length;
    data.layouts = data.layouts.filter((l) => l.id !== layoutId);

    if (data.layouts.length === initialLength) {
      return NextResponse.json({ error: '레이아웃을 찾을 수 없습니다' }, { status: 404 });
    }

    await writeData(data);
    return NextResponse.json({ message: '삭제 완료', id: layoutId });
  } catch (error) {
    console.error('DELETE 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}
