// Navigation Active State Logic
document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        // Simple logic: if the href matches the end of the pathname, it's active
        if (currentPath.endsWith(link.getAttribute('href')) || (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Utility: SHA-256 Hash using Web Crypto API
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------
// Live Prices Dashboard Logic
// ---------------------------------------------------------
const PRICES_API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,arbitrum&vs_currencies=usd&include_24hr_change=true';

async function fetchPrices() {
    const btcPriceEl = document.getElementById('btc-price');
    const btcChangeEl = document.getElementById('btc-change');
    const ethPriceEl = document.getElementById('eth-price');
    const ethChangeEl = document.getElementById('eth-change');
    const arbPriceEl = document.getElementById('arb-price');
    const arbChangeEl = document.getElementById('arb-change');
    
    if (!btcPriceEl) return; // Not on the prices page
    
    const refreshBtn = document.getElementById('refresh-btn');
    refreshBtn.innerHTML = 'Refreshing... <div class="loader"></div>';
    refreshBtn.disabled = true;

    try {
        const response = await fetch(PRICES_API_URL);
        const data = await response.json();

        updatePriceCard(data.bitcoin, btcPriceEl, btcChangeEl);
        updatePriceCard(data.ethereum, ethPriceEl, ethChangeEl);
        updatePriceCard(data.arbitrum, arbPriceEl, arbChangeEl);
        
    } catch (error) {
        console.error('Error fetching prices:', error);
        alert('Failed to fetch live prices. Please try again later.');
    } finally {
        setTimeout(() => {
            refreshBtn.innerHTML = 'Refresh Data';
            refreshBtn.disabled = false;
        }, 500); // Small delay for visual feedback
    }
}

function updatePriceCard(coinData, priceEl, changeEl) {
    if(!coinData) return;
    
    priceEl.innerText = `$${coinData.usd.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}`;
    
    const change = coinData.usd_24h_change;
    const isPositive = change >= 0;
    
    changeEl.className = `change ${isPositive ? 'up' : 'down'}`;
    changeEl.innerHTML = `${isPositive ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%`;
}

// ---------------------------------------------------------
// Block Simulator Logic
// ---------------------------------------------------------
let isMining = false;

async function calculateBlockHash(blockNumber) {
    const data = document.getElementById(`block${blockNumber}-data`).value;
    const nonce = document.getElementById(`block${blockNumber}-nonce`).value;
    const prevHash = document.getElementById(`block${blockNumber}-prev`).value;
    
    const combinedStr = data + nonce + prevHash;
    const hash = await sha256(combinedStr);
    
    const hashEl = document.getElementById(`block${blockNumber}-hash`);
    const blockEl = document.getElementById(`block${blockNumber}`);
    const statusEl = document.getElementById(`block${blockNumber}-status`);
    
    hashEl.innerText = hash;
    
    // Valid block condition: hash starts with '00'
    const isValid = hash.startsWith('00');
    
    if (isValid) {
        blockEl.classList.remove('invalid');
        blockEl.classList.add('valid');
        statusEl.innerText = 'Valid Block';
    } else {
        blockEl.classList.remove('valid');
        blockEl.classList.add('invalid');
        statusEl.innerText = 'Invalid Block';
    }
    
    // If we update Block 1, propagate its hash to Block 2's previous hash
    if (blockNumber === 1) {
        const block2PrevEl = document.getElementById('block2-prev');
        if (block2PrevEl) {
            block2PrevEl.value = hash;
            // Recursively update block 2 when block 1 changes
            calculateBlockHash(2);
        }
    }
}

async function mineBlock(blockNumber) {
    if (isMining) return;
    isMining = true;
    
    const mineBtn = document.getElementById(`block${blockNumber}-mine`);
    const originalText = mineBtn.innerText;
    mineBtn.innerHTML = 'Mining... <div class="loader"></div>';
    mineBtn.disabled = true;
    
    const data = document.getElementById(`block${blockNumber}-data`).value;
    const prevHash = document.getElementById(`block${blockNumber}-prev`).value;
    let nonce = 0;
    let hash = '';
    
    // Simulate mining by finding a nonce that gives a hash starting with "00"
    // To prevent infinite UI freezing, we do it in small chunks using setTimeout/Promises
    // but JS crypto is fast enough for '00' (1 in 256 chance) to do synchronously.
    
    // We'll use a fast synchronous hash if possible, but Web Crypto is async.
    // So we loop asynchronously.
    
    const findNonce = async () => {
        while(true) {
            const combinedStr = data + nonce + prevHash;
            hash = await sha256(combinedStr);
            if (hash.startsWith('00')) {
                break;
            }
            nonce++;
            
            // Safety break just in case
            if (nonce > 50000) {
                break;
            }
        }
        
        document.getElementById(`block${blockNumber}-nonce`).value = nonce;
        await calculateBlockHash(blockNumber);
        
        mineBtn.innerText = originalText;
        mineBtn.disabled = false;
        isMining = false;
    };
    
    // Slight timeout to allow UI to update to "Mining..." state
    setTimeout(findNonce, 10);
}

// Setup Event Listeners for Simulator
function initSimulator() {
    const b1Data = document.getElementById('block1-data');
    if (!b1Data) return; // Not on simulator page
    
    // Add input listeners to auto-calculate hashes
    ['block1', 'block2'].forEach(block => {
        document.getElementById(`${block}-data`).addEventListener('input', () => calculateBlockHash(parseInt(block.replace('block', ''))));
        document.getElementById(`${block}-nonce`).addEventListener('input', () => calculateBlockHash(parseInt(block.replace('block', ''))));
        document.getElementById(`${block}-prev`).addEventListener('input', () => calculateBlockHash(parseInt(block.replace('block', ''))));
        
        document.getElementById(`${block}-mine`).addEventListener('click', () => mineBlock(parseInt(block.replace('block', ''))));
    });
    
    // Initial calculation
    calculateBlockHash(1);
}

// Initialize appropriate scripts based on current page
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById('btc-price')) {
        fetchPrices();
        document.getElementById('refresh-btn').addEventListener('click', fetchPrices);
    }
    
    if (document.getElementById('block1-data')) {
        initSimulator();
    }
});
