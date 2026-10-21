import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo de imagen' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen válida' }, { status: 400 });
    }

    const originalSize = file.size;
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // ── PROCESAMIENTO Y OPTIMIZACIÓN WEBP AUTOMÁTICA CON SHARP ────────────
    let pipeline = sharp(inputBuffer).rotate(); // Auto-rotación según EXIF (para fotos de celular)
    const metadata = await pipeline.metadata();

    // Redimensionar si supera 1920px para uso web óptimo
    if ((metadata.width && metadata.width > 1920) || (metadata.height && metadata.height > 1920)) {
      pipeline = pipeline.resize({
        width: 1920,
        height: 1920,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Conversión forzada a formato WebP optimizado
    const webpBuffer = await pipeline
      .webp({
        quality: 82,
        effort: 5,
        lossless: false,
      })
      .toBuffer();

    const optimizedMetadata = await sharp(webpBuffer).metadata();
    const optimizedSize = webpBuffer.length;
    const savedBytes = Math.max(0, originalSize - optimizedSize);
    const savedPercent = originalSize > 0 ? ((savedBytes / originalSize) * 100).toFixed(1) : '0';

    // Generar nombre de archivo limpio con extensión .webp garantizada
    const originalBaseName = (file.name || 'image')
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '-')
      .slice(0, 40);
    const fileName = `${Date.now()}-${originalBaseName}.webp`;

    let finalUrl = '';

    // 1. Intento de subida a Supabase Storage
    try {
      const supabase = getAdminClient();
      const bucketName = 'route-images';

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, webpBuffer, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (!error) {
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);
        finalUrl = publicUrl;
      } else {
        console.warn('Aviso Supabase Storage:', error.message);
      }
    } catch (sbErr) {
      console.warn('Error al conectar a Supabase storage:', sbErr);
    }

    // 2. Fallback de alta disponibilidad local en public/uploads/ si el bucket de Supabase no responde
    if (!finalUrl) {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const localFilePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(localFilePath, webpBuffer);
      finalUrl = `/uploads/${fileName}`;
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      fileName,
      format: 'webp',
      width: optimizedMetadata.width,
      height: optimizedMetadata.height,
      originalSize,
      optimizedSize,
      savedBytes,
      savedPercent: `${savedPercent}%`,
    });
  } catch (err: any) {
    console.error('Error al optimizar y subir imagen:', err);
    return NextResponse.json({ error: err.message || 'Error procesando imagen' }, { status: 500 });
  }
}
