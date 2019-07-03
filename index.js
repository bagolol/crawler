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
    return link.match(pattern) && !link.match(other);
}

function buildOptions(path) {
    const options = {
        uri: `https://www.monzo.com${path}`,
        transform: body => cheerio.load(body)
    };
    return options;
}

function requestPages(paths) {
    const requests = paths
        .map(path => rp(buildOptions(path)));
    return Promise.all(requests);
}

function extractAndReturnLinks($) {
    return $('a')
        .toArray()
        .map(link => $(link).attr('href'))
        .filter(isInternalLink)
}

async function getInternalLinks(paths) {
    try {
        const cheerios = await requestPages(paths);
        return cheerios.map(($,i) => ({ path: paths[i], links: extractAndReturnLinks($)}));
    } catch (err) {
        console.log(err);
    }
}

async function buildSiteMap(siteMap=new Map(), paths=['/']) {
    const results = await getInternalLinks(paths);
    results.forEach(({ path, links }) => siteMap.set(path, links));
    for (const result of results) {
        const filtered = result.links.filter(link => !siteMap.has(link));
        await buildSiteMap(siteMap, filtered);
    }
    return siteMap;
}

function main () {
    const startTime = new Date();
    return buildSiteMap().then(res => {
        console.log(res);
        calculateDuration(startTime, new Date());
    });
}
main();
