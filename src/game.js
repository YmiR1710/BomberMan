let game_lost = false;
let cursor = false;
let enemy_speed = 500;

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const generate_field = () => {
    for(let i = 0; i<13; i++){
        for(let j = 0; j<13; j++){
            let block = document.createElement("section");
            block.className = "floor";
            getRandomInt(4) === 0 ? block.className = "brick" : {};
            i === 0 || j===0 || i === 12 || j === 12 ? block.className = "wall" : {};
            i%2 === 0 && j%2 ===0 ? block.className = "wall" : {};
            document.getElementsByClassName("game-field")[0].appendChild(block);
        }
    }
    find_spawn().className = "player";
    for(let i = 0; i<3; i++){
        document.getElementsByClassName("floor")[getRandomInt(document.getElementsByClassName("floor").length)].className = "enemy";
    }
    document.getElementsByClassName("brick")[getRandomInt(document.getElementsByClassName("brick").length)].id = "door";
};

const get_game_field = () => {
    let game_field = [];
    let q = 0;
    for(let i = 0; i<13; i++){
        let row = [];
        for(let j = 0; j<13; j++){
            row.push(document.getElementsByClassName("game-field")[0].children[q]);
            q++;
        }
        game_field.push(row);
    }
    return game_field;
};

const getCoordinates = (block) => {
    let game_field = get_game_field();
    for(let i = 0; i<13; i++){
        for(let j = 0; j<13; j++){
            if(block === game_field[i][j]){
                return [i, j];
            }
        }
    }
};

const check_spawn_possibility = (block) => {
    let coordinates = getCoordinates(block);
    let game_field = get_game_field();
    let floor_count = 0;
    game_field[coordinates[0]-1][coordinates[1]].className === "floor" ? floor_count += 1 : {};
    game_field[coordinates[0]+1][coordinates[1]].className === "floor" ? floor_count += 1 : {};
    game_field[coordinates[0]][coordinates[1]-1].className === "floor" ? floor_count += 1 : {};
    game_field[coordinates[0]][coordinates[1]+1].className === "floor" ? floor_count += 1 : {};
    return floor_count >= 2;
};

const find_spawn = () => {
    let found = false;
    let random_floor;
    while (!found){
        random_floor = document.getElementsByClassName("floor")
            [getRandomInt(document.getElementsByClassName("floor").length)];
        check_spawn_possibility(random_floor) === true ? found = true : {};
    }
    return random_floor;
};

const moveUP = (block) => {
    let coordinates = getCoordinates(block);
    let game_field = get_game_field();
    if(game_field[coordinates[0]-1][coordinates[1]].className === "floor"){
        game_field[coordinates[0]-1][coordinates[1]].className = block.className;
        block.className = "floor";
    }
    game_field[coordinates[0]-1][coordinates[1]].className === "enemy" && block.className === "player" ? game_lost = true : {};
    game_field[coordinates[0]-1][coordinates[1]].className === "player" && block.className === "enemy" ? game_lost = true : {};
};

const moveDown = (block) => {
    let coordinates = getCoordinates(block);
    let game_field = get_game_field();
    if(game_field[coordinates[0]+1][coordinates[1]].className === "floor"){
        game_field[coordinates[0]+1][coordinates[1]].className = block.className;
        block.className = "floor";
    }
    game_field[coordinates[0]+1][coordinates[1]].className === "enemy" && block.className === "player" ? game_lost = true : {};
    game_field[coordinates[0]+1][coordinates[1]].className === "player" && block.className === "enemy" ? game_lost = true : {};
};

const moveRight = (block) => {
    let coordinates = getCoordinates(block);
    let game_field = get_game_field();
    if(game_field[coordinates[0]][coordinates[1]+1].className === "floor"){
        game_field[coordinates[0]][coordinates[1]+1].className = block.className;
        block.className = "floor";
    }
    game_field[coordinates[0]][coordinates[1]+1].className === "enemy" && block.className === "player" ? game_lost = true : {};
    game_field[coordinates[0]][coordinates[1]+1].className === "player" && block.className === "enemy" ? game_lost = true : {};
};

