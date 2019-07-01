const rp = require('request-promise');
const cheerio = require('cheerio');


function isInternalLink (link) {
    const pattern = new RegExp('^\/.');
    if(link) {
        return link.match(pattern);
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
function createMap (map, key, limit) {
    limit += 1;
    if(limit > 4) return map;
    const map = new Map();
    map.set(key, createMap(), key, limit);
    return map;
}
async function buildMap (siteMap=new Map(), path='/') {
    if (siteMap.has(path)) {
        const values = siteMap.get(path);
        siteMap.set(path, values);
        return;
    }
    const links = await getInternalLinks(path);
    siteMap.set(path, links);
    links.map(createMap);
    console.log(siteMap)
}

buildMap();
