import fs from "fs";
import path from "path";

export default class Config {
    private readonly path: string;
    private config: any;

    constructor(path:string) {
        this.path = path;
    }

    /**
     * Load the configuration file from the project if it exists and
     * merge it with the default config file.
     */
    private loadConfigs(): void {
      const defaultConfigFile = fs.readFileSync(path.resolve(__dirname, '../../.tyrion-config.json'), 'utf-8');
      const defaultConfig = JSON.parse(defaultConfigFile);


      const projectConfigPath = this.path + '/.tyrion-config.json';

      if (fs.existsSync(projectConfigPath)) {
          const projectConfigFile = fs.readFileSync(projectConfigPath, 'utf-8');
          const projectConfig = JSON.parse(projectConfigFile.toString());
          this.config = Object.assign(defaultConfig, projectConfig);
      } else {
        this.config = defaultConfig;
      }
    }

    getPrices(): any {
      if (!this.config) {
        this.loadConfigs()
      }

      console.info('\nHere are the pricing for each debt item of your project:\n', this.config.pricer);
      return this.config.pricer;
    }

    getStandard(): number {
      if (!this.config) {
        this.loadConfigs()
      }

      console.info('\nStandard: ', this.config.standard);
      return this.config.standard;
    }

    getIgnored(): any{
        if (!this.config) {
            this.loadConfigs()
        }

        console.info('\n Ignore path: ', this.config.ignorePath);
        return this.config.ignorePath;
    }
}
