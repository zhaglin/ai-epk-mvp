import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const tmpDir = '/tmp';
  let tmpWritable = false;
  let chromiumExecPath: string | null = null;
  let chromiumVersion: string | null = null;
  const start = Date.now();

  try {
    // Check /tmp access
    const testFile = path.join(tmpDir, `pdf-health-${Date.now()}.tmp`);
    fs.writeFileSync(testFile, 'ok');
    tmpWritable = fs.existsSync(testFile);
    fs.unlinkSync(testFile);
  } catch {}

  try {
    chromiumExecPath = await chromium.executablePath();
  } catch {
    chromiumExecPath = null;
  }

  // Chromium version is not always available without launching; report package version if present
  chromiumVersion = (chromium as any)?.version || null;

  const data = {
    runtime,
    platform: process.platform,
    node: process.version,
    isProduction: process.env.NODE_ENV === 'production',
    tmpDir,
    tmpWritable,
    chromiumExecPath,
    chromiumVersion,
    elapsedMs: Date.now() - start,
  };

  return NextResponse.json({ status: 'ok', data });
}


