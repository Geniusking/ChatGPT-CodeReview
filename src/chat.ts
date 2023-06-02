import { ChatGPTAPI } from 'chatgpt';
export class Chat {
  private chatAPI: ChatGPTAPI;

  constructor(apikey: string) {
    this.chatAPI = new ChatGPTAPI({
      apiKey: apikey,
      apiBaseUrl: process.env.OPENAI_API_ENDPOINT || 'https://api.openai.com/v1',
      completionParams: {
        model: process.env.MODEL || 'gpt-3.5-turbo',
        temperature: +(process.env.temperature || 0) || 1,
        top_p: +(process.env.top_p || 0) || 1,
      },
    });
  }

  private generatePrompt = (patch: string) => {
    const answerLanguage = process.env.LANGUAGE
      ? `請用 ${process.env.LANGUAGE} 回答,`
      : '';

    return `幫我做Code Review, 有問題的部分請用emoji標示出來, 並使用Best Practice給出建議, ${answerLanguage} 
    ${patch}
    `;
  };

  public codeReview = async (patch: string) => {
    if (!patch) {
      return '';
    }

    console.time('code-review cost');
    const prompt = this.generatePrompt(patch);

    console.log(prompt);

    const res = await this.chatAPI.sendMessage(prompt);

    console.timeEnd('code-review cost');
    return res.text;
  };
}
