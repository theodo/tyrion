/**
 * @debt security:sql-injection dangerous "Maximet: The request is not escaped when being called from the command."
 *
 * @debt quality:simplicity "Maximet: The purpose of this SQL query is hard to understand"
 */
mysql('delete * from $input');

/**
 * @debt security "Maximet: We may be exposed to [zip bomb](https://en.wikipedia.org/wiki/Zip_bomb)"
 */
store_file(file_from_user);

/**
 * @debt quality:naming
 */
function myVeryNotWellNamedFunction(data) {
  return 4;
}

// TODO quality contagious "This template could be used as example"
function myTemplate(data) {
  if (true) {
    return false;
  } else {
    callFunction1(data);
  }

  return;
}
