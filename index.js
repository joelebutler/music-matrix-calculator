CURRENT_NOTES = [];
CURRENT_DISPLAY_TYPE = "sharps";
CURRENT_BASIS = "C";

function noteDisplay(type) {
    // Change how the notes are displayed
    CURRENT_DISPLAY_TYPE = type;
    if (type == "sharps") {
        for (i = 0; i <= 11; i++) {
            document.getElementById("note-button-" + i).innerText = sharps_dict[i];
        }
        let elements = document.getElementsByClassName("display-button");
        for (let i = 0; i < elements.length; i++) {
            elements[i].disabled = false;
        }
        document.getElementById("sharps").disabled = true;
    }
    if (type == "flats") {
        for (i = 0; i <= 11; i++) {
            document.getElementById("note-button-" + i).innerText = flats_dict[i];
        }
        let elements = document.getElementsByClassName("display-button");
        for (let i = 0; i < elements.length; i++) {
            elements[i].disabled = false;
        }
        document.getElementById("flats").disabled = true;
    }
    if (type == "classes") {
        for (i = 0; i <= 11; i++) {
            document.getElementById("note-button-" + i).innerText = i;
        }
        let elements = document.getElementsByClassName("display-button");
        for (let i = 0; i < elements.length; i++) {
            elements[i].disabled = false;
        }
        document.getElementById("pitch-classes").disabled = true;
    }
    updateTable();
}
function addNote(note_num) {
    // Add note to current notes
    document.getElementById("note-button-" + note_num.toString()).disabled = true;
    document.getElementById("undo-button").disabled = false;
    CURRENT_NOTES.push(note_num);
    updateTable();
}
function undo() {
    // Undo button press
    note = CURRENT_NOTES.pop();
    document.getElementById("note-button-" + note.toString()).disabled = false;
    if (CURRENT_NOTES.length == 0) {
        document.getElementById("undo-button").disabled = true;
    }
    updateTable();
}
function changeBasis(basis) {
    // Change basis and disable active basis button
    CURRENT_BASIS = basis;
    let elements = document.getElementsByClassName("basis-button");
    for (let i = 0; i < elements.length; i++) {
        elements[i].disabled = false;
    }
    document.getElementById(basis.toLowerCase() + "-basis").disabled = true;
    updateTable();
}

function updateTable() {
    // Update the table to display current info

    // CLEAR TABLE
    let rows = document.getElementsByClassName("row");

    for (let x = 0; x < rows.length; x++) {
        let cells = rows[x].children;
        for (let y = 0; y < cells.length; y++) {
            cells[y].innerHTML = "&nbsp;";
        }
    }

    // Set header and footer to match
    let header_data = get_row(0, true);
    let header_children = document.getElementById("header").children;
    let footer_children = document.getElementById("footer").children;
    for(let i = 0; i < header_data.length; i++) {
        header_children[i+1].innerHTML = 'I<sub>' + header_data[i] + '</sub>';
        footer_children[i+1].innerHTML = 'RI<sub>' + header_data[i] + '</sub>';
    }

    var prev_row_p = 0;
    for(let i = 0; i < CURRENT_NOTES.length; i++) {
        // Each row
        let row_children = document.getElementById("row-" + i).children;

        // Find what the difference is
        let row_difference = 0;
        if (i > 0) { row_difference = (header_data[i] - header_data[i-1]); }
        console.log(header_data)
        console.log(prev_row_p)
        console.log(row_difference)

        // header[1] - header[0] = 6
        // so we want row[1]'s p to = row[0] p (0) - 6

        // header[2] - header[1] = -3
        // so we want row[2]'s p to = row[1]'s p +3

        // so we want row[11]'s p to = row[10] p + 9

        let row_p = prev_row_p - row_difference
        let row_data = get_row(row_p);
        let row_data_c = get_row(row_p, true);
        prev_row_p = row_data_c[0];

        if (row_p < 0) {
            row_p += 12;
        }
        else if (row_p >= 12) {
            row_p -= 12;
        }


        // Set P and R values
        row_children[0].innerHTML = 'P<sub>' + row_p + '</sub>';
        row_children[row_children.length - 1].innerHTML = 'R<sub>' + row_p + '</sub>';

        // Set each cell
        for(let j = 0; j < row_data.length; j++) {
            if (CURRENT_DISPLAY_TYPE == "sharps") {
                row_children[j + 1].innerText = sharps_dict[row_data[j]];
            }
            if (CURRENT_DISPLAY_TYPE == "flats") {
                row_children[j + 1].innerText = flats_dict[row_data[j]];
            }

            if (CURRENT_DISPLAY_TYPE == "classes") {
                row_children[j + 1].innerText = row_data[j];
            }
        }
    }
}

function get_row(row, c_override = false){
    // Return row, converting to start with P0 matching C0 start
    let converted_row = []
    var basis;
    if (CURRENT_BASIS == 'C' || c_override) {
        basis = CURRENT_NOTES[0] - row;
    }
    else if (CURRENT_BASIS == 'I') {
        basis = -row;
    }
    
    // Have: 9, 11
    // Want (0): 0, 2, 
    // Want (1): 1, 3
    // Want (9): 9, 11
    for (let i = 0; i < CURRENT_NOTES.length; i++) {
        let x = CURRENT_NOTES[i] - basis;
        if (x < 0) {
            x += 12;
        }
        else if (x >= 12) {
            x -= 12;
        }
        converted_row.push(x);
    }
    return converted_row;
}

sharps_dict = {
    0: "C",
    1: "C#",
    2: "D",
    3: "D#",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "G#",
    9: "A",
    10: "A#",
    11: "B"
}
flats_dict = {
    0: "C",
    1: "Db",
    2: "D",
    3: "Eb",
    4: "E",
    5: "F",
    6: "Gb",
    7: "G",
    8: "Ab",
    9: "A",
    10: "Bb",
    11: "B"
}
note_values = {
    "C": 0,
    "C#": 1,
    "Db": 1,
    "D": 2,
    "D#": 3,
    "Eb": 3,
    "E": 4,
    "F": 5,
    "F#": 6,
    "Gb": 6,
    "G": 7,
    "G#": 8,
    "Ab": 8,
    "A": 9,
    "A#": 10,
    "Bb": 10,
    "B": 11
}

