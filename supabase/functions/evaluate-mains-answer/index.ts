// supabase/functions/evaluate-mains-answer/index.ts
// Skeleton AI Evaluation Edge Function for Mainalyze
// This is a basic version using Google Gemini for UPSC Mains answer evaluation.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { question, fileUrls, userId } = await req.json()

    if (!fileUrls || fileUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No file URLs provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY secret not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // === SKELETON: Basic Evaluation Prompt ===
    const systemPrompt = `You are an expert UPSC Civil Services Mains examiner. 
Evaluate the following answer for a UPSC-style question.

Provide your response strictly in the following JSON format:
{
  "score": <number 0-10>,
  "overall_feedback": "<2-3 sentence summary>",
  "strengths": ["<point 1>", "<point 2>"],
  "weaknesses": ["<point 1>", "<point 2>"],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>"]
}

Be fair, constructive, and specific.`

    // For skeleton: We send the first file URL (image) + question to Gemini Vision
    // In production you would handle PDFs + better OCR / multi-file analysis.
    const firstFileUrl = fileUrls[0]

    const geminiPayload = {
      contents: [{
        parts: [
          { text: `${systemPrompt}\n\nQuestion: ${question || "Not provided"}\n\nAnswer (see attached image):` },
          { 
            fileData: {
              mimeType: "image/jpeg", // Adjust based on actual file if needed
              fileUri: firstFileUrl 
            } 
          }
        ]
      }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      }
    }

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      }
    )

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text()
      console.error("Gemini Error:", errorText)
      return new Response(
        JSON.stringify({ error: 'AI evaluation failed', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const geminiData = await geminiResponse.json()
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || ""

    // Try to parse JSON from Gemini response
    let evaluationResult
    try {
      // Gemini sometimes wraps JSON in ```json ... ```
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      evaluationResult = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        score: 5,
        overall_feedback: rawText.substring(0, 500),
        strengths: [],
        weaknesses: [],
        suggestions: []
      }
    } catch (parseErr) {
      evaluationResult = {
        score: 5,
        overall_feedback: rawText.substring(0, 800) || "AI returned unstructured response.",
        strengths: ["Analysis available in raw feedback"],
        weaknesses: [],
        suggestions: []
      }
    }

    // === SKELETON RESPONSE ===
    const finalResponse = {
      success: true,
      evaluation: evaluationResult,
      raw_ai_response: rawText,           // Useful for debugging in skeleton
      evaluated_files: fileUrls,
      timestamp: new Date().toISOString()
    }

    return new Response(JSON.stringify(finalResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error("Edge Function Error:", error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal error in evaluation function',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
