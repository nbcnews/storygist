[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# StoryGist
A jQuery plugin for generating a story gist that gives you the overall story quickly.

## Using StoryGist
Storygist takes in an element and searches for bits of content (p, h2, blockquote, etc...) to semi-automatically create a tappable summary- the "gist" of the story.

To begin, you need a story which is made up of a series of already-styled elements. Your stories probably look something like this already. You shouldn't have to change much, if anything.

```html
<body>
  <main>
    <article data-sset="story" class="story" itemscope itemtype="http://schema.org/NewsArticle">
      <div data-sset="story-body" class="story__body">
        <h1 data-sg>Story title</h1>
        <p data-sg>Story text</p>
        <img data-sg src="#" alt="Story image"/>
        <p data-sg>Story text</p>
        <img data-sg src="#" alt="Story image"/>
        <h2 data-sg>Section title</h2>
        <p data-sg>Story text</p>
        <blockquote data-sg>Story quote</blockquote>
        <img data-sg src="#" alt="Story image"/>
      </div>
    </article>
  </main>
```

To create a Storygist of your content, you need to include jQuery and Storygist's JS and CSS.

```html
<link rel="stylesheet" href="/dist/storygist.css">

<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/3.0.0/lazysizes.min.js"></script>
<script src="http://vjs.zencdn.net/5.6.0/video.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-youtube/2.0.8/Youtube.min.js"></script>

<script src="/dist/jquery.storygist.min.js"></script>
```

To load the Storygist, select the parent element of your story and provide the selector Storygist should use to look for the 'beats' of your story. In our case, we've given every beat element the data-attribute of `data-sg`, but you can use any jQuery selector, or even multiple selectors like `beatSelector: 'p,img,blockquote'`

```html
<script>
  $('body').storyGist({
    beatSelector: '[data-sg]'
  });
</script>
```

## Options
Storygist also provides a few parameters you can set when creating your gist.

```js
$('body').storyGist({
  beatSelector: '[data-sg]',
  contentParent: 'main'
  initWidth: 640,
  autoPlay: true,
  autoPlayMs: 2400,
  finalBeat: customFinalBeat
});
```

`beatSelector` is used by storygist to find the story's beats on the page.

`contentParent` is used to determine the parent element of the story's beats and is used for the 'view in story' functionality that exits the user out of the gist and places them in the proper place on the page.

`initWidth` is used to determine what width storyGist should load at- it defaults to `640` - Storygist will only load at window widths lower or equal to 640px.

`autoPlay` is either true or false, and shows each beat for a specified amount of time before automatically moving to the next beat.

`autoPlayMs` lets you specify the amount of time, in milliseconds, to be spent on each beat. It defaults to 2400ms.

`finalBeat` lets you provide HTML to be used as the final beat. It defaults to a beat that lets you share the article or go back to the beginning, but you could use it for whatever you want. To use it, provide an object that looks like this:

```js
customFinalBeat = {
  'raw': null,
  'html': '<div class="gist-beat-container"><h1>Hello world!</h1></div>',
  'type': 'DIV'
}
```

## How Storygist summarizes
First, storygist goes through all of the elements on the page that match the `beatSelector`.

Then to summarize the piece, it only shows 'p' elements that directly follow `h2` or `figure`.

This behavior may become more advanced and configurable in the future, but this works surprisingly well for now.

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

## Develop

1. `nvm use`
2. `npm install`
3. `npm run dev`

Files from `./src/` are compiled into `./dist/`.
