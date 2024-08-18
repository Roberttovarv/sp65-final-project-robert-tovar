from flask import jsonify, url_for


class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv


def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)


def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)
    links_html = "".join(["<li><a href='" + link + "'>" + link + "</a></li>" for link in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
            <h1>Rigo welcomes you to your API!!</h1>
            <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
            <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
            <p>Remember to specify a real endpoint path like: </p>
            <ul style="text-align: left;">
                """ + links_html + """
            </ul>
        </div>"""
# utils.py

# def get_pfp_url(index):
#     urls = {
#         0: "https://www.teleadhesivo.com/es/img/arc226-jpg/folder/products-listado-merchanthover/pegatinas-coches-motos-space-invaders-marciano-iii.jpg",
#         1: "https://static.wikia.nocookie.net/rdr/images/2/2f/Arthur_Morgan.jpg/revision/latest?cb=20190108180248&path-prefix=es",
#         2: "https://static.wikia.nocookie.net/unchartedpedia/images/1/1c/Nathan_Uncharted_4.png/revision/latest?cb=20200410030558&path-prefix=es",
#         3: "https://www.mundodeportivo.com/alfabeta/hero/2024/07/god-of-war.1720271381.2074.jpg?width=1200",
#         4: "https://hips.hearstapps.com/hmg-prod/images/the-last-of-us-2-esquire-2-1606823413.jpg",
#         5: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/05/hollow-knight-fan-art.jpg",
#         6: "https://deadline.com/wp-content/uploads/2022/05/FTr5XSZWUAE5fz3-e1653580675223.jpg?w=681&h=383&crop=1",
#         7: "https://sm.ign.com/t/ign_es/blogroll/t/the-first-/the-first-15-minutes-of-the-witcher-3-wild-hunt-ig_q4g3.1200.jpg",
#         8: "https://assetsio.gnwcdn.com/Zelda-Site_9uRMRw2.jpg?width=1200&height=1200&fit=bounds&quality=70&format=jpg&auto=webp",
#         9: "https://www.mundodeportivo.com/alfabeta/hero/2020/07/Cyberpunk-2077.jpg?width=1200"
#         10: "https://www.teleadhesivo.com/es/img/arc226-jpg/folder/products-listado-merchanthover/pegatinas-coches-motos-space-invaders-marciano-iii.jpg"
#     }
#     return urls.get(index, "https://example.com/default.jpg")  # URL por defecto si el índice no está en el diccionario
