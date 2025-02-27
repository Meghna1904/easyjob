declare module '@nlpjs/lang-en' {
    export class TokenizerEn {
      tokenize(text: string, normalize?: boolean): string[];
    }
    
    export class StopwordsEn {
      removeStopwords(tokens: string[]): string[];
    }
  }