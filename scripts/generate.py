import xml.etree.ElementTree as ET
from datetime import datetime

import requests

API_URL = 'https://locations.phipluspi.com/wp-json/wp/v2'
FE_URL_PLACE = 'https://www.goove.at/detail'
FE_URL_BLOG = 'https://www.goove.at/blog'

BASE = 'https://www.goove.at'
BLOG = 'blog'
SEARCH = 'search'
HOME = 'home'

BLOG_TYPE = 'posts'

def main():
    url_set = ET.Element('urlset', {
        'xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9'
    })

    """
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>http://www.example.com/foo.html</loc>
        <lastmod>2018-06-04</lastmod>
      </url>
    </urlset>
    """

    append_url_from_wp_type('locations', url_set, FE_URL_PLACE)
    append_url_from_wp_type('posts', url_set, FE_URL_BLOG)

    for url in [BLOG, SEARCH, HOME]:
        url_set.append(element_from_wp_object(None, f'{BASE}/{url}'))

    with open('sitemap.xml', 'wb') as writer:
        writer.write(ET.tostring(url_set, encoding='utf8', method='xml'))
    # a = ET.Element('<?xml version="1.0" encoding="UTF-8"?>')


def get_wp_response(url):
    wp_response = requests.get(url)
    wp = wp_response.json()
    page_count = int(wp_response.headers.get('X-WP-TotalPages'))
    for page in range(2, page_count):
        wp += requests.get(url + '?page={}'.format(page)).json()
    return wp


def append_url_from_wp_type(type, url_set, route):
    places = get_wp_response(API_URL + '/' + type)
    print(f'writing for wp type: {type}')
    print(f'writing {len(places)} {type}')
    for index, place in enumerate(places):
        url_set.append(element_from_wp_object(place, route))


def element_from_wp_object(wp_object, route):
    url = ET.Element('url')
    loc = ET.SubElement(url, 'loc')
    lastmod = ET.SubElement(url, 'lastmod')

    if wp_object:
        try:
            loc.text = route + '/' + wp_object['slug']
        except:
            print(wp_object)
            raise ()
        lastmod.text = wp_object['modified'].split('T')[0]
    else:
        print(f'write: {route}')
        loc.text = route
        now = datetime.now()
        lastmod.text = now.strftime('%Y-%m-%d')

    return url

if __name__ == '__main__':
    main()
