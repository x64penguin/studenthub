from markupsafe import Markup

def checkbox(name, id_):
    return Markup(f'<div class="check-group">\n\t<input type="checkbox" id="{id_}" name="{id_}">\n\t<label for="{id_}">{name}</label></div>')