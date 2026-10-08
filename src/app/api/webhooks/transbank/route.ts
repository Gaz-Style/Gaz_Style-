import { NextRequest, NextResponse } from 'next/server';
import { commitWebpayTransaction } from '@/lib/transbank';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const token = formData.get('token_ws')?.toString();

    if (!token) {
      // TBK_TOKEN viene en query en pagos anulados o GET
      const url = new URL(request.url);
      const abortedToken = url.searchParams.get('TBK_TOKEN');
      if (abortedToken) {
          console.log("Transacción abortada por el usuario");
      }
      return NextResponse.redirect(new URL('/?error=pago_rechazado', request.url));
    }

    const result = await commitWebpayTransaction(token);

    if (result.success && result.data.response_code === 0) {
      return NextResponse.redirect(new URL('/?success=pago_confirmado', request.url));
    } else {
      return NextResponse.redirect(new URL('/?error=pago_rechazado', request.url));
    }
  } catch (error) {
    console.error('Error in Webpay commit callback:', error);
    return NextResponse.redirect(new URL('/?error=pago_rechazado', request.url));
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/?error=pago_cancelado', request.url));
}
