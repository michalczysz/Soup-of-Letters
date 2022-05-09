import './game.css';

let dim
let wordbook = [["crt", 1, false], ["rat", 2, false], ["bar", 3, true]]
const alphabet = 'abcdefghijklmnoprstwyz'

let Array2D = (r, c) => [...Array(r)].map(x => Array(c).fill(0));

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
                    }

                }
            }
        }
    }

    return [cross, crosses, output_cross]
}


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
    }

    return output
}

function word_put(grid) {
    wordbook.forEach(element => {
        let free_space = check_freespace(element[0], grid, element[1], element[2])
        let free_space_rand = free_space.length === 1 ? 0 : rand_num(free_space.length - 1)

        if (free_space.length === 0 || free_space[free_space_rand] === undefined) {
            console.log("No free space")
            return
        }

        let position = free_space[free_space_rand]


        for (let index = element[0].length - 1; index >= 0; index--) {
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
            }
        }
    });
    return grid
}

function Game(_dim) {
    dim = _dim
    let gc = Grid_create(dim)
    document.documentElement.style.setProperty('--grid', gc[1])

    let grid = word_put(gc[0])

    let lol = []

    for (let y = 0; y < dim; y++) {
        for (let x = 0; x < dim; x++) {
            lol.push([x + (y * dim), grid[y][x] === '*' ? alphabet[rand_num(alphabet.length - 1)] : grid[y][x], grid[y][x] === '*' ? true : false, y, x])
        }
    }
    return lol
}

export default Game;