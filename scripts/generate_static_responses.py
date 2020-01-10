import json
from pprint import pprint

from src.app.goove.scripts.generate import get_wp_response, API_URL, BLOG_TYPE, PAGE_TYPE


def main():
    pages = get_wp_response(API_URL + '/' + PAGE_TYPE)
    posts = get_wp_response(API_URL + '/' + BLOG_TYPE)
    pprint(len(posts))
    pprint(len(pages))

    write(pages, 'pages')
    write(posts, 'posts')


def write(data, name):
    # write full
    with open(f'../src/assets/cached/{name}.json', 'w') as file:
        file.write(json.dumps(data))
    for obj in data:
        with open(f'../src/assets/cached/{name}/{obj["slug"]}.json', 'w') as file:
            file.write(json.dumps(obj))


if __name__ == '__main__':
    main()
