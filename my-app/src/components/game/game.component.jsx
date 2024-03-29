import './game.css';

let dim //some old stuff, need to clean it

// wordmic reads saved words in local storage and randomize them on game plane
function wordmix() {
    if (localStorage.getItem('wordbook') == null) localStorage.setItem('wordbook', JSON.stringify("crt\nrat\nbar"));
    let read_words = JSON.parse(localStorage.getItem('wordbook')).split('\n');
    let output = []
    read_words.forEach(word => {
        let type = rand_num(3);
        let cross = rand_num(2) === 1 ? true : false;
        output.push([word, type, cross])
    });
    return output;
}

/*  if wordmix exists (there are some words saven in local storage) app will
    use it. If not it will continue with ots own set of words

    There are two parameters that describe that words on our game plane
    1 - number from 1 up to 3 - tells if words will be vertical/horizontal/diagonal
    2 - true/false - tells if word will cross with another word
*/
let wordbook = wordmix() || [["crt", 1, false], ["rat", 2, false], ["bar", 3, true]]


const alphabet = 'abcdefghijklmnoprstwyz'

let Array2D = (r, c) => [...Array(r)].map(x => Array(c).fill(0));

/*
    Grid_create is function just to crate 2D grid that is straight representation of game plane.
    It only helps programmer (me) to code this app, since working on 1D grid/array was
    a little bit too complex to work on since at the end it would be converted to 2D grid.

    Therefore in production version it supposed to be ommited. In theory it will provide
    better perfomrance.
*/
function Grid_create(dim) {
    let grid = Array2D(dim, dim)
    let grid_template_columns = "auto"
    let x = 0, y = 0

    for (let index = 0; index < dim * dim; index++) {
        if (index < dim - 1) grid_template_columns += " auto"
        grid[y][x] = '*'
        x++
        if (x >= dim) {
            y++; x = 0
        }
    }
    return [grid, grid_template_columns]
}

function rand_num(num) {
    return (Math.floor(Math.random() * num) + 1)
}

function check_cross(cross, crosses, freespace, letter, _cross, y, x) {
    if (letter === "*") {
        freespace.counter++
    } else {
        if (_cross === true) {
            if (cross.state === false) {
                cross.counter_b = freespace.counter
                cross.letter = letter
                cross.position = [y, x]
                cross.state = true
            } else {
                cross.state = false
                cross.counter_a = freespace.counter
                crosses.push(cross)
            }
        }
        freespace.counter = 0
    }
    return [cross, crosses, freespace]
}

/*
    fit_cross is invoked only for words that supposed to be crossing with other words
    on game plane.
*/
function fit_cross(cross, crosses, _cross, freespace, word, output_cross, type) {
    if (cross.state === true) {
        cross.state = false
        cross.counter_a = freespace.counter
        crosses.push(cross)
    }

    if (_cross === true) {
        for (let z = 0; z < crosses.length; z++) {
            for (let i = 0; i < word.length; i++) {
                if (word[i] === crosses[z].letter && i <= crosses[z].counter_b && word.length - 1 - i <= crosses[z].counter_a) {
                    switch (type) {
                        case 1:
                            output_cross.push([crosses[z].position[0], crosses[z].position[1] + (word.length - i - 1)])
                            break
                        case 2:
                            output_cross.push([crosses[z].position[0] + (word.length - i - 1), crosses[z].position[1]])
                            break
                        case 3:
                            output_cross.push([crosses[z].position[0] + (word.length - i - 1), crosses[z].position[1] + (word.length - i - 1)])
                            break
                        default:
                            break
                    }
                }
            }
        }
    }
    return [cross, crosses, output_cross]
}

/*
    check_freespace function checks if there is still some space for current word.
    If there is no space for specified words, it will be ommited.
*/
function check_freespace(word, grid, type, _cross) {
    let freespace = {
        needed: word.length,
        counter: 0
    }

    let cross = {
        state: false,
        counter_b: 0,
        letter: '',
        counter_a: 0,
        position: []
    }

    let crosses = []
    let output = []
    let output_cross = []

    switch (type) {
        case 1:
            for (let y = 0; y < dim; y++) {
                freespace.counter = 0
                for (let x = 0; x < dim; x++) {
                    [cross, crosses, freespace] = check_cross(cross, crosses, freespace, grid[y][x], _cross, y, x, type)
                    if (freespace.counter >= freespace.needed) output.push([y, x])
                }

                [cross, crosses, output_cross] = fit_cross(cross, crosses, _cross, freespace, word, output_cross, type)
            }
            if (output_cross.length > 0 && _cross === true) output = output_cross
            break

        case 2:
            for (let x = 0; x < dim; x++) {
                let y = 0
                while (y < dim) {
                    [cross, crosses, freespace] = check_cross(cross, crosses, freespace, grid[y][x], _cross, y, x, type)
                    if (freespace.counter >= freespace.needed) output.push([y, x])
                    y++
                }

                [cross, crosses, output_cross] = fit_cross(cross, crosses, _cross, freespace, word, output_cross, type)

                freespace.counter = 0
            }
            if (output_cross.length > 0 && _cross === true) output = output_cross
            break

        case 3:
            for (let y = 0; y < dim; y++) {
                for (let x = 0; x < dim; x++) {
                    let _x = x, _y = y
                    while (_x < dim && _y < dim) {
                        [cross, crosses, freespace] = check_cross(cross, crosses, freespace, grid[_y][_x], _cross, _y, _x, type)
                        if (freespace.counter >= freespace.needed) output.push([_y, _x])
                        _y++; _x++
                    }

                    [cross, crosses, output_cross] = fit_cross(cross, crosses, _cross, freespace, word, output_cross, type)

                    freespace.counter = 0
                }
            }
            if (output_cross.length > 0 && _cross === true) output = output_cross
            break
        default:
            break
    }
    return output
}

/*
    word_put as names states, put words on game board/grid.
    It bassicly uses all upon functions to find free spot,
    put word there and save its data.
*/
function word_put(grid) {
    let solutions = []
    wordbook.forEach(element => {
        let free_space = check_freespace(element[0], grid, element[1], element[2])
        let free_space_rand = free_space.length === 1 ? 0 : rand_num(free_space.length - 1)

        if (free_space.length === 0 || free_space[free_space_rand] === undefined) {
            return
        }

        let position = free_space[free_space_rand]

        let solution = []
        for (let index = element[0].length - 1; index >= 0; index--) {
            if (index === element[0].length - 1 || index === 0) solution.push([position[1] + position[0] * dim])
            let letter = (element[0])[index]
            grid[position[0]][position[1]] = letter

            switch (element[1]) {
                case 1:
                    position[1]--
                    break
                case 2:
                    position[0]--
                    break
                case 3:
                    position[0]--; position[1]--
                    break
                default:
                    break
            }
        }
        solutions.push({ first_cell: solution[1][0], last_cell: solution[0][0], word: element[0], status: false })
    });
    return [grid, solutions]
}

function Game(_dim) {
    dim = _dim
    let gc = Grid_create(dim)
    document.documentElement.style.setProperty('--grid', gc[1])

    let [grid, solutions] = word_put(gc[0])

    let output = []

    for (let y = 0; y < dim; y++) {
        for (let x = 0; x < dim; x++) {
            output.push([x + (y * dim), grid[y][x] === '*' ? alphabet[rand_num(alphabet.length - 1)] : grid[y][x], grid[y][x] === '*' ? true : false, y, x])
        }
    }
    return [output, solutions]
}

export default Game;