import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function limitText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLength).trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const startingLocation = limitText(body.startingLocation, 80);
    const numberOfDays = limitText(body.numberOfDays, 20);
    const season = limitText(body.season, 60);
    const travelStyle = limitText(body.travelStyle, 80);
    const dogComing = limitText(body.dogComing, 10);
    const comfortLevel = limitText(body.comfortLevel, 80);
    const mainConcern = limitText(body.mainConcern, 500);

    if (!startingLocation || !numberOfDays || !season || !travelStyle || !comfortLevel) {
      return NextResponse.json(
        {
          error:
            "Please complete the required trip details before generating your trip fit.",
        },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are a friendly, practical van travel guide for Between Roads, a curated van rental and trip support brand.

Create a beginner-friendly trip fit recommendation based on the user's answers.

Important constraints:
- Keep the full response under 450 words.
- Use 3 to 4 items in each list.
- Do not create a detailed itinerary.
- Do not recommend specific campsites.
- Do not make claims about real-time weather, road closures, permits, campsite availability, or pet policies.
- Frame the response as starter guidance, not a final travel plan.
- Keep the tone warm, practical, calm, and confidence-building.
- Make the guidance useful for someone who may be new to van travel.

User answers:
- Starting location: ${startingLocation}
- Number of days: ${numberOfDays}
- Season or month: ${season}
- Travel style: ${travelStyle}
- Dog coming: ${dogComing}
- Comfort level with van travel: ${comfortLevel}
- Main concern: ${mainConcern || "No specific concern provided"}

Return valid JSON only. Do not include markdown, commentary, or code fences.

Use this exact structure:
{
  "tripVibe": "",
  "recommendedRouteType": "",
  "summary": "",
  "packingPriorities": [],
  "beginnerTips": [],
  "dogFriendlyNotes": [],
  "vanComfortTips": [],
  "addOnsToConsider": [],
  "confidenceChecklist": []
}
      `,
    });

    const outputText = response.output_text;

    let parsedResult;

    try {
      parsedResult = JSON.parse(outputText);
    } catch {
      return NextResponse.json(
        {
          error: "The trip guidance came back in an unexpected format. Please try again.",
          rawOutput: outputText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error("Trip finder error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while generating the trip recommendation. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}