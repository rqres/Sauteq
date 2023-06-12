# recipe-ai

A recipe generator built with the OpenAI API, Next.js 13, PocketBase, Tailwind CSS and Fuse.js (for fuzzy searching).

## Usage

```bash
npm i && npm run dev
```

## TODO:

- [ ] Add separate loading skeletons when generating a recipe (for images and other parts of the recipe)
- [ ] Only generate images on user demand (checkbox?)
- [ ] Implement Auth
- [ ] Display selected ingredients in generated recipe document differently (maybe somewhere on the side)
- [ ] Add functionality for adding new items to the ingredient DB if the search misses
- [ ] Change default ingredients displayed
- [ ] time of day ?
- [ ] ask user how many servings
- [x] ~~Handle `\n`'s in GPT responses~~
- [x] ~~Create generated recipes UI~~
- [x] ~~Update loading skeleton when generating new recipe~~
