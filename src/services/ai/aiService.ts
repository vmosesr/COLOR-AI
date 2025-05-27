import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY, // Ensure this is set in your environment variables
  dangerouslyAllowBrowser: true
});

export class OpenAIService {
  static async generateChatResponse(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<string> {
    try {
      const systemPrompt = `You are a helpful AI design assistant for a color picker app. 
      Help users create beautiful designs using their extracted color palettes. 
      Ask relevant questions about their project and provide specific, actionable advice.
      When they're ready, help generate appropriate code snippets.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      throw new Error(`OpenAI API error: ${error}`);
    }
  }

  static async generateCode(
    projectType: string,
    colors: string[],
    description: string,
    requirements: string[]
  ): Promise<{ css: string; html: string; js?: string }> {
    try {
      const prompt = `Generate ${projectType} code using these colors: ${colors.join(', ')}.
      Project description: ${description}
      Requirements: ${requirements.join(', ')}
      
      Please provide:
      1. CSS with color variables and styles
      2. HTML structure
      3. Basic JavaScript if needed
      
      Make it modern, responsive, and production-ready.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.3,
      });

      const response = completion.choices[0]?.message?.content || "";
      
      return this.parseCodeResponse(response);
    } catch (error) {
      throw new Error(`Code generation failed: ${error}`);
    }
  }

  private static parseCodeResponse(response: string): { css: string; html: string; js?: string } {
    const cssMatch = response.match(/```css\n([\s\S]*?)\n```/);
    const htmlMatch = response.match(/```html\n([\s\S]*?)\n```/);
    const jsMatch = response.match(/```javascript\n([\s\S]*?)\n```/);

    return {
      css: cssMatch?.[1] || '/* CSS code will be generated here */',
      html: htmlMatch?.[1] || '<!-- HTML code will be generated here -->',
      js: jsMatch?.[1]
    };
  }
}