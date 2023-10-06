
# Fruitdeeps

Fruitdeeps is an easy-to-use overhit damage per second calculator for the popular MMO Oldschool Runescape (OSRS). OSRS presents complex combinatoric optimization problems that are not simple to solve, but fruitdeeps allows users to interface with these problems very quickly

## Live Version
https://fruitdeeps.app/

## Clone in local

Fruitdeeps is very easy to run locally.

In a command line, run the following commands:

Clone the repo

``` 
git clone https://github.com/markbrandly/fruitdeeps.git
```

Install packages
```
yarn 
```

Run the dev server
```
yarn run dev
```

That's it! Fruitdeeps should be available locally at http://localhost:3000

## Updating the items and NPCs

Fruitdeeps pulls item info from a maintained version of osrs-box located at https://github.com/Flipping-Utilities/osrsbox-db/

Npc info is scraped from the wiki using the py package mw-parser

To update items, simply navigate to the `fruitdeeps/` folder and run the following command:

```
yarn run fetch-items
```

To update NPCs, run the following command:

```
yarn run fetch-npcs
