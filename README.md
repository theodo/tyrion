# Tyrion
[![CircleCI](https://circleci.com/gh/theodo/tyrion.svg?style=svg)](https://circleci.com/gh/theodo/tyrion)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Ftheodo%2Ftyrion.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Ftheodo%2Ftyrion?ref=badge_shield)


## About the tool

### Why this tool
We defined at Theodo quality by the "5S quality factor" that the code:

 * 🐛 Stable : has no bugs
 * 🚧 Sustainable : the code is easy to maintain / make evolutions
 * 🚀 Speed: is fast
 * ⚙️ Scalable: is scalable
 * 🔒 Secured: is secured

We think that a team needs the following to be able to deliver code of high quality:

* 📆 Have enough time
* 🗹 Know how to do quality
* 🛠️ Have the right tools
* 🌡️ Be able to measure quality

The goal of tyrion is to help you on the last point "🌡 Be able to measure quality".

### Monitoring technical debt

We defined technical debt as every piece of code or architecture that prevents quality.
Through various experiments, we saw that when we were monitoring the evolution of the technical debt it was more likely to prevent it to increase.
We tried different ways of managing and measuring it in the past (Trello cards, google docs, post-it, ..) but we never found a painless solution that would allow us to:

* 🔍️ Document and update the debt while coding
* 📊 Quickly get an overview and the evolution of the debt
* 👩‍🔧 Have a simple prioritization of the debt 

So we created Tyrion. You can now:

* Document and update your debt directly in the code with specific comments (🔍)
* Automatically get charts and paretos that help you decide which part of the code you should improve next (📊, 👩‍🔧)

## Installation:

You need to use tyrion with node v10. It is not currently working with superior version mainly because problems with the main tool with use: [NodeGit](https://github.com/nodegit/nodegit).

Install Tyrion globally: `npm i -g tyrionl` (yes, `tyrionl` with a final `l`, it's not a typo).

## Usage:

Run `tyrion` with the following options

````
  -p, --path [scanDirectory]  The path of the directory you want to analyse
  -e, --evolution [days]      Get the evolution of the debt since X days
  -b, --branch [days]         Specify the branch used for the evolution. (Default to master)
  -f, --filter [type]         Get the files that are concerned by a particular debt type
  -n, --nobrowser [browser]   Don't open the report after being generated
  -h, --help                  output usage information
````

Example:

- `tyrion -p ./src` to get the current debt score
- `tyrion --evolution 28 -p .` to get the evolution of the debt during 28 days starting from the last commit.
- `tyrion --evolution 28 -b prod -p .` to get the evolution of the debt during 28 days starting from the last commit of the **prod** branch.

## Writing debt comment

You can use either the following debt tag for the same result: `@debt`, `TODO`, `FIXME`.

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

## Override and set the price of each type

You can override the default pricing of debt items by creating a `.tyrion-config.json` file in the root directory of your project. You can even create your own types. Here is the default one:
````
{
    "pricer": {
      "bug": 100,
      "architecture": 100,
      "bugRisk": 5,
      "security": 100,
      "securityRisk": 10,
      "quality": 5,
      "test": 5,
      "doc": 3,
      "ci": 30,
      "deploy": 10,
      "devEnv": 10,
      "outdated": 5
    },
    "standard": 1000,
    "ignorePath": [
      "node_modules",
      "README.md"
    ]
}
````

## Writing good practices examples

You can also mark some files as being "Joconde" a file that follows perfectly the standard of code quality.
You can use either the following tag for the same result: `@best`, `@standard`, `JOCONDE`.

Example: `// JOCONDE React:component "The standard can be find here: http....."`

## Filtering

You can filter the result by any type of debt you want with the option `--filter`.
It will compare the type and the string you pass as an argument after filter.

Example: `tyrion -p ./src --filter bug`


## Ignore paths

You can ignore files containing certain strings by using the `"ignorePath"` option in the config file:
```
"ignorePath": [
  "node_modules",
  "README.md"
]
```

## Contribute

1. Install the dependencies `npm i`
2. Run `npm start` during development to see your last changes in action.


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Ftheodo%2Ftyrion.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Ftheodo%2Ftyrion?ref=badge_large)
