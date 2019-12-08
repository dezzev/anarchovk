import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="anarchovk",
    version="2.0.2",
    author="dezzev",
    description="Easy VK API module for Python",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/dezzev/anarchovk",
    packages=["anarchovk"],
    install_requires=['requests'],
    license="ANUS",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: Public Domain", # ANUS License
        "Operating System :: OS Independent",
    ],
    python_requires='>=3',
)
