// supabase/functions/evaluate-mains-answer/index.ts
//
// ========================================================
// SKELETON AI EVALUATION EDGE FUNCTION - NO AI ATTACHED
// ========================================================
//
// IMPORTANT FOR OPEN SOURCE / TRANSFER:
// -------------------------------------
// This function contains NO hardcoded AI provider, NO API keys,
// and NO service attachments.
//
// The recipient is expected to implement their own AI evaluation logic.
//
// You can use any provider you want:
//   - Google Gemini
//   - OpenAI (GPT-4o, etc.)
//   - Anthropic Claude
//   - Any other LLM (local or cloud)
//   - etc.
//
// HOW TO USE THIS SKELETON:
// 1. Implement the actual AI call inside the TODO section below.
// 2. Set your own secret(s) using Supabase CLI:
//    supabase secrets set AI_API_KEY=your_key_here
// 3. Deploy with: supabase functions deploy evaluate-mains-answer

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { question, fileUrls } = await req.json()

    if (!fileUrls || fileUrls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No file URLs provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // =====================================================
    // TODO: IMPLEMENT YOUR AI EVALUATION HERE
    // =====================================================
    //
    // Example secret name (change this to whatever you prefer):
    const AI_API_KEY = Deno.env.get('AI_API_KEY')

    if (!AI_API_KEY) {
      return new Response(
        JSON.stringify({ 
          error: 'AI_API_KEY secret not configured',
          message: 'Run: supabase secrets set AI_API_KEY=your_key'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // ---------------------------------------------------------
    // EXAMPLE STRUCTURE (commented out)
    // ---------------------------------------------------------
    // 
    // 1. Google Gemini example:
    // const response = await fetch(`https://generativelanguage...&key=${AI_API_KEY}`, { ... })
    //
    // 2. OpenAI example:
    // const response = await fetch('https://api.openai.com/v1/chat/completions', {
    //   headers: { 'Authorization': `Bearer ${AI_API_KEY}` },
    //   ...
    // })
    //
    // 3. You can also use the file URLs to download content in Deno
    //    and send images/base64 to vision models.

    // === CURRENT BEHAVIOR (Safe placeholder) ===
    // This returns a dummy response so the app doesn't break.
    // Replace this entire section with real AI logic.
    const placeholderEvaluation = {
      score: 0,
      overall_feedback: "AI evaluation not yet implemented in this skeleton.",
      strengths: [],
      weaknesses: [],
      suggestions: [
        "Implement your preferred AI provider in the Edge Function.",
        "Set the corresponding secret using 'supabase secrets set'.",
        "Replace this placeholder logic with actual model calls."
      ]
    }

    return new Response(JSON.stringify({
      success: true,
      evaluation: placeholderEvaluation,
      note: "This is a neutral skeleton. No AI provider is attached.",
      evaluated_files: fileUrls
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Evaluation function error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
