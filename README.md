# Tyrion

Monitoring your technical debt is the best way to prevent it to explode. At Theodo, we tried different ways of managing and measuring it in the past
(Trello cards, google docs, post-it, ..) but we never find a simple solution that would allow us to:

* Discover and map the debt while coding
* Quickly get a measure of the current debt
* Update or remove the debt item when it has changed or been removed
* Know and prioritize what is the best next debt item the team should tackle down

The goal of Tyrion is to help you at least for the first three points by suggesting you to put the debt information of your project right into the code and providing you a 
tool that will then calculate the total debt of your project for you.

As the information will be directly in the code, it will be very easy to add, update and delete each item. Then calculate it with Tyrion is done in an instant.

## Installation:

TODO

## Usage:

Run `tyrion` with the following options

````
  -V, --version  output the version number
  -p, --path     The path of the directory you want to analyse
  -j, --json     The output will be a json string
  -h, --help     output usage information
````

Example: `tyrion -p ./src`

## Writing debt comment

Tyrion parses the files looking for comments that follows the following convention:

````
/**
 * @debt {DEBT_TYPE} SUB_TYPE
 */
````
DEBT_TYPE should be of one of the following:

* architecture
* bug
* bug-risk
* security
* security-risk
* quality
* test
* doc
* ci
* deploy
* dev-env

A minimum example:
````
/**
 * @debt {quality} naming
 */
````


Complete example:
````
/**
 * @debt {security} sql-injection
 * Maximet: The request is not escaped when being called from the command.
 */
````

⚠ Only the comment starting with /** will work as we are using the [comment-parser](https://github.com/yavorskiy/comment-parser) library.

## Contribute

1. Install the dependencies `npm i`
2. Run `npm start` during development to see your last changes in action.
