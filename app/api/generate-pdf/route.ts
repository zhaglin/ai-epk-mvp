import { NextRequest, NextResponse } from 'next/server';
import ReactPDF from '@react-pdf/renderer';
import { EPKDocument } from '@/lib/pdf-template';
import { ArtistData } from '@/types';
import React from 'react';

export async function POST(request: NextRequest) {
  try {
    const artistData: ArtistData = await request.json();

    // Валидация данных
    if (!artistData.name || !artistData.city || !artistData.generated) {
      return NextResponse.json(
        { error: 'Недостаточно данных для генерации PDF' },
        { status: 400 }
      );
    }

    // Генерируем PDF элемент
    const pdfElement = React.createElement(EPKDocument, { data: artistData });
    
    // Рендерим в buffer
    const pdfStream = await ReactPDF.renderToStream(pdfElement as any);
    
    // Конвертируем stream в array buffer
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream as any) {
      chunks.push(Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    // Возвращаем PDF файл
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="EPK_${artistData.name.replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Ошибка при генерации PDF' },
      { status: 500 }
    );
  }
}

