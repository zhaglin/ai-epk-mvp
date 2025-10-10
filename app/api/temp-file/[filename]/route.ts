import { NextRequest, NextResponse } from 'next/server';
import { readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    
    // Проверяем безопасность имени файла
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }
    
    // На Netlify используем /tmp
    const uploadsDir = process.env.NETLIFY 
      ? '/tmp/uploads'
      : join(process.cwd(), 'tmp', 'uploads');
    
    const generatedDir = process.env.NETLIFY
      ? '/tmp/generated'
      : join(process.cwd(), 'public', 'generated');
    
    // Ищем файл сначала в uploads, потом в generated
    let filePath = join(uploadsDir, filename);
    
    if (!existsSync(filePath)) {
      filePath = join(generatedDir, filename);
      
      if (!existsSync(filePath)) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
    }
    
    // Читаем файл
    const fileBuffer = await readFile(filePath);
    
    // Определяем Content-Type на основе расширения
    const extension = filename.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'webp':
        contentType = 'image/webp';
        break;
    }
    
    return new NextResponse(Buffer.from(fileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Кэшируем на 1 час
        'Content-Length': fileBuffer.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('[Temp File] Error serving file:', error);
    
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}

// Удаление временного файла (опционально)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }
    
    // На Netlify используем /tmp
    const uploadsDir = process.env.NETLIFY 
      ? '/tmp/uploads'
      : join(process.cwd(), 'tmp', 'uploads');
    
    const filePath = join(uploadsDir, filename);
    
    if (existsSync(filePath)) {
      await unlink(filePath);
      console.log('[Temp File] Deleted:', filename);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('[Temp File] Error deleting file:', error);
    
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
