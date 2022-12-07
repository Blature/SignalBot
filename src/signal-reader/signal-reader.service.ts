import { Injectable } from '@nestjs/common';
import { SignalDetectionResponse } from './dtos/signal-detection-response.dto';

@Injectable()
export class SignalReaderService {
  private availableParsers: string[] = ['Bi_360_MTC_Cx'];

  public tryReadSignal(text: string, parsers?: string[]): SignalDetectionResponse {
    if (!parsers || !parsers.length) {
      parsers = this.availableParsers;
    }

    let log: string[] = [];
    let lastFound;

    text = this.fixUnicodeNumbers(text);
    for (const parser of parsers) {
      const func = this.getParser(parser);
      if (!func) {
        log.push(`error: parser '${parser}' not found`);
        continue;
      }

      let res;

      try {
        log.push(`trying '${parser}'`);
        res = func(text);
      } catch (ex) {
        log.push(`exec error: '${parser}'=> ${ex.message}`);
        continue;
      }

      if (res) {
        if (!res.isValid) {
          lastFound = res;
          log.push(`result invalid: '${parser}'`);
          continue;
        }

        log = [...log, ...(res.log || [])];
        log.push(`parser '${parser}' resolved`);
        res.parser = parser;
        res.isValid = true;

        return res;
      }
    }

    return {
      ...lastFound,
      log,
      isValid: false,
    };
  }

  private getParser(parser: string): (text: string) => SignalDetectionResponse {
    switch (parser) {
      case 'Bi_360_MTC_Cx':
        return this.parse_Bi_360_MTC_Cx.bind(this);
    }
  }

  private parse_Bi_360_MTC_Cx(text: string): SignalDetectionResponse {
    const currency = /([\w]+)\/(USDT|usdt|USD|usd)/gm.exec(text)?.[0];
    const leverage = this.extractTextForLabels(text, ['Leverage', 'LEVERAGE']);

    const entryNumbersBlock = this.extractNumbersBlockForLables(text, [
      'Entry[^\\n]*Targets',
      'Entry[^\\n]*Levels',
      'Entry[^\\n]*:',
    ]);
    const entryLevels = this.extractNumbersByWhiteSpace(entryNumbersBlock);

    const takeProfitNumbersBlock = this.extractNumbersBlockForLables(text, [
      'Take[^\\n]*Profit[^\\n]*Targets',
      'Targets[^\\n]*:',
      'TP',
    ]);
    const takeProfitLevels = this.extractNumbersByWhiteSpace(takeProfitNumbersBlock);

    const slNumbersBlock = this.extractNumbersBlockForLables(text, ['Stop[^\\n]*Loss', 'SL']);
    const stopLoss = this.extractNumbersByWhiteSpace(slNumbersBlock)?.[0];

    return {
      currency,
      entries: entryLevels,
      targets: takeProfitLevels,
      stopLoss,
      leverage,
      isValid: currency && entryLevels?.length && takeProfitLevels?.length && stopLoss,
    } as any;
  }

  private fixUnicodeNumbers(text: string): string {
    return text
      .replace(/𝟬/g, '0')
      .replace(/𝟭/g, '1')
      .replace(/𝟮/g, '2')
      .replace(/𝟯/g, '3')
      .replace(/𝟰/g, '4')
      .replace(/𝟱/g, '5')
      .replace(/𝟲/g, '6')
      .replace(/𝟳/g, '7')
      .replace(/𝟴/g, '8')
      .replace(/𝟵/g, '9');
  }

  private extractNumbersBlockForLables(
    text: string,
    labels: string[],
    options?: {
      toLower?: boolean;
    },
  ): string {
    options = {
      toLower: true,
      ...options,
    };

    const labelsExp = `${labels.map((s) => '(' + (options.toLower ? s.toLowerCase() : s) + ')').join('|')}`;
    const regex = new RegExp(`(${labelsExp})[^\\d^\\.]*([\\d\\.\\s\\-\\)\\(\\]\\[]*)`, 'g');
    const result = regex.exec(options.toLower ? text.toLocaleLowerCase() : text);
    if (!result) {
      return null;
    }

    return result[labels.length + 2];
  }

  private extractNumbersByWhiteSpace(text): string[] {
    if (!text) {
      return [];
    }

    const res = [];
    const regex = /(\s*[\d]+\s*[\)|\]]\s*)*([\d\.]+)/gm;
    let m;

    while ((m = regex.exec(text)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      res.push(m[2]);
    }

    return res;
  }

  private extractTextForLabels(text: string, labels: string[]): string {
    const labelsExp = `${labels.map((s) => '(' + s + ')').join('|')}`;
    const regex = new RegExp(`(${labelsExp})[:]*[\\s]*([^\\n]+)`, 'g');

    return regex.exec(text)?.[labels.length + 2];
  }
}
