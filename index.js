const rp = require('request-promise');
const cheerio = require('cheerio');


function isInternalLink (link) {
    const pattern = new RegExp('^\/.');
    const cdnPattern = new RegExp('^\/cdn-cgi');
    if(link) {
        return link.match(pattern) && !link.match(cdnPattern);
    }
    return false;
}

function requestPage (path) {
    const options = {
        uri: `https://www.monzo.com${path}`,
        transform: body => cheerio.load(body),
    }
    return rp(options);
}

async function getInternalLinks (path) {
    let $;
    try {
        $ = await requestPage(path);
        const internalLinks = $('a')
            .toArray()
            .map(link => $(link).attr('href'))
            .filter(isInternalLink);
        return internalLinks;
    } catch (err) {
        console.log(err);
    }
}
async function buildMap (siteMap=new Map(), path='/') {
    if (siteMap.has(path)) return;
    const links = await getInternalLinks(path);
    siteMap.set(path, links);
    i += 1;
    links.forEach(link => buildMap(siteMap, link));
    console.log(siteMap);
}

buildMap();
