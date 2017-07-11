[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

# StoryGist
A jQuery plugin for generating a story gist that gives you the overall story quickly.

## Using StoryGist
Storygist takes in an element and searches for bits of content (p, h2, blockquote, etc...) to semi-automatically create a tappable summary- the "gist" of the story.

To begin, you need a story which is made up of a series of elements. Your stories probably look like this already.

```html
<body>
  <main>
    <article data-sset="story" class="story" itemscope itemtype="http://schema.org/NewsArticle">
      <div data-sset="story-body" class="story__body">
        <p data-sg>
          <span class="dropcap">C</span>all me Ishmael. Some years ago&mdash;never mind how long precisely&mdash;having
          little or no money in my purse, and nothing particular to interest me on
          shore, I thought I would sail about a little and see the watery part of
          the world. It is a way I have of driving off the spleen and regulating the
          circulation. Whenever I find myself growing grim about the mouth; whenever
          it is a damp, drizzly November in my soul; whenever I find myself
          involuntarily pausing before coffin warehouses, and bringing up the rear
          of every funeral I meet; and especially whenever my hypos get such an
          upper hand of me, that it requires a strong moral principle to prevent me
          from deliberately stepping into the street, and methodically knocking
          people's hats off&mdash;then, I account it high time to get to sea as soon
          as I can. This is my substitute for pistol and ball. With a philosophical
          flourish Cato throws himself upon his sword; I quietly take to the ship.
          There is nothing surprising in this. If they but knew it, almost all men
          in their degree, some time or other, cherish very nearly the same feelings
          towards the ocean with me.
        </p>
        <div class="gutter--vertical-2x">
          <div class="column--1x set--center">
            <figure class="media" data-sg>
              <img class="lazyload" src="https://cdn0.artstation.com/p/assets/images/images/001/211/240/large/carlos-caminha-mobydick-ahab.jpg?1442278402" data-srcset="https://cdn0.artstation.com/p/assets/images/images/001/211/240/large/carlos-caminha-mobydick-ahab.jpg?1442278402"
              srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" alt="Alt Text">
              <figcaption>Captain Ahab | <a href="https://www.artstation.com/artwork/98doQ">Carlos Caminha</a></figcaption>
            </figure>
          </div>
        </div>
        <p data-sg>
          There now is your insular city of the Manhattoes, belted round by wharves as Indian isles by coral reefs&mdash;commerce surrounds it with her surf. Right and left, the streets take you waterward. Its extreme downtown is the battery, where that noble mole is washed by waves, and cooled by breezes, which a few hours previous were out of sight of land. Look at the crowds of water-gazers there.
        </p>
        <div class="column--three-fourths column--inline set--right">
          <aside class="pullquote" data-sg>
            <q>Posted like silent sentinels all around the town, stand thousands upon thousands of mortal men fixed in ocean reveries.</q>
          </aside>
        </div>
        <p data-sg>
          Circumambulate the city of a dreamy Sabbath afternoon. Go from Corlears
          Hook to Coenties Slip, and from thence, by Whitehall, northward. What do
          you see?&mdash;Posted like silent sentinels all around the town, stand
          thousands upon thousands of mortal men fixed in ocean reveries. Some
          leaning against the spiles; some seated upon the pier-heads; some looking over the bulwarks of ships from China; some high aloft in the rigging, as if striving to get a still better seaward peep. But these are all landsmen; of week days pent up in lath and plaster&mdash;tied to counters, nailed to benches, clinched to desks. How then is this? Are the green fields gone? What do they here?
        </p>
        <p data-sg>
          But look! here come more crowds, pacing straight for the water, and
          seemingly bound for a dive. Strange! Nothing will content them but the
          extremest limit of the land; loitering under the shady lee of yonder
          warehouses will not suffice. No. They must get just as nigh the water as
          they possibly can without falling in. And there they stand&mdash;miles of them&mdash;leagues. Inlanders all, they come from lanes and alleys,
          streets and avenues&mdash;north, east, south, and west. Yet here they all unite. Tell me, does the magnetic virtue of the needles of the compasses of all those ships attract them thither?
        </p>
        <div class="hang hang--left animated" data-animated="fade--in-left">
          <aside class="pullquote">
            <q>What is the chief element he employs?</q>
          </aside>
        </div>
        <div class="hang hang--right animated" data-animated="fade--in-right">
          <aside class="pullquote">
            <q>There stand his trees, each with a hollow trunk, as if a hermit and a crucifix were within; and here sleeps his meadow, and there sleep his cattle; and up from yonder cottage goes a sleepy smoke.</q>
          </aside>
        </div>
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

To load the Storygist, select the parent element of your story and provide the selector Storygist should use to look for the 'beats' of your story. In our case, we've given every beat element the data-attribute of `data-sg`, but you can use any jQuery selector.

```html
<script>
  $('body').storyGist({
    beatSelector: '[data-sg]'
  });
</script>
```

## Options
Storygist also provides a few parameters you can set when creating your gist.

`beatSelector` is used by storygist to find the story's beats on the page.

`contentParent` is used to determine the parent element of the story's beats and is used for the 'view in story' functionality that exits the user out of the gist and places them in the proper place on the page.

`initWidth` is used to determine what width storyGist should load at- it defaults to `640` - Storygist will only load at window widths lower or equal to 640px.

`finalBeat` lets you provide HTML to be used as the final beat. It defaults to a beat that lets you share the article or go back to the beginning, but you could use it for whatever you want. To use it, provide an object that looks like this:

```js
{
  'raw': null,
  'html': '<div class="gist-beat-container"><h1>Hello world!</h1></div>',
  'type': 'DIV'
}
```

## How Storygist summarizes
First, storygist goes through all of the elements on the page that match the `beatSelector`.

Then to summarize the piece, it only shows 'p' elements that directly follow `h2` or `figure`. This behavior may become more advanced and configurable in the future.

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

Files from `./src/` are compiled into `./build/`.

## Out for Distribution

1. `nvm use`
2. `npm install`
3. `npm run dist`
