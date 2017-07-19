[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# Gist
A jQuery plugin for generating a quick mobile-first gist of a longform story or a package of stories. 


### StoryGist
StoryGist was built to summarize longform stories that combine text, videos, photos, and other multimedia. It takes the most visual elements of the story and presents them a quickly-digestible mobile-first card format. It takes a more **automated** approach to building the beats.

### PackageGist
PackageGist was built to summarize a package of stories that are tied together thematically. It takes the most visual elements of each story in the package and combines them all so you can get a sense of all of the content in a package quickly and drop into each story easily. It addresses a more **handmade** approach to building the beats. 

## Using Gist
First take a look at [our examples](https://github.com/nbcnews/storygist/tree/master/examples) that cover a few use cases.

To use Gist, you need a story which is made up of a series of elements. Your stories probably look a lot like this already.

```html
<body>
  <main>
    <article data-sset="story" class="story" itemscope itemtype="http://schema.org/NewsArticle">
      <div data-sset="story-body" class="story__body">
				<p data-sg><h1>Hello world!</h1></p>
				
				<p data-sg><img src="..." /></p>
				
				<p data-sg>Another text beat</p>
	    </div>
    </article>
  </main>
```

To create a Gist of your content, you need to include jQuery and Gist's JS and CSS and some dependencies.

```html
<script src="https://code.jquery.com/jquery-2.2.4.min.js"></script>

<link rel="stylesheet" href="/build/pkggist.css">
<script src="/build/storygist.bundle.js"></script>
```

To load the Gist, select the parent element of your story and provide the selector Gist should use to look for the 'beats' of your story. In our case, we've given every beat element the data-attribute of `data-sg`, but you can use any jQuery selector.

```html
<script>
  $('body').storyGist({
    beatSelector: '[data-sg]'
  });
</script>
```

## Options
Gist also provides a few parameters you can set when creating your gist.

`beatSelector` is used by Gist to find the story's beats on the page.

`contentParent` is used to determine the parent element of the story's beats and is used for the 'view in story' functionality that exits the user out of the gist and places them in the proper place on the page.

`initWidth` is used to determine what width storyGist should load at- it defaults to `640` - Gist will only load at window widths lower or equal to 640px.

`animate` is used to determine whether to show animations when a user navigates to a beat. For example on block quotes, each line will animate in or photos will fade in.

`onboard` is used to determine whether to show the user an on boarding screen that explains story gist and adds a method to get rid of browser chrome on iOS Safari. 

`callToAction` is the text that is used at the bottom of each beat. 

`finalBeat` lets you provide HTML to be used as the final beat. It defaults to a beat that lets you share the article or go back to the beginning, but you could use it for whatever you want. To use it, provide an object that looks like this:

```js
{
  'raw': null,
  'html': '<div class="gist-beat-container"><h1>Hello world!</h1></div>',
  'type': 'DIV'
}
```

## How Storygist summarizes
First, storygist goes through all of the elements on the page that match the `beatSelector`. This lets you hand-curate the elements brought into the gist by adding data attributes.

Alternatively, you could supply multiple selectors for all the types of elements you'd like the gist to include like `"p, figure, blockquote"`. 

To summarize the piece, it only shows 'p' elements that directly follow `h2` or `figure`. This behavior may become more advanced and configurable in the future.

```js
// If the beat is a paragraph, do some special logic
if (beat.type.toLowerCase() === 'p' && beat.prevtype !== undefined) {
  if (beat.prevtype.toLowerCase() === 'h2' ||
      beat.prevtype.toLowerCase() === 'figure') {
    // Only add p elements preceded by h2 or figure
    parsedGistEls.push(beat)
  }
} else {
  // If it isn't, just push it to the gist beats
  parsedGistEls.push(beat)
}
```

# Contributing to Gist

## Develop

1. `nvm use`
2. `npm install`
3. `npm run dev`

Files from `./src/` are compiled into `./build/`.

## Out for Distribution

1. `nvm use`
2. `npm install`
3. `npm run dist`
