var status = 'start';
var placement = [];

var gameSocket = new WebSocket(
    'ws://' + window.location.host +
    '/ws/game/' + gameName + '/' + player + '/');

gameSocket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    var message = data['message'];
    console.log(message);
};

gameSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};


var playerFleet;


// Object Constructors
function Fleet(name) {
    this.name = name;
    this.shipDetails = [{"name": "carrier", "length": 5},
        {"name": "battleship", "length": 4},
        {"name": "cruiser", "length": 3},
        {"name": "destroyer", "length": 3},
        {"name": "frigate", "length": 2}];
    this.numOfShips = this.shipDetails.length;
    this.ships = [];
    this.currentShipSize = 0;
    this.currentShip = 0;
    this.initShips = function () {
        for (var i = 0; i < this.numOfShips; i++) {
            this.ships[i] = new Ship(this.shipDetails[i].name);
            this.ships[i].length = this.shipDetails[i].length;
        }
    };
}

function Ship(name) {
    this.name = name;
    this.length = 0;
    this.hitPoints = [];
    this.populateHorzHits = function (start) {
        for (var i = 0; i < this.length; i++, start++) {
            this.hitPoints[i] = start;
        }
    };
    this.populateVertHits = function (start) {
        for (var i = 0; i < this.length; i++, start += 10) {
            this.hitPoints[i] = start;
        }
    };
    this.checkLocation = function (loc) {
        for (var i = 0; i < this.length; i++) {
            if (this.hitPoints[i] == loc) return true;
        }
        return false;
    };
}

var output = {
    "welcome": " > Welcome to BattleShip.  Use the menu above to get started.",
    "not": " > This option is not currently available.",
    "player1": " > Would you like to place your own ships or have the computer randomly do it for you?",
    "self": " > Use the mouse and the Horizontal and Vertial buttons to place your ships on the bottom grid.",
    "overlap": " > You can not overlap ships.  Please try again.",
    "start": " > Use the mouse to fire on the top grid.  Good Luck!",
    placed: function (name) {
        return " > Your " + name + " been placed.";
    }
};

var topBoard = {
    allHits: [],
    highlight: function (square) {
        $(square).addClass("target").off("mouseleave").on("mouseleave", function () {
            $(this).removeClass("target");
        });

        $(square).off("click").on("click", function () {
            if (!($(this).hasClass("used"))) {
                $(this).removeClass("target").addClass("used");
            }
        });
    },
}

//  Create the games grids and layout
$(document).ready(function () {
    for (var i = 1; i <= 100; i++) {
        // The number and letter designators
        if (i < 11) {
            $(".top").prepend("<span class='aTops'>" + Math.abs(i - 11) + "</span>");
            $(".bottom").prepend("<span class='aTops'>" + Math.abs(i - 11) + "</span>");
        }
        $(".grid").append("<li class='points offset2" + i + "'><span class='hole'></span></li>");

        if (i == 11) {
            $(".top").prepend("<span class='aTops hidezero'>" + Math.abs(i - 11) + "</span>");
            $(".bottom").prepend("<span class='aTops hidezero'>" + Math.abs(i - 11) + "</span>");
        }
        if (i > 90) {
            $(".top").append("<span class='aLeft'>" + (i - 90) + "</span>");
            $(".bottom").append("<span class='aLeft'>" + (i - 90) + "</span>");
        }
    }
    $(".text").text(output.welcome);
})

// Start the game setup
$(document).ready(function () {
    $(".start").on("click", function () {
        $(".text").text(output.self);
        gameSetup(this);

        gameSocket.send(JSON.stringify({
            'message': 'start'
        }));
    });
});


function gameSetup() {
    $(".start").remove();
    var horizontal_butoon = $('<div class=\'buttons horz\'>Horizontal</div>');
    var vertical_button = $('<div class=\'buttons vert\'>Vertical</div>');
    horizontal_butoon.appendTo($("#buttonPanel"));
    vertical_button.appendTo($("#buttonPanel"));

    playerFleet = new Fleet("Player 1");
    playerFleet.initShips();
    placeShip(playerFleet.ships[playerFleet.currentShip], playerFleet);
}

function placeShip(ship, fleet) {
    // check orientation of ship and highlight accordingly
    var orientation = "horz";
    $(".vert").off("click").on("click", function () {
        orientation = "vert";
    });
    $(".horz").off("click").on("click", function () {
        orientation = "horz";
    });
    // when the user enters the grid have the ships lenght highlighted with the
    // ships length.
    $(".bottom").find(".points").off("mouseenter").on("mouseenter", function () {
        console.log('ship ' + $(this).attr('class'));
        var num = $(this).attr('class').slice(15);
        if (orientation == "horz") {
            displayShipHorz(parseInt(num), ship, this, fleet);
        }
        else {
            displayShipVert(parseInt(num), ship, this, fleet);
        }
    });
}


