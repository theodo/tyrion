import fs from 'fs';
import path from 'path';

export default class PathHelper {
  /**
   * This function is used to find where the GIT repository is among the parents directory
   *
   * @param scanningPath
   */
  public static getGitRepositoryPath(scanningPath: string): string {
    let currentPath = path.resolve(scanningPath);
    while (currentPath !== '/') {
      const gitPath = currentPath + '/.git';
      if (fs.existsSync(gitPath)) {
        return gitPath;
      }

      currentPath = path.dirname(currentPath);
    }

    throw new Error('No GIT repository was found at ' + path.resolve(scanningPath));
  }

  /**
   * This function is used to know if a file matches an array of pattern like ['./src/', 'nodes_modules']
   * It is used to allow the filtering and ignoring of files
   */
  public static isFileMatchPathPatternArray(filePath: string, pathPatterns: string[]): boolean {
    for (const pathPattern of pathPatterns) {
      if (this.isFileMatchPathPattern(filePath, pathPattern)) {
        return true;
      }
    }

    return false;
  }

  /**
   * This function is used to know if a file matches a pattern like './src/'
   */
  private static isFileMatchPathPattern(filePath: string, pathPattern: string): boolean {
    if (pathPattern.indexOf('./') !== 0) {
      pathPattern = './' + pathPattern;
    }

    // The only relevant case where the pathPattern can be a file
    if (filePath === pathPattern) {
      return true;
    }

    // To avoid that services_test/test.ts matches services/
    if (pathPattern.charAt(pathPattern.length - 1) !== '/') {
      pathPattern = pathPattern + '/';
    }

    return filePath.indexOf(pathPattern) === 0;
  }
}
