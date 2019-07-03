const rp = require('request-promise');
const cheerio = require('cheerio');

function calculateDuration(startTime, endTime) {
    const timeDiff = endTime - startTime;
    const seconds = Math.round( timeDiff / 1000);
    console.log(seconds + " seconds");
}

function isInternalLink (link) {
    const pattern = new RegExp('^\/.');
    const other = new RegExp('^\/(cdn-cgi|help|legal|blog|documents|static)')
    if(link) {
        return link.match(pattern) && !link.match(other);
    }
    return false;
}

function requestPage (path) {
    const options = {
        uri: `https://www.monzo.com${path}`,
        transform: body => cheerio.load(body),
    };
    return rp(options);
}

async function getInternalLinks (path) {
    let $;
    try {
        $ = await requestPage(path);
        return $('a')
          .toArray()
          .map(link => $(link).attr('href'))
          .filter(isInternalLink);
    } catch (err) {
        console.log(err);
    }
}

async function buildMap (siteMap= new Map(), path='/') {
    const links = await getInternalLinks(path);
    siteMap.set(path, links);
    for (const link of links) {
        if (!siteMap.has(link)) {
            await buildMap(siteMap, link);
        }
    }
    return siteMap;
}

function main () {
    const startTime = new Date();
    return buildMap().then(res => {
        console.log(res);
        calculateDuration(startTime, new Date());
    });
}

main();
