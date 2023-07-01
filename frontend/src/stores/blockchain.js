// import NProgress from 'nprogress';
import { writable, get } from 'svelte/store';
import { sleep, Contract, sl } from '../utils';
import BET_CONTRACT_JSON from '../data/contracts/Bet.json';
import DAI_CONTRACT_JSON from '../data/dai';

export const betContract = new Contract();
export const daiContract = new Contract();

export const address = writable(null);
export const info = writable(null);
export const myInfo = writable(null);
export const balance = writable('0');
export const networkInfo = writable({});

export async function load() {
  let networkId = 4;
  let networkName = 'rinkeby';

  if (window.WEB3_WRITES_ENABLED) {
    networkId = await window.WEB3.eth.net.getId();
    networkName = await window.WEB3.eth.net.getNetworkType();
  }

  const networkSupported = networkId in BET_CONTRACT_JSON.networks;

  networkInfo.set({ networkId, networkName, networkSupported });

  if (window.ethereum) {
    // window.ethereum.on('chainChanged', () => {
    //   document.location.reload();
    // });

    window.ethereum.on('accountsChanged', function (accounts) {
      address.set(accounts[0]);
    });
  }

  if (networkSupported) {
    address.subscribe(($address) => {
      betContract.setAccount($address);
      daiContract.setAccount($address);
    });

    betContract.setNetworkId(networkId);
    daiContract.setNetworkId(networkId);

    betContract.setContract(BET_CONTRACT_JSON);
    daiContract.setContract(DAI_CONTRACT_JSON);

    await Promise.all([loadInfo(), loadAccount()]);
  }
}

export async function connectAccount() {
  if (!window.ethereum) {
    return sl('error', 'Please install Metamask browser extension.');
  }
  await window.ethereum.enable();
  await loadAccount();
}

export function disconnectAccount() {
  address.set(null);
}

async function loadInfo() {
  info.set({
    firstDay: await betContract.read('firstDay'),
  });
}

export async function loadAccount() {
  const addr = (await window.WEB3.eth.getAccounts())[0];
  address.set(addr);

  if (addr) Promise.all([loadBalance(), loadMyInfo()]);
}

export async function loadBalance() {
  balance.set(await daiContract.read('balanceOf', [get(address)]));
}

async function loadMyInfo() {}
