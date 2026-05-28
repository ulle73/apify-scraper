import { NextResponse } from 'next/server';
import { estimateJobCredits } from '@/lib/pricing/estimate';

export async function POST(req: Request) {
  try {
    const { scraperId, input } = await req.json();

    if (!scraperId || !input) {
      return NextResponse.json(
        { error: 'Både "scraperId" och "input" krävs.' },
        { status: 400 }
      );
    }

    const estimatedCredits = estimateJobCredits(scraperId, input);
    
    // Starters pack pricing is ~1 SEK per lead, so estimated price is credits * 1 SEK
    const estimatedPrice = estimatedCredits * 1; 

    return NextResponse.json({
      estimatedCredits,
      estimatedPrice,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Ett fel uppstod vid beräkning.' },
      { status: 400 }
    );
  }
}
