# Minidex

A miniature PokeDex built with vanilla JavaScript and Sass, using [PokeAPI](https://pokeapi.co).

Search for 800+ Pokemon and get detailed information on each one!
(Go to the Minidex App, and use the search bar to find details on specific Pokemon. You can search with the Pokemon's name, or their ID).

## Installation

Clone this repository

```bash
mkdir minidex
cd minidex
git clone https://github.com/Goggwell/minidex.git
```
If using VSCode, launch site with the Live Server extension.
Otherwise, you can run the following:
```bash
# uses localhost:3000
yarn watch
```
Makes use of gulp and browser-sync. (gulp compiles the sass/scss into css, browser-sync provides a live browser feed, and the site refreshes on any change to the markup)

## To-Do
Better organize code in the future (perhaps by using React):
- Separate Minidex components (cleaner code + more efficient/less lag)
- Easier for adding more building blocks (in case I want to add new features)

Add Winbox.js for special popups (related to evolutions, moveset etc.)

Make mobile version of Minidex more user-friendly and appealing (right now everything is squished).

## Known Bugs
- Pokemon with more than 3 items in the evolution chain will have a faulty evolution row (i.e. Eevee, Bellossom).
- Some Pokemon's names appear differently in the PokeAPI (i.e. Urshifu's name is different in the API), so you will have to use the ID to find the Pokemon.
  - List includes: Deoxys, Urshifu (if you find anymore let me know!)


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[Apache-2.0](https://choosealicense.com/licenses/apache-2.0/)
