import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Solo se aceptan imágenes' }, { status: 400 });
        }

        // Validate size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'La imagen no puede superar 5MB' }, { status: 400 });
        }

        const supabase = getAdminClient();
        const ext = file.name.split('.').pop() || 'jpg';
        const fileName = `route-${Date.now()}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { data, error } = await supabase.storage
            .from('route-images')
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error('Storage upload error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('route-images')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrl });

    } catch (err: any) {
        console.error('Upload error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
