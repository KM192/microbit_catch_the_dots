let curent_time = 0
let background = false
let ocupiedDot = false
let x_offset = 0
let quiet = false
let y = 0
let in_game = false
let new_x = 0
let level = 0
let total_tries = 0
let direction = false
let speed = 0
let list = 0
let no_of_dev: number[] = []
let new_y = 0
let y_offset = 0
let selectedDots: number[] = []
let i = 0
// Prepare game screen depending on level
function PrepareChallenge()  {
    basic.clearScreen()
    no_of_dev = []
    // Normal centralized line
    //
    // Normal not centralized line
    //
    // Line with some deviations
    //
    if (level < 2) {
        for (let m = 0; m <= 4; m++) {
            led.plotBrightness(2, m, 10)
        }
    } else if (level < 4) {
        y = Math.random(5)
        for (let n = 0; n <= 4; n++) {
            led.plotBrightness(y, n, 10)
        }
    } else if (level < 6) {
        // Losujemy kt�re wiersze maj� by� losowane
        for (let o = 0; o <= level - 3; o++) {
            no_of_dev.push(Math.random(5))
        }
        for (let p = 0; p <= 4; p++) {
            if (no_of_dev.indexOf(p) != -1) {
                led.plotBrightness(Math.random(3) + 1, p, 10)
            } else {
                led.plotBrightness(2, p, 10)
            }
        }
    } else {
        // Generate random screens
        for (let q = 0; q <= 4; q++) {
            led.plotBrightness(Math.random(5), q, 10)
        }
    }
}
// Check game result
function CheckResult()  {
    i = 0
    // Counting pixels which are on
    for (let b = 0; b <= 4; b++) {
        for (let c = 0; c <= 4; c++) {
            if (led.point(b, c)) {
                i += 1
            }
        }
    }
    // Mission complete
    if (i == 5) {
        for (let i0 = 0; i0 < 3; i0++) {
            ToggleScreen()
            if (!(quiet)) {
                music.playTone(587, music.beat(BeatFraction.Whole))
            } else {
                basic.pause(200)
            }
            ToggleScreen()
            basic.pause(200)
        }
        level += 1
    } else {
        led.setBrightness(255)
        basic.clearScreen()
        led.plot(1, 1)
        led.plot(3, 1)
        led.plot(1, 3)
        led.plot(2, 3)
        led.plot(3, 3)
        led.plot(0, 4)
        led.plot(4, 4)
        if (!(quiet)) {
            music.playTone(147, music.beat(BeatFraction.Double))
        }
        basic.pause(1000)
    }
}
function SelectLevel()  {
    // For Testing purpose - jump to selected level at
    // start
    if (input.buttonIsPressed(Button.AB)) {
        while (input.buttonIsPressed(Button.AB)) {
        	
        }
        basic.showNumber(level)
        while (!(input.buttonIsPressed(Button.AB))) {
            if (input.buttonIsPressed(Button.B)) {
                level += 1
                basic.showNumber(level)
            }
            if (input.buttonIsPressed(Button.A)) {
                if (level > 1) {
                    level += -1
                    basic.showNumber(level)
                }
            }
            basic.pause(100)
        }
    }
    basic.showString("L:" + level)
    PrepareChallenge()
    if (!(quiet)) {
        music.playTone(262, music.beat(BeatFraction.Breve))
    }
}
function SelectSpeed()  {
    // Starting from level 12 game is quite challenging so
    // we decrese speed much slower
    if (level < 9) {
        speed = 300 - level * 25
    } else if (level < 12) {
        speed = 400 - level * 20
    } else if (level < 15) {
        speed = 400 - level * 15
    } else {
        speed = 500 - level * 10
    }
}
// Chose x movement direction
function ChooseXDirection()  {
    if (level < 3) {
        direction = true
    } else {
        direction = Math.randomBoolean()
    }
    if (level < 15) {
        new_x = Math.random(5)
    }
}
function PrepareGame()  {
    new_y = 0
    total_tries = 0
    in_game = true
    selectedDots = [-1, -1, -1, -1, -1]
    SelectSpeed()
    // Chose x direction movement strategy on entire
    // screen level (relevant for 1-5 levels)
    ChooseXDirection()
}
// Toggle all screen pixels
function ToggleScreen()  {
    for (let z = 0; z <= 4; z++) {
        for (let a = 0; a <= 4; a++) {
            led.toggle(z, a)
        }
    }
}
// Chose x movment direction
function MovetoXYCoordinates()  {
    y_offset = 0
    if (level < 15) {
        new_y = total_tries
    }
    if (level < 3) {
        x_offset = 1
    } else if (level < 6) {
        if (direction) {
            x_offset = 1
        } else {
            x_offset = -1
            if (new_x == 0) {
                new_x = 5
            }
        }
    } else if (level < 9) {
        if (new_x == 0) {
            x_offset = 1
        }
        if (new_x == 4) {
            x_offset = -1
        }
    } else if (level < 12) {
        if (new_x == 0) {
            x_offset = 1
        } else if (new_x == 4) {
            x_offset = -1
        } else {
            if (Math.randomBoolean()) {
                x_offset = 1
            } else {
                x_offset = -1
            }
        }
    } else if (level < 15) {
        ocupiedDot = true
        while (ocupiedDot) {
            new_x = Math.random(5)
            x_offset = 0
            if ((new_x + x_offset) % 5 != selectedDots[(new_y + y_offset) % 5]) {
                ocupiedDot = false
            }
        }
    } else if (level < 18) {
        ocupiedDot = true
        while (ocupiedDot) {
            if (Math.randomBoolean()) {
                y_offset = 0
                if (new_x == 0) {
                    x_offset = 1
                } else if (new_x == 4) {
                    x_offset = -1
                } else {
                    if (Math.randomBoolean()) {
                        x_offset = 1
                    } else {
                        x_offset = -1
                    }
                }
            } else {
                x_offset = 0
                if (new_y == 0) {
                    y_offset = 1
                } else if (new_y == 4) {
                    y_offset = -1
                } else {
                    if (Math.randomBoolean()) {
                        y_offset = 1
                    } else {
                        y_offset = -1
                    }
                }
            }
            if ((new_x + x_offset) % 5 != selectedDots[(new_y + y_offset) % 5]) {
                ocupiedDot = false
            }
        }
    } else {
        ocupiedDot = true
        while (ocupiedDot) {
            new_x = Math.random(5)
            new_y = Math.random(5)
            x_offset = 0
            if ((new_x + x_offset) % 5 != selectedDots[(new_y + y_offset) % 5]) {
                ocupiedDot = false
            }
        }
    }
    new_x = (new_x + x_offset) % 5
    new_y = (new_y + y_offset) % 5
}
selectedDots = [-1, -1, -1, -1, -1]
list = 0
level = 1
quiet = false
// For skipping the menu
if (!(input.buttonIsPressed(Button.A))) {
    basic.showArrow(ArrowNames.West)
    while (!(input.buttonIsPressed(Button.AB) || (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)))) {
    	
    }
    if (input.buttonIsPressed(Button.B)) {
        quiet = true
    }
    basic.clearScreen()
}
basic.forever(() => {
    SelectLevel()
    PrepareGame()
    while (in_game) {
        if (!(quiet)) {
            music.playTone(131, music.beat(BeatFraction.Sixteenth))
        } else {
            // 1/16 equivalent
            basic.pause(100)
        }
        // Remember if there is pattern in the background
        background = led.point(new_x, new_y)
        led.plotBrightness(new_x, new_y, 255)
        curent_time = input.runningTime()
        // Wait until time passed or aby key is pressed
        while (input.runningTime() - curent_time < speed && !(input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B))) {
        	
        }
        // A+B - Restart this screen
        if (input.buttonIsPressed(Button.AB)) {
            in_game = false
        } else {
            if (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
                if (!(quiet)) {
                    music.playTone(165, music.beat(BeatFraction.Quarter))
                } else {
                    basic.pause(400)
                }
                selectedDots[new_y] = new_x
                total_tries += 1
                ChooseXDirection()
                // This is end of the current screen. Let's check
                // result
                if (total_tries == 5) {
                    CheckResult()
                    in_game = false
                } else if (!(background)) {
                    CheckResult()
                    in_game = false
                }
            } else {
                // Background reconstruction
                if (background) {
                    led.plotBrightness(new_x, new_y, 10)
                } else {
                    led.unplot(new_x, new_y)
                }
            }
            // Wait until keys are released
            while (input.buttonIsPressed(Button.A) || input.buttonIsPressed(Button.B)) {
            	
            }
        }
        MovetoXYCoordinates()
    }
})