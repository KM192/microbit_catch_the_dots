let direction = false
let curent_time = 0
let x_offset = 0
let score = 0
let quiet = false
let y = 0
let new_x = 0
let ocupiedDot = false
let list = 0
let background = false
let screen = 0
let total_tries = 0
let selectedDots: number[] = []
let in_game = false
let speed = 0
let no_of_dev: number[] = []
let new_y = 0
let y_offset = 0
let q = 0
let level = 0
let i = 0
// Running one screen of the game
function ExecuteGamescreen() {
    while (in_game) {
        if (!(quiet)) {
            music.playTone(131, music.beat(BeatFraction.Sixteenth))
        } else {
            // 1/16 equivalent
            basic.pause(music.beat(BeatFraction.Sixteenth))
        }
        // Remember if there is pattern in the background
        background = led.point(new_x, new_y)
        if (background) {
            score += 1
        }
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
                    basic.pause(music.beat(BeatFraction.Quarter))
                }
                selectedDots[new_y] = new_x
                total_tries += 1
                // ChooseXDirection() This is end of the current
                // screen. Let's check result
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
                    if (score > 29) {
                        CheckResult()
                        in_game = false
                    }
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
}
// Show sad face
function ShowSadFace() {
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
    } else {
        basic.pause(music.beat(BeatFraction.Double))
    }
}
// Check game result
function CheckResult() {
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
        PresentScoring()
    } else {
        ShowSadFace()
    }
    basic.pause(1000)
}
// Choose next move algorithms - movement depended on
// game screen
function MovetoXYCoordinates() {
    y_offset = 0
    // screens < 15 - only moves within a current raw
    //
    // Cursor can move on entire screen
    //
    if (screen < 15) {
        // Identify if raw has changed - then choose new place
        // for cursor
        if (new_y != total_tries) {
            new_y = total_tries
            ocupiedDot = false
            x_offset = 0
            while (!(ocupiedDot)) {
                new_x = Math.random(5)
                ocupiedDot = !(led.point(new_x, new_y))
            }
            direction = Math.randomBoolean()
        } else {
            // Move in one direction for entire screen from left
            // to right
            //
            // Move or from right to left or vice versa
            //
            // Move continuously from right to left to right etc.
            //
            // Select to move to right or left for every move in a
            // raw
            //
            // Select dot randomly in a raw
            //
            if (screen < 3) {
                x_offset = 1
            } else if (screen < 6) {
                if (direction) {
                    x_offset = 1
                } else {
                    x_offset = -1
                    if (new_x == 0) {
                        new_x = 5
                    }
                }
            } else if (screen < 9) {
                if (new_x == 0) {
                    x_offset = 1
                }
                if (new_x == 4) {
                    x_offset = -1
                }
            } else if (screen < 12) {
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
            } else if (screen < 15) {
                ocupiedDot = true
                while (ocupiedDot) {
                    new_x = Math.random(5)
                    x_offset = 0
                    if ((new_x + x_offset) % 5 != selectedDots[(new_y + y_offset) % 5]) {
                        ocupiedDot = false
                    }
                }
            }
        }
    } else if (screen < 18) {
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
        // Random jump on entire screen
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
// Choose speed of coursor movement
function SelectSpeed() {
    // Starting from screens 9,12,15 game is quite
    // challenging so we decrese speed much slower
    if (screen < 9) {
        speed = 300 - screen * 25
    } else if (screen < 12) {
        speed = 500 - screen * 20
    } else if (screen < 15) {
        speed = 500 - screen * 15
    } else {
        speed = 600 - screen * 10
    }
}
// Toggle all screen pixels
function ToggleScreen() {
    for (let z = 0; z <= 4; z++) {
        for (let a = 0; a <= 4; a++) {
            led.toggle(z, a)
        }
    }
}
function PrepareOnStart() {
    q = 0
    selectedDots = [-1, -1, -1, -1, -1]
    list = 0
    screen = 1
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
}
// Prepare game screen depending on screen
function PrepareChallenge() {
    basic.clearScreen()
    no_of_dev = []
    // Normal centralized line
    //
    // Normal not centralized line
    //
    // Line with some deviations
    //
    if (screen < 2) {
        for (let m = 0; m <= 4; m++) {
            led.plotBrightness(2, m, 10)
        }
    } else if (screen < 4) {
        y = Math.random(5)
        for (let n = 0; n <= 4; n++) {
            led.plotBrightness(y, n, 10)
        }
    } else if (screen < 6) {
        // Losujemy które wiersze maj¹ byæ losowane
        for (let o = 0; o <= screen - 3; o++) {
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
        for (let s = 0; s <= 4; s++) {
            led.plotBrightness(Math.random(5), s, 10)
        }
    }
    if (!(quiet)) {
        music.playTone(262, music.beat(BeatFraction.Breve))
    } else {
        basic.pause(music.beat(BeatFraction.Breve))
    }
}
// Present status screen after screen accomplish
function PresentScoring() {
    basic.clearScreen()
    if (0 < 30) {
        for (let r = 0; r <= level * 5 - 1; r++) {
            led.plotBrightness(r % 5, 4 - r / 5, 10)
        }
        basic.pause(250)
        for (let t = 0; t <= Math.min(24, 29 - score); t++) {
            led.plot(t % 5, 4 - t / 5)
            if (!(quiet)) {
                music.playTone(175 + t * 5, music.beat(BeatFraction.Sixteenth))
            } else {
                basic.pause(music.beat(BeatFraction.Sixteenth))
            }
            basic.pause(200 - 8 * t)
        }
        basic.pause(250)
        // Check if got top Scores
        if (score < 6) {
            for (let i0 = 0; i0 < 3; i0++) {
                ToggleScreen()
                basic.pause(250)
                if (!(quiet)) {
                    music.playTone(587, music.beat(BeatFraction.Whole))
                } else {
                    basic.pause(music.beat(BeatFraction.Whole))
                }
                ToggleScreen()
                basic.pause(500)
                screen += 1
            }
        }
        else {
            if (30 - score >= 5 * (level)) {
                if (!(quiet)) {
                    music.playTone(587, music.beat(BeatFraction.Whole))
                } else {
                    basic.pause(music.beat(BeatFraction.Whole))
                }
                screen += 1
                basic.pause(1000)
            }
            else {
                // 
                ShowSadFace()
                basic.pause(1000)
            }
            basic.pause(30)
        }
    }
    basic.pause(1000)
}
function Selectscreen() {
    // For Testing purpose - jump to selected screen at
    // start
    if (input.buttonIsPressed(Button.AB)) {
        while (input.buttonIsPressed(Button.AB)) {

        }
        basic.showNumber(screen)
        while (!(input.buttonIsPressed(Button.AB))) {
            if (input.buttonIsPressed(Button.B)) {
                screen += 1
                basic.showNumber(screen)
            }
            if (input.buttonIsPressed(Button.A)) {
                if (screen > 1) {
                    screen += -1
                    basic.showNumber(screen)
                }
            }
            basic.pause(100)
        }
    }
    basic.showString("L:" + screen)
}
// Prepare new game screen
function PrepareGame() {
    new_y = -1
    total_tries = 0
    in_game = true
    score = 0
    selectedDots = [-1, -1, -1, -1, -1]
    SelectSpeed()
}
level = 4
PrepareOnStart()
basic.forever(() => {
    Selectscreen()
    PrepareChallenge()
    PrepareGame()
    ExecuteGamescreen()
})
