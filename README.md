# Crawler

**Script to crawl www.monzo.com**


## Install
Node version 8

```bash
npm i
```


## Run locally
```bash
npm run crawl
```

## Expected result
The crawler prints a Map where the key is the `path` and the value is an Array of `links`
It takes ~27s to complete.

## Notes

I decided to not follow some links:

```javascript
cdn-cgi|blog|documents|static
```
This is mainly because I either don't think they're relevant or because they would largely increase the execution time (following /blog, for example). 

Although I believe that all code should be well tested, I didn't have enough time this week to go beyond the script implementation.


