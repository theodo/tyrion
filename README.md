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

Install Tyrion globally: `npm i -g tyrionl`

## Usage:

Run `tyrion` with the following options

````
  -p, --path [scanDirectory]  The path of the directory you want to analyse
  -e, --evolution [days]      Get the evolution of the debt since X days
  -j, --json                  Limit the output to the json result
  -h, --help                  output usage information
````

Example:

- `tyrion -p ./src` to get the current debt score
- `tyrion --evolution 28 --json -p .` to get the evolution of the debt during 28 days starting from the last commit.

## Writing debt comment

Tyrion parses the files looking for comments that follows the following convention:

````
/**
 * @debt DEBT_TYPE:SUB_TYPE
 */
````
There is a default score for the following DEBT_TYPE:

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

You don't need to specify a SUB_TYPE, so a minimum example can be:
````
/**
 * @debt quality
 */
````

You can add a comment to provide more details about the debt item by following this convention:

````
/**
 * @debt DEBT_TYPE:SUB_TYPE "Author: comment"
 */
````

A complete example could be:
````
/**
 * @debt security:sql-injection "Maximet: The request is not escaped when being called from the command"
 */
````

The parser will look for all lines containing '@debt' and starting either by `*` or `#` which should cover most web programing languages.

## Contribute

1. Install the dependencies `npm i`
2. Run `npm start` during development to see your last changes in action.
