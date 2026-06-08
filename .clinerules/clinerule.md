# Work style rules

Rules for this gym-tracker project

## Project rules

- Always use Typescript, do not use Javascript
- Always use Functional Component, do not use Class Component

## Storing SVG in dedicated file

- When generate a new SVG, generate it in /components/icons/index.tsx then import it from the tsx file
- Search entire project for scatter SVGs and put it in /components/icons/index.tsx

### SVG relate reference

- Generate a new SVG in /components/icons/index.tsx like below
- Name_of_SVG: () => {
  return <svg>...</svg>
  }
- Import it from the tsx file like below
- import { Icons } from "@/app/components/icons";
- <Icons.Name_of_SVG />

## Do not use TailwindCSS

- This project does not use TailwindCSS at all. Instead use SCSS
