# Contributing to Tyrion
All contributions are welcome.
This file is still in WIP. The main goal is to help you when you want to contribute.

## Where should you expect complexity when contributing ?
This software relies a lot on [nodegit](https://www.nodegit.org/) which is the node implementation of [libgit2](https://libgit2.org/).
A part of the complexity is about understanding the Git / libgit2 objects we are manipulating.
An other part is about the name of the objects to represent quality in the code. 
The last part is about the code of the program itself.

### Nodegit concepts

### Quality concepts
We allow the user to specify a piece of **bad quality** code that is represented by the 
 **debtItem** object in the code. We can also specify a piece of good but also **good quality** code 
that we call **joconde**.
The **debt** object contains all **debtItem** objects and an Array of **DebtParetos** which is used 
to group debtItem by type.

In the same spirit, the **louvre** object contains all **joconde** objects and an Array of **jocondeParetos** which is used 
to group joconde by type.

There is a big bag object called **codeQualityInformation** that contains both the debt and the louvre object.

This is for one commit. When we want to have the evolution, we have the **codeQualityInformationHistory** object
that contains a **codeQualityInformation** for each commit of the project allowing us to graph a evolution of 
the quality of the project.

### The architecture

The flow:

1. We get the HEAD of the branch specified by the user
2. We walk through the history of commits
3. For each commit we look at all the lines of all the files of the code at this specific commit
4. For each debt tag we find in the line, we create a `debtItem` object
5. The debtItem object is added to the debt object through the codeQualityInformation object with the line `codeQualityInformation.debt.addDebtItem(debtItem);`  
6. The renderer services are called to display the information

## Local development

1. Install the dependencies `npm i`
2. Run `npm start` during development to see your last changes in action.
