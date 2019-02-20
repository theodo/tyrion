/**
 * @debt {security} sql-injection The request is not escaped when being called from the command.
 * @debt {quality} simplicity The purpose of this SQL query is hard to understand
 */

mysql("delete * from $input");


/**
 * @debt {quality} naming
 */
myVeryNotWellNamedFunction(data){
    return 4;
}
