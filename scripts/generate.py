import requests
import xml.etree.ElementTree as ET

API_URL = 'https://locations.phipluspi.com/wp-json/wp/v2/locations'
FE_URL = 'https://www.goove.at/detail'



def main():
    places_response = requests.get(API_URL)
    places = places_response.json()
    page_count = int(places_response.headers.get('X-WP-TotalPages'))

    for page in range(2, page_count):
        places += requests.get(API_URL + '?page={}'.format(page)).json()

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

    for index, place in enumerate(places):
        url = ET.Element('url')
        loc = ET.SubElement(url, 'loc')
        loc.text = FE_URL + '/' + place['slug']
        # ET.SubElement(url_set, url)

        lastmod = ET.SubElement(url, 'lastmod')
        lastmod.text = place['modified'].split('T')[0]

        url_set.append(url)

    with open('sitemap.xml', 'wb') as writer:
        writer.write(ET.tostring(url_set, encoding='utf8', method='xml'))
    # a = ET.Element('<?xml version="1.0" encoding="UTF-8"?>')


if __name__ == '__main__':
    main()
