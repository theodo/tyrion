import fs from 'fs';
import path from 'path';

export interface TyrionConfig {
  pricer: Prices;
  standard: number;
  ignorePath: string[];
}

export interface Prices {
  bug: number;
  architecture: number;
  security: number;
  bugRisk: number;
  securityRisk: number;
  quality: number;
  test: number;
  doc: number;
  ci: number;
  deploy: number;
  devEnv: number;
  outdated: number;
  [propName: string]: number;
}

export default class Config {
  public readonly prices: Prices;
  public readonly standard: number;
  public readonly ignorePaths: string[];
  private readonly config: TyrionConfig;

  public constructor(directoryPath: string) {
    const defaultConfigFile = fs.readFileSync(path.resolve(__dirname, '../../.tyrion-config.json'), 'utf-8');
    const defaultConfig = JSON.parse(defaultConfigFile) as TyrionConfig;

    const projectConfigPath = directoryPath + '/.tyrion-config.json';

    if (fs.existsSync(projectConfigPath)) {
      const projectConfigFile = fs.readFileSync(projectConfigPath, 'utf-8');
      const projectConfig = JSON.parse(projectConfigFile.toString()) as TyrionConfig;
      this.config = Object.assign(defaultConfig, projectConfig) as TyrionConfig;
    } else {
      this.config = defaultConfig;
    }

    this.prices = this.config.pricer as Prices;
    this.standard = this.config.standard;
    this.ignorePaths = this.config.ignorePath;
  }
}
