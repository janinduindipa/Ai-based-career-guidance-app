'use strict';
const https    = require('https');
const pdfParse = require('pdf-parse');
const mammoth  = require('mammoth');

/* ─────────────────────────────────────────────────────────────────────────────
   Single Gemini REST call — returns parsed response body or throws
───────────────────────────────────────────────────────────────────────────── */
function callModel(apiKey, modelPath, parts) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      contents: [{ parts }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 1024 },
    });

    const req = https.request({
      hostname: 'generativelanguage.googleapis.com',
      path:     `${modelPath}?key=${apiKey}`,
      method:   'POST',
      headers:  { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    }, (res) => {
      let raw = '';
      res.on('data', c => (raw += c));
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          if (json.error) { reject(new Error(`[${json.error.code}] ${json.error.message.substring(0, 120)}`)); return; }
          resolve(json);
        } catch (e) { reject(new Error('JSON parse failed: ' + e.message)); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/* ─────────────────────────────────────────────────────────────────────────────
   Try models in priority order until one succeeds
   Text:  gemini-2.0-flash → gemini-1.5-flash (v1) → gemini-1.5-flash (v1beta) → gemini-pro
   Image: same but use gemini-pro-vision as last resort
───────────────────────────────────────────────────────────────────────────── */
async function callGemini(parts, isImage = false) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Priority: 2.5 models first (confirmed working), then 2.0 fallbacks
  const textModels = [
    '/v1beta/models/gemini-2.5-flash-lite:generateContent',
    '/v1beta/models/gemini-2.5-flash:generateContent',
    '/v1beta/models/gemini-2.0-flash-lite:generateContent',
    '/v1beta/models/gemini-2.0-flash:generateContent',
    '/v1beta/models/gemma-3-4b-it:generateContent',
    '/v1beta/models/gemma-3-12b-it:generateContent',
  ];

  const imageModels = [
    '/v1beta/models/gemini-2.5-flash:generateContent',
    '/v1beta/models/gemini-2.5-flash-lite:generateContent',
    '/v1beta/models/gemini-2.0-flash:generateContent',
    '/v1beta/models/gemini-2.0-flash-lite:generateContent',
  ];

  const models = isImage ? imageModels : textModels;

  for (const modelPath of models) {
    try {
      console.log('[CV] Trying model:', modelPath);
      const outer = await callModel(apiKey, modelPath, parts);

      let text = outer?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log('[CV] ✅ Model worked. Text preview:', text.substring(0, 200).replace(/\n/g, ' '));

      // Strip markdown fences
      text = text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim();
      const start = text.indexOf('{');
      const end   = text.lastIndexOf('}');
      if (start === -1 || end === -1) { console.warn('[CV] No JSON in response, returning {}'); return {}; }

      return JSON.parse(text.slice(start, end + 1));
    } catch (err) {
      console.warn('[CV] Model failed:', modelPath, '|', err.message);
      // continue to next model
    }
  }

  console.error('[CV] All models exhausted — returning empty result');
  return {};
}

/* ─────────────────────────────────────────────────────────────────────────────
   Prompt
───────────────────────────────────────────────────────────────────────────── */
function buildPrompt(cvContent) {
  return `You are a CV parser. Extract information and return ONLY valid JSON.

${cvContent}

Return exactly this JSON (use "" or [] if not found):
{
  "fullName": "candidate full name",
  "alStream": "Technology",
  "skills": ["Programming","Communication"],
  "interests": ["Technology","Engineering"],
  "summary": "2-sentence professional summary"
}

alStream rules — pick ONE exactly:
Technology (CS/IT/Software/Web), Engineering Technology (Civil/Mech/Electrical), Biological Science (Medicine/Biology/Pharmacy), Physical Science (Physics/Chemistry/Maths), Commerce (Business/Finance/Accounting/Marketing), Arts (Law/Psychology/Literature/Media), "" if unknown.

skills — ONLY from: Programming, Mathematics, Communication, Creativity, Team Work, Writing, Leadership, Research, Problem Solving, Data Analysis, Public Speaking, Project Management

interests — ONLY from: Technology, Medicine, Law, Business, Education, Engineering, Arts & Design, Science, Finance, Social Work, Media, Environment, Sports, Hospitality

Output ONLY the JSON object. No markdown, no explanation.`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main controller
───────────────────────────────────────────────────────────────────────────── */
const parseCV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { buffer, mimetype, originalname } = req.file;
    console.log('[CV] File:', originalname, '| mime:', mimetype, '| size:', buffer.length);

    const isImage = mimetype.startsWith('image/');
    let parts;

    if (isImage) {
      console.log('[CV] Mode: IMAGE (vision)');
      const safeMime = mimetype === 'image/jpg' ? 'image/jpeg' : mimetype;
      parts = [
        { inlineData: { mimeType: safeMime, data: buffer.toString('base64') } },
        { text: buildPrompt('(Read all text visible in the CV image above)') },
      ];
    } else {
      console.log('[CV] Mode: TEXT');
      let rawText = '';

      if (mimetype === 'application/pdf' || mimetype === 'application/octet-stream') {
        try {
          const data = await pdfParse(buffer);
          rawText = data.text;
        } catch (pdfErr) {
          console.warn('[CV] pdf-parse failed:', pdfErr.message, '— returning empty text');
          rawText = '';
        }
      } else if (
        mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        mimetype === 'application/msword'
      ) {
        const r = await mammoth.extractRawText({ buffer });
        rawText = r.value;
      } else {
        rawText = buffer.toString('utf-8');
      }

      console.log('[CV] Text length:', rawText.length, '| Preview:', rawText.substring(0, 120).replace(/\n/g, ' '));
      if (!rawText || rawText.trim().length < 10) {
        return res.status(400).json({ error: 'Could not extract text. Try uploading a JPG/PNG image of your CV instead.' });
      }
      parts = [{ text: buildPrompt('CV TEXT:\n' + rawText.substring(0, 4000)) }];
    }

    const parsed = await callGemini(parts, isImage);
    console.log('[CV] Parsed:', JSON.stringify(parsed).substring(0, 300));

    const VALID_STREAMS = ['Physical Science','Biological Science','Commerce','Arts','Technology','Engineering Technology'];
    const result = {
      fullName:  typeof parsed.fullName === 'string'  ? parsed.fullName.trim()  : '',
      alStream:  VALID_STREAMS.includes(parsed.alStream) ? parsed.alStream : '',
      alResults: (parsed.alResults && !Array.isArray(parsed.alResults)) ? parsed.alResults : {},
      olResults: (parsed.olResults && !Array.isArray(parsed.olResults)) ? parsed.olResults : {},
      skills:    Array.isArray(parsed.skills)    ? parsed.skills.filter(s => typeof s === 'string') : [],
      interests: Array.isArray(parsed.interests) ? parsed.interests.filter(i => typeof i === 'string') : [],
      summary:   typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
    };

    const geminiWorked = !!(result.fullName || result.alStream || result.skills.length);
    console.log('[CV] Done. geminiWorked=' + geminiWorked);
    res.json({ success: true, data: result, geminiWorked });

  } catch (err) {
    console.error('[CV] Fatal error:', err.message);
    res.status(500).json({ error: 'Failed to parse CV: ' + err.message });
  }
};

module.exports = { parseCV };