const moveLeft = (block) => {
    let coordinates = getCoordinates(block);
    let game_field = get_game_field();
    if(game_field[coordinates[0]][coordinates[1]-1].className === "floor"){
        game_field[coordinates[0]][coordinates[1]-1].className = block.className;
        block.className = "floor";
    }
    game_field[coordinates[0]][coordinates[1]-1].className === "enemy" && block.className === "player" ? game_lost = true : {};
    game_field[coordinates[0]][coordinates[1]-1].className === "player" && block.className === "enemy" ? game_lost = true : {};
};

const explode_bomb = (bomb, door) => {
    const block_destruction = (block) => {
        block.className === "brick"||block.className === "enemy" ? block.className = "floor" :
            block.className === "player" ? game_lost = true : {};
    };
    let game_field = get_game_field();
    let coordinates = getCoordinates(bomb);
    block_destruction(game_field[coordinates[0]][coordinates[1]]);
    block_destruction(game_field[coordinates[0]-1][coordinates[1]]);
    block_destruction(game_field[coordinates[0]+1][coordinates[1]]);
    block_destruction(game_field[coordinates[0]][coordinates[1]-1]);
    block_destruction(game_field[coordinates[0]][coordinates[1]+1]);
    game_field[coordinates[0]][coordinates[1]].removeAttribute("id");
    door ? game_field[coordinates[0]][coordinates[1]].id = "door" : {};
};

const check_win = () => document.getElementsByClassName("enemy").length === 0
    && document.getElementsByClassName("player")[0] === document.getElementById("door");

const random_move = () => {
    let enemies = document.getElementsByClassName("enemy");
    for (let i = 0; i<enemies.length; i++){
        let move = getRandomInt(4);
        move === 0 ? moveUP(enemies[i]) :
            move === 1 ? moveDown(enemies[i]) :
                move === 2 ? moveLeft(enemies[i]) :
                    moveRight(enemies[i]);
    }
};

const continuous_move = () => {
    random_move();
    enemy_speed = (100 - document.getElementsByClassName("speed-slider")[0].value) * 10;
    setTimeout(continuous_move, enemy_speed);
};

const win_actions = (start) => {
    if(check_win()) {
        alert("Your result: " + ((new Date().getTime() - start)/1000).toString() + " seconds");
        document.getElementsByClassName("next-level")[0].style.display = "block";
    }
    else {
        setTimeout(() => win_actions(start), 300)
    }
};

document.addEventListener("keydown", (event) => {
    if (!cursor) {
        event.which === 68 ? moveRight(document.getElementsByClassName("player")[0]) :
            event.which === 65 ? moveLeft(document.getElementsByClassName("player")[0]) :
                event.which === 87 ? moveUP(document.getElementsByClassName("player")[0]) :
                    event.which === 83 ? moveDown(document.getElementsByClassName("player")[0]) : {}
        }
    }
);

document.addEventListener("click", () => {
    if (!cursor) {
	let door = false;
        let coordinates = getCoordinates(document.getElementsByClassName("player")[0]);
	get_game_field()[coordinates[0]][coordinates[1]].id === "door" ? door = true : {};
        get_game_field()[coordinates[0]][coordinates[1]].id = "bomb";
        setTimeout(() => explode_bomb(get_game_field()[coordinates[0]][coordinates[1]], door), 2000)
    }
});

document.getElementsByClassName("next-level")[0].addEventListener("click",
    () => document.location.reload(true));

window.onload = () => {
    generate_field();
    const start = new Date().getTime();
    document.getElementsByClassName("speed-slider")[0].onmouseenter = () => cursor = true;
    document.getElementsByClassName("speed-slider")[0].onmouseleave = () => cursor = false;
    document.getElementsByClassName("next-level")[0].onmouseenter = () => cursor = true;
    document.getElementsByClassName("next-level")[0].onmouseleave = () => cursor = false;
    setInterval(()=>{game_lost ?  document.location.reload(true) : {}}, 100);
    setTimeout(() => win_actions(start), 300);
    setTimeout(continuous_move, enemy_speed);
};
