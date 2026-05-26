import { NextResponse } from "next/server";
import { z } from "zod";
import { createFreeAction } from "@/lib/queries/actions";
import { extractClientIp, hashIp } from "@/lib/security/ip";

const bodySchema = z.object({
  direction: z.enum(["add", "sub"]),
  consent: z.literal(true),
  consentVersion: z.string().min(1),
  ageGroup: z.string().optional(),
  gender: z.string().optional(),
  countryCode: z.string().optional(), // שדה חדש שהדפדפן שולח
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const clientIp = extractClientIp(request);

    if (!clientIp) {
      return NextResponse.json(
        { error: "Unable to determine client IP" },
        { status: 400 }
      );
    }

    const ipHash = hashIp(clientIp);

    // עכשיו המערכת קודם כל לוקחת את המדינה שהמשתמש בחר באופן ידני, ואם אין - מנסה מההדרים
    const countryCode = parsed.data.countryCode 
                     || request.headers.get("cf-ipcountry") 
                     || request.headers.get("x-vercel-ip-country") 
                     || request.headers.get("x-client-geo-location") 
                     || null;

    const result = await createFreeAction({
      ipHash,
      direction: parsed.data.direction,
      consentVersion: parsed.data.consentVersion,
      ageGroup: parsed.data.ageGroup,
      gender: parsed.data.gender,
      countryCode: countryCode ? countryCode.toUpperCase() : null,
    });

    return NextResponse.json({
      ok: true,
      counter: result.counter,
      delta: result.delta,
      direction: result.direction,
      updatedAt: result.updatedAt,
    });
  } catch (error: any) {
    if (error?.code === "FREE_ALREADY_CLAIMED") {
      return NextResponse.json(
        { error: "Free click already used" },
        { status: 409 }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
