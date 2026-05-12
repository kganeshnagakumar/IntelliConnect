# Contributing to IntelliConnect

First off, thank you for considering contributing to IntelliConnect! It's people like you that make IntelliConnect such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](../../issues) to see if someone else in the community has already created a ticket. If not, go ahead and make one!

## Fork & create a branch

If this is something you think you can fix, then fork IntelliConnect and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```bash
git checkout -b 325-add-pdf-export
```

## Get the test suite running

Make sure your local environment is correctly configured and all tests pass before making your changes. 
*(Add specific testing instructions for Django and React here)*

### Mail Flow / Power Automate Modifications
If your contribution involves updating the automated email notifications, you will need to modify the Power Automate flow. The managed solution is located in `Mail_flow_1_0_0_1_managed`. Please import this into your Power Platform environment, make your changes, export the updated managed solution, and overwrite the existing folder in the repository.

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first.

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with IntelliConnect's master branch:

```bash
git remote add upstream https://github.com/your-org/intelli3.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```bash
git checkout 325-add-pdf-export
git rebase master
git push --set-upstream origin 325-add-pdf-export
```

Finally, go to GitHub and make a Pull Request. We'll review your changes and merge them as soon as possible.
