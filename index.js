const rp = require('request-promise');
const cheerio = require('cheerio');

function isInternalLink (link) {
    console.log(link)
    const pattern = new RegExp('^\/.');
    return link.match(pattern);
}

const options = {
    uri: `https://www.monzo.com`,
    transform: body => cheerio.load(body),
}

function getBody (options) {
    return rp(options)
        .then($ => {
            const internalLinks = $('a')
                .toArray()
                .map(link => $(link).attr('href'))
                .filter(isInternalLink);
            console.log(internalLinks);

        })
        .catch(function (err) {
        });
}

getBody(options);
