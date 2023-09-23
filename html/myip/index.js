// Defining async function
async function getApiData(apiUrlIp, apiUrlFeedCount) {

    // First the user stats...
    // Storing response
    const userStatsResponse = await fetch(apiUrlIp);

    // Storing data in form of JSON
    const userData = await userStatsResponse.json();
    updateUserStats(userData);

    // Now site stats...
    // Storing response
    const siteStatsResponse = await fetch(apiUrlFeedCount);

    // Storing data in form of JSON
    const siteData = await siteStatsResponse.json();
    updateSiteStats(siteData);
}


function secondsToDhms(seconds) {
    seconds = Number(seconds);
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor(seconds % (3600 * 24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.floor(seconds % 60);

    const dDisplay = d > 0 ? d + (d === 1 ? " day, " : " days, ") : "";
    const hDisplay = h > 0 ? h + (h === 1 ? " hour, " : " hours, ") : "";
    const mDisplay = m > 0 ? m + (m === 1 ? " minute, " : " minutes, ") : "";
    const sDisplay = s > 0 ? s + (s === 1 ? " second" : " seconds") : "";

    return dDisplay + hDisplay + mDisplay + sDisplay;
}

/**
 * Replaces sections of the UUID to obfuscate it.
 * - Many folks will screenshot this page and share it.
 * - The UUID identifies the feeder setup, and anybody else copying/using this value could be problematic.
 */
function getObfuscatedUuid(uuid) {
    return uuid === null ?
        'null' :
        uuid.split('-')
            .map((item, i) => (i < 1 || i > 3) ? item : '....')
            .join('-');
}

/**
 * Replaces sections of the IP address to obfuscate it.
 * - Many folks will screenshot this page and share it.
 * - The IP address is not particularly sensitive, but it can be PII
 *   and many users will be hesitant to share it so let's proactively obfuscate it.
 */
function getObfuscatedUserIp(userIp) {
    return userIp
        .split('.')
        .map((item, i) => i < 2 ? 'xxx' : item)
        .join('.');
}

function statusRowForUuid(data, uuid) {

    const beastData = data.beastData.filter(item => item.uuid === uuid);
    let beastColHtml = `
    <div class="col-sm">
      <div class="card border-danger">
        <div class="card-header">
          <h4 class="card-title"><span class="statusdot inactive_feed beastdot"></span> Beast ADS-B</h4>
        </div>
        <div class="card-body">
          <div id="beaststats">
            <strong>No beast data for this UUID</strong>
          </div>
        </div>
      </div>
    </div>`;

    if (beastData.length === 1) {
        const beastEntry = beastData[0];

        beastColHtml = `
    <div class="col-sm">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title"><span class="statusdot active_feed beastdot"></span> Beast ADS-B</h4>
        </div>
        <div class="card-body">

          <div id="beaststats">
            <ul>
              <li>Messages: <span id="msgsec">` + beastEntry.messagesPerSecond + `</span>/sec</li>
              <li>Positions: <span id="possec">` + beastEntry.positionsPerSecond + `</span>/sec</li>
              <li>Positions total: <span id="postotal">` + beastEntry.positionsTotal + `</span></li>
              <li>Bandwidth: <span id="bandwidth">` + beastEntry.bandwidthKbps + `</span>kbit/s</li>
              <li>Latency: <span id="latency">` + beastEntry.latencyMs + `</span>ms</li>
              <li>Connection time: <span id="latency">` + secondsToDhms(beastEntry.connectionTimeSeconds) + `</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>`
    }

    const mlatData = data.mlatData.filter(item => item.uuid === uuid);
    let mlatColHtml = `
    <div class="col-sm">
      <div class="card border-danger">
        <div class="card-header">
          <h4 class="card-title"><span class="statusdot inactive_feed mlatdot"></span> MLAT</h4>
        </div>
        <div class="card-body">
          <div id="mlatstats">
            <strong>No MLAT data for this UUID</strong>
          </div>
        </div>
      </div>
    </div>`;

    if (mlatData.length === 1) {
        const mlatEntry = mlatData[0];

        mlatColHtml = `
    <div class="col-sm">
      <div class="card">
        <div class="card-header">
          <h4 class="card-title"><span class="statusdot active_feed mlatdot"></span> MLAT</h4>
        </div>
        <div class="card-body">
          <div id="mlatstats">
            <ul>
              <li>Name: <span id="mlatusername">` + mlatEntry.user + `</span></li>
              <li>Messages: <span id="mlatmsgrate">` + mlatEntry.message_rate + `</span>/sec</li>
              <li>Peers: <span id="mlatpeers">` + mlatEntry.peer_count + `</span></li>
              <li>Timeout: <span id="mlattimeout">` + mlatEntry.bad_sync_timeout + `</span></li>
              <li>Outlier %: <span id="mlatoutlier">` + mlatEntry.outlier_percent + `%</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>`;
    }

    const obfuscatedUuid = getObfuscatedUuid(uuid);
    const output = `
  <div class="row gx-3 mt-3">
    <h3>UUID: <code>` + obfuscatedUuid + `</code></h3>
    ` + beastColHtml + `
    ` + mlatColHtml + `
  </div>`;

    return output;
}
function noDataToDisplayForThisIpAddress() {
    let beastHtml = `
    <div class="col-sm">
      <div class="card border-danger">
        <div class="card-header">
          <h4 class="card-title"><span class="statusdot inactive_feed beastdot"></span> Beast ADS-B</h4>
        </div>
        <div class="card-body border-danger">
          <div id="beaststats">
            <strong>No beast data for this IP address</strong>
          </div>
        </div>
      </div>
    </div>`;


    let mlatHtml = `
    <div class="col-sm">
      <div class="card border-danger">
        <div class="card-header">
          <h4 class="card-title"><span class="statusdot inactive_feed mlatdot"></span> MLAT</h4>
        </div>
        <div class="card-body">
          <div id="mlatstats">
            <strong>No MLAT data for this IP address</strong>
          </div>
        </div>
      </div>
    </div>`;

    const noData = `
    <div class="col-sm mb-4">
        <div class="card">
            <div class="card-header bg-light">
                <h3 class="card-title"><span class="statusdot inactive_feed mlatdot"></span> No ADSB data for this IP address</h3>
            </div>
            <div class="card-body">
                <p>
                    <h4>Getting Started</h4>
                </p>
                <p>
                    If you do not yet have an ADSB system setup to feed data to the OARC ADSB server, you will need:
                </p>
                <ol>
                    <li><strong>Hardware</strong> - a Raspberry Pi or similar, with an antenna and SDR to recieve radio signals</li>
                    <li><strong>Software</strong> - to interpret radio signals and convert them to digital/textual ADSB data (recommended: <code>readsb</code>, installed using <a href="https://github.com/mpentler/oarc-adsb-scripts/">the OARC installation scripts</a>)</li>
                    <li><strong>OARC-specific configuration</strong> - to send ADSB data to the OARC server, see the <a href="https://github.com/mpentler/oarc-adsb-scripts/">installation script documentaton</a> for details</li>
                </ol>
                <p>
                    <h4>Troubleshooting tips</h4>
                </p>
                <p>
                    If you have an ADSB feed setup, but are not seeing data:
                </p>
                <ul>
                    <li><strong>IP Address match</strong> - Are you connecting from a network which is different to your feeder's network (e.g., 4G or via VPN)?</li>
                    <li><strong>Feed running correctly</strong> - See notes within the <a href="https://github.com/mpentler/oarc-adsb-scripts/">script documentation</a> for log and support information</li>
                </ul>
                <p>
                    <h4>Learning more / Additional support</h4>
                </p>
                <ul>
                    <li>The OARC community welcomes discussion via the ADSB Discord channel - <code>#adsb-flight-tracking</code></li>
                    <li>Also available is the <a href="https://wiki.oarc.uk/flight:adsb">OARC Wiki pages</a> which contain more more guidance and information about ADSB</li>
                </ul>
            </div>
        </div>
    </div>
`;

    const output = `
    ` + noData + `
  <div class="row gx-3">
    ` + beastHtml + `
    ` + mlatHtml + `
  </div>`;

    return output;
}


// Function to update both user stats panels
function updateUserStats(data) {
    // Show user's IP
    const userIp = data.ip;
    const userIpObfuscated = getObfuscatedUserIp(userIp);
    document.getElementById("userip").innerHTML = userIpObfuscated;

    // If two UUIDs, one for Beast and one for MLAT, then this is likely an old OARC installation.
    if (data.uuids.length === 2 && data.beastData.length === 1 && data.mlatData.length === 1) {
        document.getElementById('update_oarc_client_alert').classList.remove('d-none');
    }
    // If a null UUID is present, this is potentially problematic and the user should be alerted.
    if(data.uuids.includes(null)) {
        document.getElementById('null_uuid_alert').classList.remove('d-none');
    }

    let statusRows = [noDataToDisplayForThisIpAddress()];
    if (data.uuids.length > 0) {
        console.info('uuids present...')
        statusRows = data.uuids.map(uuid => statusRowForUuid(data, uuid));
    }

    document.getElementById("status_rows").innerHTML = '<div class="col">' + statusRows.join('\n') + '</div>';

}

// Function to update site feed count data
function updateSiteStats(data) {
    document.getElementById("beastcount").innerHTML = data[0];
    document.getElementById("mlatcount").innerHTML = data[1];
}
