function LinkFormatter(value, row, index) {
    return '<a href="' + row.link + '">Follow</a>';
}

function callsignFormatter(value, row, index) {
    return '<code>' + value + '</code>';
}

function icaoHexFormatter(value, row, index) {
    return '<code>' + value + '</code>';
}

const squawkDescriptions = {
    7500: 'Unlawful interference',
    7600: 'Lost communications',
    7700: 'General emergency'
};

function squawkFormatter(value, row, index) {
    const description = squawkDescriptions[value];
    if (description === undefined) {
        return '<code>' + value + '</code>';
    }
    return '<code>' + value + '</code> ' + '<br/>' + '<small>' + description + '</small>';
}

function detectedFormatter(value, row, index) {
    const detected = new Date(value);
    return '<span title="' + value + '">' + detected.toLocaleString() + '</span>';
}

function lastSeenFormatter(value, row, index) {
    const detected = new Date(row.alert_detected);
    const lastSeen = new Date(value);

    return '<span title="' + lastSeen + '">' + lastSeen.toLocaleString() + '<br/>' + ' ' + '<small>' + '(since first detection: ' + humanReadableTimeDuration(detected, lastSeen) + ')' + '</small>' + '</span>';
}

function alertStoppedFormatter(value, row, index) {
    const detected = new Date(row.alert_detected);
    const stopped = new Date(value);

    return '<span title="' + stopped + '">' + value + '<br/>' + ' ' + '<small>' + '(since first detection: ' + humanReadableTimeDuration(detected, stopped) + ')' + '</small>' + '</span>';
}

function humanReadableTimeDuration(start, end) {
    const diffMs = end - start;
    const diffHours = Math.floor(diffMs / 1000 / 60 / 60);
    const diffMinutes = Math.floor(diffMs / 1000 / 60) - diffHours * 60;
    const diffSeconds = Math.floor(diffMs / 1000) - diffHours * 60 * 60 - diffMinutes * 60;

    let val = '';
    if (diffHours > 0) {
        val += diffHours + ' hour';
        if (diffHours > 1) {
            val += 's';
        }
    }

    if (diffMinutes > 0) {
        if (val.length > 0) {
            val += ', ';
        }
        val += diffMinutes + ' minute';
        if (diffMinutes > 1) {
            val += 's';
        }
    }

    if (diffSeconds > 0 || val === '') {
        if (val.length > 0) {
            val += ', ';
        }
        val += diffSeconds + ' second';
        if (diffSeconds > 1) {
            val += 's';
        }
    }

    return val;
}

