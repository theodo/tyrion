import fs from 'fs';
import path from 'path';
import { ConfigInterface, PricesInterface } from '../model/types';

export interface TyrionConfigInterface {
  pricer: PricesInterface;
  standard: number;
  ignorePath: string[];
}

export default class Config implements ConfigInterface {
  public readonly prices: PricesInterface;
  public readonly standard: number;
  public readonly ignorePaths: string[];
  private readonly config: TyrionConfigInterface;

  public constructor(directoryPath: string) {
    const defaultConfigFile = fs.readFileSync(path.resolve(__dirname, '../../.tyrion-config.json'), 'utf-8');
    const defaultConfig = JSON.parse(defaultConfigFile);
    const projectConfigPath = directoryPath + '/.tyrion-config.json';

    if (fs.existsSync(projectConfigPath)) {
      const projectConfigFile = fs.readFileSync(projectConfigPath, 'utf-8');
      const projectConfig = JSON.parse(projectConfigFile.toString());

      // Ensure that the prices are numbers and not strings
      for (let key in projectConfig['pricer']) {
        projectConfig['pricer'][key] = parseInt(projectConfig['pricer'][key]);
      }

      this.config = Object.assign(defaultConfig, projectConfig) as TyrionConfigInterface;
    } else {
      this.config = defaultConfig as TyrionConfigInterface;
    }

    this.prices = this.config.pricer;
    this.standard = this.config.standard;
    //TODO bug "When an ignorePath is specified inside a non root directory then the ignorepath is the wrong one
    this.ignorePaths = this.config.ignorePath;
  }
}
