

/////////////////////
import { Request, Response } from 'express';
import User from '../models/User';
import { AI_COSTS } from '../config/aiCosts';

// Helper: extract JSON safely
const extractJSON = (text: string) => {
  let jsonStr = text.trim();
  if (jsonStr.startsWith('```json')) {
    jsonStr = jsonStr.substring(7, jsonStr.lastIndexOf('```')).trim();
  } else if (jsonStr.startsWith('```')) {
    jsonStr = jsonStr.substring(3, jsonStr.lastIndexOf('```')).trim();
  }
  return JSON.parse(jsonStr);
};

export const getAtsScore = async (req: Request, res: Response) => {
  console.log('🔥 ATS Controller HIT!');
  console.log('📦 Request Body:', JSON.stringify(req.body).substring(0, 200));
  
  try {
    // @ts-ignore
    const userId = req.user?._id;
    if (!userId) {
      console.log('❌ No user ID found');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found in DB');
      return res.status(404).json({ message: 'User not found' });
    }

    // Credit check
    if (user.credits < AI_COSTS.ATS_SCORE) {
      console.log('❌ Insufficient credits');
      return res.status(403).json({ message: 'Not enough credits.' });
    }

    const { resumeData, jobDescription } = req.body;
    if (!resumeData || !jobDescription) {
      console.log('❌ Missing parameters');
      return res.status(400).json({ message: 'Missing parameters.' });
    }

    const prompt = `
    You are an expert ATS scanner. Return ONLY raw JSON structure matching this model:
    { "score": number, "matchingKeywords": [], "missingKeywords": [], "suggestions": "" }
    
    Job Description: ${jobDescription}
    
    Resume: ${JSON.stringify(resumeData)}
    
    IMPORTANT: Return ONLY valid JSON. No markdown, no explanations, no code blocks. Just pure JSON.
    `;

    console.log('🤖 Calling OpenRouter API...');
    
    // Use direct fetch for OpenRouter compatibility
    const fetchResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "AI Resume Builder"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { 
            role: "system", 
            content: "You are a professional ATS scanner. You MUST respond with ONLY valid JSON. No markdown formatting, no code blocks, no explanations. Just the raw JSON object." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent JSON
        max_tokens: 2000
      })
    });

    console.log('📥 Response Status:', fetchResponse.status);

    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      console.error('❌ OpenRouter API Error:', errorText);
      return res.status(500).json({ 
        message: 'AI service error', 
        error: errorText 
      });
    }

    const result = await fetchResponse.json();
    console.log('✅ Raw Response:', JSON.stringify(result).substring(0, 300));

    const responseText = result.choices?.[0]?.message?.content || "";

    if (!responseText) {
      console.log('❌ Empty response from AI');
      return res.status(500).json({ 
        message: 'Empty AI response',
        raw: result 
      });
    }

    console.log('📝 AI Response Text:', responseText.substring(0, 200));

    let atsData;
    try {
      atsData = extractJSON(responseText);
    } catch (err) {
      console.error('❌ JSON Parse Error:', err);
      console.error('📄 Failed text:', responseText);
      return res.status(422).json({ 
        message: 'Failed to parse AI response', 
        raw: responseText 
      });
    }

    // Deduct credits
    user.credits -= AI_COSTS.ATS_SCORE;
    await user.save();

    console.log('✅ Success! Credits remaining:', user.credits);
    
    return res.status(200).json({ 
      ...atsData, 
      creditsLeft: user.credits 
    });

  } catch (error: any) {
    console.error('❌ ATS Controller Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};


export const enhanceExperience = async (req: Request, res: Response) => {
  console.log('🔥 Enhance Experience Controller HIT!');
  
  try {
    // @ts-ignore
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.credits < AI_COSTS.ENHANCE_EXPERIENCE) {
      return res.status(403).json({ message: 'Not enough credits.' });
    }

    const { resumeData, jobDescription } = req.body;
    if (!resumeData || !jobDescription) {
      return res.status(400).json({ message: 'Missing fields.' });
    }

    const experiences = resumeData.experience || [];

    if (experiences.length === 0) {
      return res.status(400).json({ message: 'No experiences to enhance.' });
    }

    const prompt = `You are a professional resume writer. Enhance these work experiences to be more impactful for this specific job.

JOB DESCRIPTION:
"""
${jobDescription}
"""

CURRENT EXPERIENCES:
"""
${experiences.map((exp: any, i: number) => 
  `Experience ${i+1}:
   Position: ${exp.position || 'N/A'}
   Company: ${exp.company || 'N/A'}
   Description: ${exp.description || 'No description'}
   Dates: ${exp.startDate || '?'} - ${exp.endDate || 'Present'}`
).join('\n\n')}
"""

INSTRUCTIONS:
1. Rewrite each experience description to be more impactful
2. Use strong action verbs (Led, Developed, Implemented, Optimized, etc.)
3. Add quantifiable achievements where possible
4. Tailor the language to match the job description keywords
5. Keep the same position and company names

Return ONLY a JSON object with this EXACT structure:
{
  "enhancedExperiences": [
    {
      "position": "Original Position",
      "company": "Original Company",
      "startDate": "Original Start",
      "endDate": "Original End",
      "description": "Enhanced description with action verbs and metrics"
    }
  ]
}

CRITICAL: Return ONLY the JSON object, nothing else. Keep original position, company, and dates. Only enhance the description.`;

    console.log('🤖 Calling OpenRouter API for enhancement...');
    
    const fetchResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
        "X-Title": "AI Resume Builder"
      },
      body: JSON.stringify({
        model: "openrouter/free",
        messages: [
          { 
            role: "system", 
            content: "You are a professional resume writer. You MUST respond with ONLY valid JSON. Each enhanced experience must include position, company, dates, and enhanced description." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 2000
      })
    });

    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      console.error('❌ OpenRouter API Error:', errorText);
      return res.status(500).json({ 
        message: 'AI service error', 
        error: errorText 
      });
    }

    const result = await fetchResponse.json();
    const responseText = result.choices?.[0]?.message?.content || "";

    console.log('📝 Raw Response:', responseText);

    if (!responseText) {
      return res.status(500).json({ message: 'Empty AI response' });
    }

    let enhancedData;
    try {
      enhancedData = extractJSON(responseText);
    } catch (err) {
      console.error('❌ JSON Parse Error:', err);
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          enhancedData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found');
        }
      } catch (e2) {
        return res.status(422).json({ 
          message: 'Failed to parse AI response', 
          raw: responseText 
        });
      }
    }

    // Merge enhanced descriptions back with original data
    const enhancedExperiences = (enhancedData.enhancedExperiences || []).map((enhanced: any, index: number) => {
      const original = experiences[index] || {};
      return {
        ...original,
        description: enhanced.description || original.description
      };
    });

    console.log(`✅ Enhanced ${enhancedExperiences.length} experiences`);

    user.credits -= AI_COSTS.ENHANCE_EXPERIENCE;
    await user.save();

    return res.status(200).json({ 
      enhancedExperiences, 
      creditsLeft: user.credits 
    });

  } catch (error: any) {
    console.error('❌ Enhance Controller Error:', error);
    return res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message 
    });
  }
};