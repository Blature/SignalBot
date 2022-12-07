import { Test, TestingModule } from '@nestjs/testing';
import { SignalReaderModule } from '../../../src/signal-reader/signal-reader.module';
import { SignalReaderService } from '../../../src/signal-reader/signal-reader.service';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

describe('Signal Reader Service', () => {
  let app: TestingModule;
  let signalReaderService: SignalReaderService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports:[SignalReaderModule],
    }).compile();
    signalReaderService = app.get<SignalReaderService>(SignalReaderService);
  });

  afterAll(async()=>{
    await app.close();
  });

  describe('Detect signals according to static files', () => {

    it('should parse all samples',async()=>{
      const samplesDir: string = path.join(__dirname, 'samples');
      const sampleFileNames = (await fs.readdirSync(samplesDir)).filter(f=>f.endsWith('.txt'));
      const exceptions: { txt: string, json: string, fileName: string, response }[] = [];
      
      for(const fileName of sampleFileNames){
        const txt: string = await fs.readFileSync(path.join(samplesDir, fileName)).toString();
        const json: string = await fs.readFileSync(path.join(samplesDir, fileName+'.json')).toString();
        const serviceResponse = signalReaderService.tryReadSignal(txt);
        const isMatched = _.isMatch(serviceResponse, JSON.parse(json));

        if(!isMatched){
          exceptions.push({txt,json, fileName, response: serviceResponse});
        }
      }

      exceptions.map(e => {
        console.log(`Exception on file: ${e.fileName}`);
        console.log(e.txt);
        console.log(e.json);
        console.log(e.response);
      });

      expect(exceptions.length).toEqual(0);
    })
  });
});
