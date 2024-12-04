# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open


http://localhost:5173/
```

Connecting to vercel

npm i -g @vercel@latest

vercel link

vercel env pull .env.development.local


## Supabase

-- Create the table
create table person_table (
  id bigint primary key generated always as identity,
  pn text not null,
  sn text not null,
  fn text not null,
  sal text not null,
  gnd text not null,
  hse text not null,
  tg text not null,
  nc int not null,
  type text not null,
  pid text,
  tid text,
  mid text not null
);

-- Create the table
create table group_table (
  id bigint primary key generated always as identity,
  sc text not null,
  ss text not null,
  sl text not null,
  g text not null,
  nc int not null,
  dl text not null
);

new
6741fa52d703adf80dd106f4
old
6741f7e9c6e2cccd58bb8efe
