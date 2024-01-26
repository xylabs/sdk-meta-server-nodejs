[![logo][]][logo-link]

# @xylabs/meta-server

[![main-build][]][main-build-link]
[![npm-badge][]][npm-link]
[![codacy-badge][]][codacy-link]
[![codeclimate-badge][]][codeclimate-link]
[![snyk-badge][]][snyk-link]
[![license-badge][]][license-link]

## Table of Contents

- [@xylabs/meta-server](#xylabsmeta-server)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Install](#install)
  - [Usage](#usage)
    - [Development](#development)
    - [Deployment](#deployment)
    - [Client](#client)
      - [Live Share](#live-share)
  - [Maintainers](#maintainers)
  - [License](#license)
  - [Credits](#credits)

## Description

Express server for properly rendering HTML metadata on React sites when scraped/shared. Since React requires JS to execute in order to manipulate the DOM, page content and HTML metadata often looks different when viewed in a browser vs when scraped/shared. Likewise, client routes created via the History pushState API are client-side only and will return Not Found when requested to the server. The MetaServer attempts to ensure that shared/scraped links render the HTML just as it would be rendered when viewed in the browser. This is accomplished by intercepting route requests and rendering the HTML in headless Chrome then returning the resultant HTML instead of the typical React-hosting flow of just redirecting to the root of the site.

## Install

The package should be installed under `dependencies` (not under `devDependencies`) as the server will be used for hosting & running the React App.

Using npm:

```sh
npm i --save @xylabs/meta-server
```

Using yarn:

```sh
yarn add @xylabs/meta-server
```

## Usage

### Development

The build output can be hosted/served via the MetaServer by running the included script. Configuration is available via

```
npm run start-meta
```

```
yarn start-meta
```

You can configure the root directory from which your app is served via the ENV VAR `SERVE_DIRECTORY` which defaults to `'./build'` if not supplied

### Deployment

To allow for containerized deployment the included script `docker-build` is provided which creates a production build of the app and outputs a container with the Meta Server which proxies the built app.

### Client

- Add `xy.config.json` to the root of your build output (see sample below)

Sample `xy.config.json`

```
{
  liveShare: {
    exclude: ['/exclude/*'],
    include: ['/live-share-route/*'],
  },
}

```

#### Live Share

For LiveShare routes, pages are required to provide a meta tag with the property `xyo:og:image` with a content attribute that contains the URL of the preferred route for rendering the preview. The URL specified for the preview must be valid and lead to a route where an element with the ID 'preview-container' is present. The MetaServer wil:

- render the page rendered
- read the `xyo:og:image` attribute
- navigate to the URL provided in the `xyo:og:image` attribue
- wait for the DOM to contain an element with the ID `preview-container`
- snapshot the page and cache the image
- update the document head to point to the `og:image` (and associated properties like height/width) to point to the cached snapshot

## Maintainers

- [Arie Trouw](https://github.com/arietrouw) (<https://arietrouw.com>)
- [Joel Carter](https://github.com/joelbcarter) (<https://joelbcarter.com>)
- [Matt Jones](https://github.com/jonesmac)

## License

See the [LICENSE](https://github.com/xylabs/sdk-meta-server-nodejs/blob/main/LICENSE)
file for license details

## Credits

[Made with 🔥 and ❄️ by XY Labs](https://xylabs.com)

[logo]: https://cdn.xy.company/img/brand/XYPersistentCompany_Logo_Icon_Colored.svg
[logo-link]: https://xylabs.com
[main-build]: https://github.com/xylabs/sdk-meta-server-nodejs/actions/workflows/build-main.yml/badge.svg
[main-build-link]: https://github.com/xylabs/sdk-meta-server-nodejs/actions/workflows/build-main.yml
[npm-badge]: https://img.shields.io/npm/v/@xylabs/meta-server.svg
[npm-link]: https://www.npmjs.com/package/@xylabs/meta-server
[codacy-badge]: https://app.codacy.com/project/badge/Grade/7ca145c4ea064ced8d10e1c5841b36b3
[codacy-link]: https://www.codacy.com/gh/xylabs/sdk-meta-server-nodejs/dashboard?utm_source=github.com&utm_medium=referral&utm_content=xylabs/sdk-meta-server-nodejs&utm_campaign=Badge_Grade
[codeclimate-badge]: https://api.codeclimate.com/v1/badges/c8c1d92fc4d69d19adfd/maintainability
[codeclimate-link]: https://codeclimate.com/github/xylabs/sdk-meta-server-nodejs/maintainability
[snyk-badge]: https://snyk.io/test/github/xylabs/sdk-meta-server-nodejs/badge.svg?targetFile=package.json
[snyk-link]: https://snyk.io/test/github/xylabs/sdk-meta-server-nodejs?targetFile=package.json
[license-badge]: https://img.shields.io/github/license/XYOracleNetwork/sdk-meta-server-nodejs
[license-link]: https://github.com/xylabs/sdk-meta-server-nodejs/blob/main/LICENSE
