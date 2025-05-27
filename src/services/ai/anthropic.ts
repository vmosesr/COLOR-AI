import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export class AnthropicService {
  static async generateChatResponse(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Promise<string> {
    try {
      const systemPrompt = `You are a design assistant for a color picker app. 
      Provide actionable design advice based on color palettes and project context. 
      Generate code snippets when requested.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\n${messages.length > 0 ? messages[0].content : ''}`,
          },
          ...messages.slice(1),
        ],
        max_tokens: 500,
      });

      const firstBlock = response.content[0];
      if (firstBlock && 'text' in firstBlock) {
        return firstBlock.text || "No response generated.";
      }
      if (firstBlock && 'content' in firstBlock && typeof firstBlock.content === 'string') {
        return firstBlock.content || "No response generated.";
      }
      return "No response generated.";
    } catch (error) {
      throw new Error(`Anthropic API error: ${error}`);
    }
  }

  static async generateCode(
    projectType: string,
    colors: string[],
    description: string,
    requirements: string[]
  ): Promise<{ css: string; html: string; js?: string }> {
    try {
      const prompt = `Generate ${projectType} code using colors: ${colors.join(', ')}.
      Description: ${description}
      Requirements: ${requirements.join(', ')}
      Provide CSS, HTML, and optional JavaScript in markdown code blocks.`;

      const response = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1500,
      });

      const firstBlock = response.content[0];
      let content = '';
      if (firstBlock && 'text' in firstBlock) {
        content = firstBlock.text || '';
      } else if (firstBlock && 'content' in firstBlock && typeof firstBlock.content === 'string') {
        content = firstBlock.content || '';
      }
      return this.parseCodeResponse(content);
    } catch (error) {
      throw new Error(`Anthropic code generation failed: ${error}`);
    }
  }

  private static parseCodeResponse(response: string): { css: string; html: string; js?: string } {
    const cssMatch = response.match(/```css\n([\s\S]*?)\n```/);
    const htmlMatch = response.match(/```html\n([\s\S]*?)\n```/);
    const jsMatch = response.match(/```javascript\n([\s\S]*?)\n```/);

    return {
      css: cssMatch?.[1] || '/* CSS code will be generated here */',
      html: htmlMatch?.[1] || '<!-- HTML code will be generated here -->',
      js: jsMatch?.[1],
    };
  }
}