function displayShipHorz(location, ship, point, fleet) {
    var endPoint = location + ship.length - 2;
    if (!(endPoint % 10 >= 0 && endPoint % 10 < ship.length - 1)) {
        for (var i = location; i < (location + ship.length); i++) {
            $(".bottom ." + i).addClass("highlight");
        }
        $(point).off("click").on("click", function () {
            setShip(location, ship, "horz", fleet, "self");
        });
    }
    $(point).off("mouseleave").on("mouseleave", function () {
        removeShipHorz(location, ship.length);
    });
}

function displayShipVert(location, ship, point, fleet) {
    var endPoint = (ship.length * 10) - 10;
    var inc = 0;
    if (location + endPoint <= 100) {
        for (var i = location; i < (location + ship.length); i++) {
            $(".bottom ." + (location + inc)).addClass("highlight");
            inc = inc + 10;
        }
        $(point).off("click").on("click", function () {
            setShip(location, ship, "vert", fleet, "self");
        });
    }
    $(point).off("mouseleave").on("mouseleave", function () {
        removeShipVert(location, ship.length);
    });
}

function removeShipHorz(location, length) {
    for (var i = location; i < location + length; i++) {
        $(".bottom ." + i).removeClass("highlight");
    }
}

function removeShipVert(location, length) {
    var inc = 0;
    for (var i = location; i < location + length; i++) {
        $(".bottom ." + (location + inc)).removeClass("highlight");
        inc = inc + 10;
    }
}

function setShip(location, ship, orientation, genericFleet, type) {
    // var placements = []
    // var x_placement = location % 10;
    // var y_placement = Math.ceil(location / 10);
    // placements.push({'x': x_placement, 'y': y_placement});
    // if (orientation == 'horz') {
    //     for (var i = 1; i < ship.length; i++) {
    //         placements.push({'x': x_placement + i, 'y': y_placement})
    //     }
    // } else {
    //     for (var i = 1; i < ship.length; i++) {
    //         placements.push({'x': x_placement, 'y': y_placement + i})
    //     }
    // }
    // console.log('placements ');
    // console.log(location, ship, orientation);
    // console.log(placements);


    if (!(checkOverlap(location, ship.length, orientation, genericFleet))) {
        if (orientation == "horz") {
            genericFleet.ships[genericFleet.currentShip].populateHorzHits(location);
            $(".text").text(output.placed(genericFleet.ships[genericFleet.currentShip].name + " has"));
            for (var i = location; i < (location + ship.length); i++) {
                $(".bottom ." + i).addClass(genericFleet.ships[genericFleet.currentShip].name);
                $(".bottom ." + i).children().removeClass("hole");
            }
            if (++genericFleet.currentShip == genericFleet.numOfShips) {
                $(".text").text(output.placed("ships have"));
                $(".bottom").find(".points").off("mouseenter");
                setTimeout(startGame, 500);
            } else {
                placeShip(genericFleet.ships[genericFleet.currentShip], genericFleet);
            }

        } else {
            var inc = 0;
            genericFleet.ships[genericFleet.currentShip].populateVertHits(location);
            $(".text").text(output.placed(genericFleet.ships[genericFleet.currentShip].name + " has"));
            for (var i = location; i < (location + ship.length); i++) {
                $(".bottom ." + (location + inc)).addClass(genericFleet.ships[genericFleet.currentShip].name);
                $(".bottom ." + (location + inc)).children().removeClass("hole");
                inc = inc + 10;
            }
            if (++genericFleet.currentShip == genericFleet.numOfShips) {
                $(".text").text(output.placed("ships have"));
                $(".bottom").find(".points").off("mouseenter");
            }
        }
    }
}

function checkOverlap(location, length, orientation, genFleet) {
    var loc = location;
    if (orientation == "horz") {
        var end = location + length;
        for (; location < end; location++) {
            for (var i = 0; i < genFleet.currentShip; i++) {
                if (genFleet.ships[i].checkLocation(location)) {
                    return true;
                }
            }
        }
    } else {
        var end = location + (10 * length);
        for (; location < end; location += 10) {
            for (var i = 0; i < genFleet.currentShip; i++) {
                if (genFleet.ships[i].checkLocation(location)) {
                    return true;
                }
            }
        }
    }
    return false;
}


function startGame() {
    $(".layout").fadeOut("fast", function () {
        $(".console").css({"margin-top": "31px"});
    });
    $(".text").text(output.start);
    console.log(playerFleet);
    highlightBoard();
}

function highlightBoard() {
    if (playerFleet.ships.length == 0) {
        $(".top").find(".points").off("mouseenter").off("mouseleave").off("click");
    } else {
        $(".top").find(".points").off("mouseenter mouseover").on("mouseenter mouseover", function () {
            // only allow target highlight on none attempts
            if (!($(this).hasClass("used"))) topBoard.highlight(this);
        });
    }
}


