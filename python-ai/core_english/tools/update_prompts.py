import codecs

path = r"d:\Kids\python-ai\main.py"
with codecs.open(path, "r", "utf-8") as f:
    content = f.read()

new_prompts = """        "crow": [
            "a solid black bird with wings and a beak",
            "a black crow flying or sitting on a branch",
            "a black and white line drawing of a crow or raven",
            "a children's coloring page of a crow bird",
            "a cartoon drawing of a black crow",
            "a watercolor painting of a crow in winter",
            "an illustration of a crow with cheese",
        ],
        "fox": [
            "a small wild dog-like animal with a bushy tail and pointy ears",
            "a red or brown fox standing or running",
            "a black and white line drawing of a fox with a bushy tail",
            "a children's coloring page of a fox",
            "a cartoon drawing of a red fox",
            "a watercolor painting of a fox in the snow",
            "an illustration of a fox looking up",
        ],"""

content = content.replace("""        "crow": [
            "a solid black bird with wings and a beak",
            "a black crow flying or sitting on a branch",
            "a black and white line drawing of a crow or raven",
            "a children's coloring page of a crow bird",
        ],
        "fox": [
            "a small wild dog-like animal with a bushy tail and pointy ears",
            "a red or brown fox standing or running",
            "a black and white line drawing of a fox with a bushy tail",
            "a children's coloring page of a fox",
        ],""", new_prompts)

with codecs.open(path, "w", "utf-8") as f:
    f.write(content)
print("done")
