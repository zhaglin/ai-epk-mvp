import { NextRequest, NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { EPKDocument } from '@/lib/pdf-template';
import { ArtistData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    console.log('PDF generation started...');
    const artistData: ArtistData = await request.json();
    console.log('Artist data received:', artistData.name);

    // Валидация данных
    if (!artistData.name || !artistData.city || !artistData.generated) {
      console.error('Validation failed: missing required data');
      return NextResponse.json(
        { error: 'Недостаточно данных для генерации PDF' },
        { status: 400 }
      );
    }

    console.log('Creating PDF...');
    
    console.log('Rendering PDF to stream...');
    // Используем JSX напрямую
    const stream = await renderToStream(<EPKDocument data={artistData} />);
    
    console.log('Converting stream to buffer...');
    // Конвертируем stream в buffer
    const chunks: any[] = [];
    for await (const chunk of stream as any) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);
    
    console.log('PDF buffer created, size:', pdfBuffer.length);

    // Возвращаем PDF файл
    const response = new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="EPK_${artistData.name.replace(/\s+/g, '_')}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
    
    console.log('PDF response created successfully');
    return response;
  } catch (error) {
    console.error('Error generating PDF:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Ошибка при генерации PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

