/**
 * @debt {security} sql-injection
 * Maximet: The request is not escaped when being called from the command.
 *
 * @debt {quality} simplicity
 * Maximet: The purpose of this SQL query is hard to understand
 */
mysql("delete * from $input");

/**
 * @debt {quality} naming
 */
function myVeryNotWellNamedFunction(data){
    return 4;
}
