# PrivatePDF 

PrivatePDF is a free web tool that lets you make quick PDF edits from within your web browser, without uploading anything anywhere.

I created this tool to make it quick and easy to sign PDF contracts, without having to deal with installing programs and without worrying that my PDFs will get uploaded to a third party.

It supports the bare minimum for my most common usecases. It is not intended to be a full-featured PDF editor.

Check it out by either [picking a PDF of your own](https://photown.github.io/private-pdf/), or [with a preloaded sample PDF](https://photown.github.io/private-pdf/?pdf=https://raw.githubusercontent.com/photown/private-pdf/09b3a899cbce5ba2d5241110e944139d7f7e161a/readme/sample.pdf).

This tool has mainly been tested on desktop Chrome on Windows 11.

## Features

### View PDFs

![<img src="readme/view_pdfs.png">](readme/view_pdfs.png)

### Fill PDF forms

![<img src="readme/fill_forms.png">](readme/fill_forms.png)

### Insert text

![<img src="readme/insert_text.png">](readme/insert_text.png)

### Insert images

![<img src="readme/insert_images.png">](readme/insert_images.png)

### Rotate PDFs

![<img src="readme/rotate_pdfs.png">](readme/rotate_pdfs.png)

## Future features

- Create your own signature within the tool
- Ability to insert symbols
- Ability to rearrange and insert pages
- Support for non-latin characters

## Technologies used

- Written in [TypeScript](https://www.typescriptlang.org/)
- Bundled with [Webpack](https://webpack.js.org/)
- PDFs rendered using [PDF.js](https://mozilla.github.io/pdf.js/)
- PDFs edited using [pdf-lib](https://github.com/Hopding/pdf-lib)
- Developed on [Visual Studio Code](https://code.visualstudio.com/)
- Code formatted with [Prettier](https://prettier.io/)

## Building instructions

1. Clone the repo
2. Run `npm install` to install all dependencies
3. Run `npm run build` to compile the source code into a JS bundle file
4. To use the tool from your browser, start a server from the root project directory, for example by running `python -m http.server` which makes the tool accessible on port 8000.
5. In your browser go to `localhost:8000`

## License

PrivatePDF is [MIT licensed](LICENSE).
