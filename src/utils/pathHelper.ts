export default class PathHelper {

    static isFileMatchPathPatternArray(path:string, pathPatterns:Array<string>): boolean {
        for (let pathPattern of pathPatterns){
            if (this.isFileMatchPathPattern(path, pathPattern)) {
                return true;
            }
        }

        return false;
    }

    private static isFileMatchPathPattern(path: string, pathPattern:string): boolean {
        if (pathPattern.indexOf('./') !== 0){
            pathPattern = './' + pathPattern;
        }

        // The only relevant case where the pathPattern can be a file
        if (path === pathPattern) {
            return true;
        }

        // To avoid that services_test/test.ts matches services/
        if (pathPattern.charAt(pathPattern.length-1) !== '/'){
            pathPattern = pathPattern + '/';
        }

        return path.indexOf(pathPattern) === 0;
    }
}
