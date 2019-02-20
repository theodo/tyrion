# Tyrion

Monitoring your technical debt is the best way to prevent it to explode. At Theodo, we tried different ways of managing and measuring it in the past
(Trello cards, google docs, post-it, ..) but we never find a simple solution that would allow us to:

* Easily collect the debt while coding
* Calculate the current debt score
* Remove debt item when it has been fixed
* Prioritize what you be tackle next

The goal of Tyrion is to help you at least for the first three points by suggesting you to put the debt information of your project right into the code and providing you a 
tool that will then calculate the total debt of your project for you.

As the information will be directly in the code, it will be very easy to add, update and delete each item. Then calculate it with Tyrion is done in a moment.

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

## Contribute

1. Install the dependencies `npm i`
2. Run `npm start` during development to see your last changes in action.
