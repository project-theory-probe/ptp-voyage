# ptp.voyage

PTP's Website.

## Installation

Clone repository.

```
  $ git clone git@github.com:project-theory-probe/ptp-voyage.git
  $ cd ptp-voyage
```

## Workflow

Host `public` directory to preview.

Provide some way to set up a local http server.

ex. Node.js and http-server

```
  $ npm i http-server
```

Launch a local server.

```
  $ npx http-server public
```

## Deployment

The main branch is hosted by GitHub Pages. Pushing code to main to trigger deploying action (defined in `.github/workflows/static.yaml`).