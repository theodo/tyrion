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
    const defaultConfig = JSON.parse(defaultConfigFile) as TyrionConfigInterface;
    const scanDirConfigPath = directoryPath + '/.tyrion-config.json';
    const fallbackConfigPath = './.tyrion-config.json';

    if (fs.existsSync(scanDirConfigPath)) {
      const projectConfig = this.readConfigFile(scanDirConfigPath);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.config = Object.assign(defaultConfig, projectConfig);
    } else if (fs.existsSync(fallbackConfigPath)) {
      const fallbackProjectConfig = this.readConfigFile(fallbackConfigPath);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.config = Object.assign(defaultConfig, fallbackProjectConfig);
    } else {
      this.config = defaultConfig;
    }

    this.prices = this.config.pricer;
    this.standard = this.config.standard;
    //TODO bug "When an ignorePath is specified inside a non root directory then the ignorepath is the wrong one
    this.ignorePaths = this.config.ignorePath;
  }

  private readConfigFile(filePath: string): TyrionConfigInterface {
    const configFile = fs.readFileSync(filePath, 'utf-8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const projectConfig = JSON.parse(configFile.toString());

    if (Object.prototype.hasOwnProperty.call(projectConfig, 'pricer')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
      const projectConfigPricer = projectConfig['pricer'];
      // Ensure that the prices are numbers and not strings
      for (const key in projectConfigPricer) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        projectConfigPricer[key] = parseInt(projectConfigPricer[key]);
      }
    }

    return projectConfig as TyrionConfigInterface;
  }
}
